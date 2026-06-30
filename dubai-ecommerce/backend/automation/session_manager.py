"""
Registration session state machine, screenshot management, and OTP relay.

State flow: idle → running → waiting_for_* → completed | error
"""

import asyncio
import json
import os
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Optional

UPLOADS_BASE = Path(__file__).parent.parent / "uploads"

# Chromium executable path (pre-installed in the CCR environment)
_CHROMIUM_CANDIDATES = [
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    "/opt/pw-browsers/chromium-1168/chrome-linux/chrome",
    "/opt/pw-browsers/chromium/chrome-linux/chrome",
    "/opt/pw-browsers/chromium-1140/chrome-linux/chrome",
]


def _find_chromium() -> Optional[str]:
    # Try exact candidates first
    for path in _CHROMIUM_CANDIDATES:
        if os.path.exists(path):
            return path
    # Glob fallback
    import glob
    matches = glob.glob("/opt/pw-browsers/chromium*/chrome-linux/chrome")
    if matches:
        return sorted(matches)[-1]  # highest version number
    return None


class SessionState(str, Enum):
    idle = "idle"
    running = "running"
    waiting_for_email = "waiting_for_email"
    waiting_for_otp = "waiting_for_otp"
    waiting_for_captcha = "waiting_for_captcha"
    waiting_for_human_action = "waiting_for_human_action"
    completed = "completed"
    error = "error"


@dataclass
class StepRecord:
    step_number: int
    step_name: str
    started_at: str
    completed_at: Optional[str] = None
    screenshot_filename: Optional[str] = None
    error: Optional[str] = None


@dataclass
class RegistrationStatus:
    platform: str
    state: SessionState = SessionState.idle
    current_step: int = 0
    total_steps: int = 12
    current_step_name: str = ""
    progress_pct: int = 0
    waiting_prompt: Optional[str] = None
    latest_screenshot: Optional[str] = None
    steps_completed: list = field(default_factory=list)
    error_message: Optional[str] = None
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    human_action_required: bool = False
    human_action_description: Optional[str] = None


@dataclass
class CompanyProfile:
    company_name: str
    free_zone_address: str
    owner_name: str
    email: str
    phone: str      # +971XXXXXXXXX
    iban: str       # AE IBAN
    password: str   # for platform accounts


class RegistrationSession:
    def __init__(self, platform: str):
        self.platform = platform
        self.status = RegistrationStatus(platform=platform)
        self._otp_event: asyncio.Event = asyncio.Event()
        self._otp_value: Optional[str] = None
        self._status_path = UPLOADS_BASE / "status" / f"{platform}_status.json"
        self._screenshot_dir = UPLOADS_BASE / "screenshots" / platform
        self._screenshot_dir.mkdir(parents=True, exist_ok=True)
        self._load_persisted_status()

    def update_step(
        self,
        step_number: int,
        step_name: str,
        state: SessionState = SessionState.running,
        waiting_prompt: Optional[str] = None,
        human_action_description: Optional[str] = None,
    ) -> None:
        now = datetime.now(timezone.utc).isoformat()
        # Mark previous step completed
        if self.status.steps_completed:
            last = self.status.steps_completed[-1]
            if isinstance(last, dict) and last.get("completed_at") is None:
                last["completed_at"] = now
        # Add new step record
        record = StepRecord(
            step_number=step_number,
            step_name=step_name,
            started_at=now,
        )
        self.status.steps_completed.append(asdict(record))
        self.status.current_step = step_number
        self.status.current_step_name = step_name
        self.status.state = state
        self.status.progress_pct = int(step_number / self.status.total_steps * 100)
        self.status.waiting_prompt = waiting_prompt
        self.status.human_action_required = human_action_description is not None
        self.status.human_action_description = human_action_description
        if state == SessionState.running and self.status.started_at is None:
            self.status.started_at = now
        self._persist()

    def record_screenshot(self, filename: str) -> None:
        self.status.latest_screenshot = filename
        if self.status.steps_completed:
            self.status.steps_completed[-1]["screenshot_filename"] = filename
        self._persist()

    async def wait_for_otp(self, prompt: str, timeout_seconds: int = 600) -> str:
        """Block until submit_otp() is called. Returns the submitted value."""
        self._otp_event.clear()
        self._otp_value = None
        self.status.waiting_prompt = prompt
        self._persist()
        try:
            await asyncio.wait_for(self._otp_event.wait(), timeout=timeout_seconds)
        except asyncio.TimeoutError:
            raise TimeoutError(f"Timed out waiting for user input: {prompt}")
        value = self._otp_value
        self._otp_event.clear()
        self._otp_value = None
        return value

    def submit_otp(self, value: str) -> None:
        """Called by the API endpoint to unblock a waiting automation."""
        self._otp_value = value
        self._otp_event.set()

    def set_error(self, message: str) -> None:
        self.status.state = SessionState.error
        self.status.error_message = message
        self.status.completed_at = datetime.now(timezone.utc).isoformat()
        self._otp_event.set()  # unblock any waiting coroutine
        self._persist()

    def set_completed(self) -> None:
        now = datetime.now(timezone.utc).isoformat()
        if self.status.steps_completed:
            last = self.status.steps_completed[-1]
            if isinstance(last, dict) and last.get("completed_at") is None:
                last["completed_at"] = now
        self.status.state = SessionState.completed
        self.status.progress_pct = 100
        self.status.completed_at = now
        self.status.waiting_prompt = None
        self._persist()

    def get_status_dict(self) -> dict:
        d = asdict(self.status)
        d["state"] = self.status.state.value
        return d

    def _persist(self) -> None:
        try:
            self._status_path.parent.mkdir(parents=True, exist_ok=True)
            tmp = self._status_path.with_suffix(".tmp")
            tmp.write_text(json.dumps(self.get_status_dict(), indent=2, default=str))
            tmp.replace(self._status_path)
        except Exception:
            pass  # non-fatal; status is also in-memory

    def _load_persisted_status(self) -> None:
        if not self._status_path.exists():
            return
        try:
            data = json.loads(self._status_path.read_text())
            # Only restore terminal states; don't pretend running tasks are still running
            if data.get("state") in (SessionState.completed.value, SessionState.error.value):
                self.status.state = SessionState(data["state"])
                self.status.current_step = data.get("current_step", 0)
                self.status.current_step_name = data.get("current_step_name", "")
                self.status.progress_pct = data.get("progress_pct", 0)
                self.status.steps_completed = data.get("steps_completed", [])
                self.status.error_message = data.get("error_message")
                self.status.started_at = data.get("started_at")
                self.status.completed_at = data.get("completed_at")
                self.status.latest_screenshot = data.get("latest_screenshot")
        except Exception:
            pass


# ─── Module-level session registry ─────────────────────────────────────────────

_sessions: dict[str, RegistrationSession] = {}


def get_session(platform: str) -> Optional[RegistrationSession]:
    return _sessions.get(platform)


def get_or_create_session(platform: str) -> RegistrationSession:
    if platform not in _sessions:
        _sessions[platform] = RegistrationSession(platform)
    return _sessions[platform]


# ─── Browser helpers ───────────────────────────────────────────────────────────

async def launch_browser(headless: bool = True):
    """Launch pre-installed Chromium. Returns (pw, browser, context, page)."""
    from playwright.async_api import async_playwright

    os.environ.setdefault("PLAYWRIGHT_BROWSERS_PATH", "/opt/pw-browsers")
    os.environ.setdefault("PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD", "1")

    executable = _find_chromium()

    pw = await async_playwright().start()

    launch_kwargs = dict(
        headless=headless,
        args=[
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-blink-features=AutomationControlled",
            "--disable-gpu",
        ],
    )
    if executable:
        launch_kwargs["executable_path"] = executable

    browser = await pw.chromium.launch(**launch_kwargs)
    context = await browser.new_context(
        viewport={"width": 1280, "height": 900},
        locale="en-US",
        timezone_id="Asia/Dubai",
        user_agent=(
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        ),
        accept_downloads=True,
    )
    await context.add_init_script(
        "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    )
    page = await context.new_page()
    return pw, browser, context, page


async def save_screenshot(page, session: RegistrationSession, step_label: str) -> str:
    """Take screenshot, save to uploads/screenshots/{platform}/, return filename."""
    ts = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    safe_label = "".join(c if c.isalnum() or c == "_" else "_" for c in step_label)[:40]
    filename = f"{ts}_{safe_label}.png"
    path = session._screenshot_dir / filename
    try:
        await page.screenshot(path=str(path), full_page=False)
        session.record_screenshot(filename)
    except Exception:
        pass
    return filename


async def _safe_fill(page, selector: str, value: str, timeout: int = 5000) -> bool:
    try:
        await page.wait_for_selector(selector, timeout=timeout)
        await page.fill(selector, value)
        return True
    except Exception:
        return False


async def _try_selectors(page, selectors: list, action: str, value: str = "", timeout: int = 3000) -> bool:
    """Try multiple selectors in priority order."""
    for sel in selectors:
        try:
            if action == "click":
                await page.click(sel, timeout=timeout)
                return True
            elif action == "fill":
                await page.fill(sel, value, timeout=timeout)
                return True
        except Exception:
            continue
    return False

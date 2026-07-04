"""
noon.com Seller Lab registration — 12-step Playwright automation.

Steps: create customer account → email verify → SMS OTP → seller lab onboarding
       → company details → document uploads → bank IBAN → submit
"""

from pathlib import Path

from .session_manager import (
    CompanyProfile,
    RegistrationSession,
    SessionState,
    launch_browser,
    save_screenshot,
    _safe_fill,
    _try_selectors,
    UPLOADS_BASE,
)

TOTAL_STEPS = 12


async def run_noon_registration(profile: CompanyProfile, session: RegistrationSession) -> None:
    """
    Full noon.com seller registration Playwright flow.
    Runs as an asyncio background task. Pauses at human-required steps.
    """
    session.status.total_steps = TOTAL_STEPS
    pw = browser = context = page = None
    try:
        pw, browser, context, page = await launch_browser(headless=True)

        # ── STEP 1: Navigate to sell.noon.com ──────────────────────────────────
        session.update_step(1, "sell.noon.com'a gidiliyor", SessionState.running)
        for _attempt in range(3):
            try:
                await page.goto("https://sell.noon.com", wait_until="load", timeout=60000)
                break
            except Exception:
                if _attempt == 2:
                    raise
                await page.wait_for_timeout(4000)
        await page.wait_for_timeout(2000)
        await save_screenshot(page, session, "01_noon_homepage")

        # ── STEP 2: Start account creation ─────────────────────────────────────
        session.update_step(2, "Hesap oluşturma başlatılıyor", SessionState.running)

        # Try to find signup/register button
        signup_selectors = [
            "text=Sign Up",
            "text=Register",
            "text=Create Account",
            "text=Get Started",
            'a[href*="register"]',
            'a[href*="signup"]',
            'button:has-text("Sign")',
        ]
        clicked = await _try_selectors(page, signup_selectors, "click")
        if not clicked:
            # noon often redirects directly to id.noon.com — try navigating there
            await page.goto(
                "https://www.noon.com/uae-en/register/",
                wait_until="domcontentloaded",
                timeout=20000,
            )
            await page.wait_for_timeout(1500)

        await save_screenshot(page, session, "02_signup_page")

        # ── STEP 3: Fill registration form ─────────────────────────────────────
        session.update_step(3, "Kayıt formu dolduruluyor", SessionState.running)

        first_name = profile.owner_name.split()[0] if profile.owner_name else "Seller"
        last_name = " ".join(profile.owner_name.split()[1:]) if len(profile.owner_name.split()) > 1 else "Account"

        name_selectors = [
            ('[name="firstName"]', first_name),
            ('[name="first_name"]', first_name),
            ('[placeholder*="First"]', first_name),
            ('[placeholder*="first"]', first_name),
        ]
        for sel, val in name_selectors:
            if await _safe_fill(page, sel, val, timeout=3000):
                break

        last_name_selectors = [
            ('[name="lastName"]', last_name),
            ('[name="last_name"]', last_name),
            ('[placeholder*="Last"]', last_name),
            ('[placeholder*="last"]', last_name),
        ]
        for sel, val in last_name_selectors:
            if await _safe_fill(page, sel, val, timeout=3000):
                break

        email_selectors = ['[name="email"]', '[type="email"]', '[placeholder*="email"]']
        for sel in email_selectors:
            if await _safe_fill(page, sel, profile.email, timeout=3000):
                break

        phone_selectors = ['[name="phone"]', '[name="mobile"]', '[type="tel"]', '[placeholder*="phone"]', '[placeholder*="mobile"]']
        for sel in phone_selectors:
            if await _safe_fill(page, sel, profile.phone, timeout=3000):
                break

        pw_selectors = ['[name="password"]', '[type="password"]']
        for sel in pw_selectors:
            if await _safe_fill(page, sel, profile.password, timeout=3000):
                break

        await save_screenshot(page, session, "03_form_filled")

        # Submit the registration form
        submit_selectors = [
            'button[type="submit"]',
            'button:has-text("Create Account")',
            'button:has-text("Register")',
            'button:has-text("Sign Up")',
            'button:has-text("Continue")',
            '[data-testid="submit"]',
        ]
        await _try_selectors(page, submit_selectors, "click")
        await page.wait_for_timeout(3000)
        await save_screenshot(page, session, "03b_after_submit")

        # ── STEP 4: Email verification ──────────────────────────────────────────
        session.update_step(
            4,
            "Email doğrulama bekleniyor",
            SessionState.waiting_for_email,
            waiting_prompt=(
                f"noon, {profile.email} adresine bir doğrulama emaili gönderdi. "
                "Emailinizi açın ve doğrulama linkine tıklayın. "
                "Tıkladıktan sonra aşağıdaki 'Email Doğrulandı — Devam Et' butonuna basın."
            ),
        )
        await save_screenshot(page, session, "04_email_verification_wait")
        await session.wait_for_otp("Email doğrulama linki tıklandıktan sonra devam edin")

        # ── STEP 5: SMS OTP ─────────────────────────────────────────────────────
        session.update_step(
            5,
            "SMS OTP bekleniyor",
            SessionState.waiting_for_otp,
            waiting_prompt=f"{profile.phone} numarasına gönderilen 6 haneli SMS kodunu girin.",
        )
        await save_screenshot(page, session, "05_otp_wait")
        otp = await session.wait_for_otp(f"SMS OTP — {profile.phone}")
        session.update_step(5, "SMS OTP giriliyor", SessionState.running)

        # Fill OTP
        otp_selectors = [
            '[data-testid="otp-input"]',
            '[name="otp"]',
            '[placeholder*="OTP"]',
            '[placeholder*="code"]',
            '[placeholder*="Code"]',
            'input[maxlength="6"]',
            'input[maxlength="1"]',  # individual digit boxes
        ]
        otp_filled = False
        for sel in otp_selectors:
            try:
                elements = await page.query_selector_all(sel)
                if len(elements) == 6:  # individual digit boxes
                    for i, el in enumerate(elements):
                        await el.fill(otp[i] if i < len(otp) else "")
                    otp_filled = True
                    break
                elif len(elements) == 1:
                    await elements[0].fill(otp)
                    otp_filled = True
                    break
            except Exception:
                continue

        if otp_filled:
            await _try_selectors(page, submit_selectors, "click")
            await page.wait_for_timeout(3000)

        await save_screenshot(page, session, "05_otp_submitted")

        # ── STEP 6: Navigate to Seller Lab ─────────────────────────────────────
        session.update_step(6, "Seller Lab'a gidiliyor", SessionState.running)
        await page.goto("https://sell.noon.com", wait_until="load", timeout=60000)
        await page.wait_for_timeout(2000)

        seller_lab_selectors = [
            "text=Start Selling",
            "text=Become a Seller",
            "text=Sell on noon",
            'a[href*="seller"]',
            'a[href*="vendor"]',
            'button:has-text("Start")',
        ]
        await _try_selectors(page, seller_lab_selectors, "click")
        await page.wait_for_timeout(2000)
        await save_screenshot(page, session, "06_seller_lab")

        # ── STEP 7: Business type selection ────────────────────────────────────
        session.update_step(7, "İşletme türü seçiliyor (Serbest Bölge)", SessionState.running)

        business_type_selectors = [
            "text=Free Zone",
            "text=LLC",
            "text=Limited",
            '[value="free_zone"]',
            '[value="LLC"]',
        ]
        await _try_selectors(page, business_type_selectors, "click")
        await page.wait_for_timeout(1000)
        await save_screenshot(page, session, "07_business_type")

        # ── STEP 8: Company details ─────────────────────────────────────────────
        session.update_step(8, "Şirket bilgileri dolduruluyor", SessionState.running)

        company_name_selectors = [
            '[name="companyName"]',
            '[name="company_name"]',
            '[name="businessName"]',
            '[placeholder*="company"]',
            '[placeholder*="Company"]',
            '[placeholder*="business"]',
            '[placeholder*="Business"]',
        ]
        for sel in company_name_selectors:
            if await _safe_fill(page, sel, profile.company_name, timeout=3000):
                break

        address_selectors = [
            '[name="address"]',
            '[name="businessAddress"]',
            '[placeholder*="address"]',
            '[placeholder*="Address"]',
        ]
        for sel in address_selectors:
            if await _safe_fill(page, sel, profile.free_zone_address, timeout=3000):
                break

        await save_screenshot(page, session, "08_company_details")

        # Try to proceed to next page
        next_selectors = [
            'button:has-text("Next")',
            'button:has-text("Continue")',
            'button[type="submit"]',
        ]
        await _try_selectors(page, next_selectors, "click")
        await page.wait_for_timeout(2000)

        # ── STEP 9: Upload Trade License ────────────────────────────────────────
        session.update_step(9, "Ticaret Lisansı yükleniyor", SessionState.running)

        trade_license_files = list((UPLOADS_BASE / "documents").glob("trade_license.*"))
        if trade_license_files:
            doc_path = str(trade_license_files[0])
            try:
                file_inputs = page.locator('input[type="file"]')
                count = await file_inputs.count()
                if count > 0:
                    await file_inputs.first.set_input_files(doc_path)
                    await page.wait_for_timeout(2000)
            except Exception as e:
                session.status.steps_completed[-1]["error"] = f"Trade license upload warning: {e}"

        await save_screenshot(page, session, "09_trade_license")

        # ── STEP 10: Upload Passport ────────────────────────────────────────────
        session.update_step(10, "Pasaport yükleniyor", SessionState.running)

        passport_files = list((UPLOADS_BASE / "documents").glob("passport.*"))
        if passport_files:
            doc_path = str(passport_files[0])
            try:
                file_inputs = page.locator('input[type="file"]')
                count = await file_inputs.count()
                if count > 1:
                    await file_inputs.nth(1).set_input_files(doc_path)
                elif count == 1:
                    await file_inputs.first.set_input_files(doc_path)
                await page.wait_for_timeout(2000)
            except Exception as e:
                session.status.steps_completed[-1]["error"] = f"Passport upload warning: {e}"

        await save_screenshot(page, session, "10_passport")

        # ── STEP 11: Bank IBAN ──────────────────────────────────────────────────
        session.update_step(11, "Banka IBAN giriliyor", SessionState.running)

        iban_selectors = [
            '[name="iban"]',
            '[name="IBAN"]',
            '[name="bankAccount"]',
            '[name="accountNumber"]',
            '[placeholder*="IBAN"]',
            '[placeholder*="iban"]',
            '[placeholder*="account"]',
        ]
        for sel in iban_selectors:
            if await _safe_fill(page, sel, profile.iban, timeout=3000):
                break

        await save_screenshot(page, session, "11_bank_iban")

        # ── STEP 12: Submit and await approval ─────────────────────────────────
        session.update_step(12, "Başvuru gönderiliyor — onay bekleniyor", SessionState.running)

        final_submit_selectors = [
            'button:has-text("Submit")',
            'button:has-text("Apply")',
            'button:has-text("Register")',
            'button:has-text("Finish")',
            'button:has-text("Complete")',
            'button[type="submit"]',
        ]
        await _try_selectors(page, final_submit_selectors, "click")
        await page.wait_for_timeout(3000)
        await save_screenshot(page, session, "12_submitted")

        session.set_completed()

    except TimeoutError as e:
        if page:
            await save_screenshot(page, session, "error_timeout")
        session.set_error(str(e))

    except Exception as e:
        if page:
            try:
                await save_screenshot(page, session, "error_state")
            except Exception:
                pass
        session.set_error(
            f"Otomasyon hatası (Adım {session.status.current_step} — "
            f"{session.status.current_step_name}): {e}"
        )

    finally:
        if context:
            try:
                await context.close()
            except Exception:
                pass
        if browser:
            try:
                await browser.close()
            except Exception:
                pass
        if pw:
            try:
                await pw.stop()
            except Exception:
                pass

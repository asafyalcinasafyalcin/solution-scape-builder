"""
Amazon.ae Seller Central registration — 14-step Playwright automation.

Steps: account creation → email OTP → professional plan → company info
       → address → phone OTP → billing → document uploads → video verification pause → submit
"""

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

TOTAL_STEPS = 14


async def run_amazon_registration(profile: CompanyProfile, session: RegistrationSession) -> None:
    """
    Amazon.ae Seller Central registration Playwright flow.
    Video identity verification step CANNOT be automated — pauses for user.
    """
    session.status.total_steps = TOTAL_STEPS
    pw = browser = context = page = None
    try:
        pw, browser, context, page = await launch_browser(headless=True)

        # ── STEP 1: Navigate to sell.amazon.ae ─────────────────────────────────
        session.update_step(1, "sell.amazon.ae'ye gidiliyor", SessionState.running)
        await page.goto("https://sell.amazon.ae", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(2000)
        await save_screenshot(page, session, "01_amazon_homepage")

        # ── STEP 2: Start Selling ───────────────────────────────────────────────
        session.update_step(2, "Satış başlatma tıklanıyor", SessionState.running)

        start_selectors = [
            'a:has-text("Start selling")',
            'a:has-text("Start Selling")',
            'button:has-text("Start selling")',
            'a[href*="registration"]',
            'a[href*="register"]',
            ".a-button-primary",
        ]
        await _try_selectors(page, start_selectors, "click")
        await page.wait_for_timeout(3000)
        await save_screenshot(page, session, "02_start_selling")

        # ── STEP 3: Create Amazon account (email + password) ───────────────────
        session.update_step(3, "Hesap bilgileri dolduruluyor", SessionState.running)

        # Amazon may show "Sign in" or "Create account" — look for create
        create_acc_selectors = [
            "text=Create your Amazon account",
            "text=Create account",
            'a[id*="create"]',
            'span:has-text("Create")',
        ]
        await _try_selectors(page, create_acc_selectors, "click", timeout=5000)
        await page.wait_for_timeout(1500)

        name_selectors = ['[name="customerName"]', '[id="ap_customer_name"]', '[name="name"]']
        for sel in name_selectors:
            if await _safe_fill(page, sel, profile.owner_name, timeout=3000):
                break

        email_selectors = ['[name="email"]', '[id="ap_email"]', '[type="email"]']
        for sel in email_selectors:
            if await _safe_fill(page, sel, profile.email, timeout=3000):
                break

        pw_selectors = ['[name="password"]', '[id="ap_password"]', '[type="password"]']
        for sel in pw_selectors:
            if await _safe_fill(page, sel, profile.password, timeout=3000):
                break

        pw_check_selectors = ['[name="passwordCheck"]', '[id="ap_password_check"]']
        for sel in pw_check_selectors:
            if await _safe_fill(page, sel, profile.password, timeout=3000):
                break

        await save_screenshot(page, session, "03_account_form")

        submit_selectors = [
            'input[id="continue"]',
            'input[type="submit"]',
            'button[type="submit"]',
            'span:has-text("Continue")',
        ]
        await _try_selectors(page, submit_selectors, "click")
        await page.wait_for_timeout(3000)
        await save_screenshot(page, session, "03b_after_submit")

        # ── STEP 4: Email OTP verification ─────────────────────────────────────
        session.update_step(
            4,
            "Email OTP bekleniyor",
            SessionState.waiting_for_otp,
            waiting_prompt=(
                f"{profile.email} adresine Amazon'dan bir doğrulama kodu geldi. "
                "Email'inizi açın ve 6 haneli kodu aşağıya girin."
            ),
        )
        await save_screenshot(page, session, "04_email_otp_wait")
        email_otp = await session.wait_for_otp(f"Email OTP — {profile.email}")

        session.update_step(4, "Email OTP giriliyor", SessionState.running)
        otp_selectors = [
            '[name="cvf-input-code"]',
            'input[placeholder*="code"]',
            '[id*="otp"]',
            'input[maxlength="6"]',
        ]
        for sel in otp_selectors:
            if await _safe_fill(page, sel, email_otp, timeout=3000):
                break

        await _try_selectors(page, submit_selectors, "click")
        await page.wait_for_timeout(3000)
        await save_screenshot(page, session, "04_email_otp_submitted")

        # ── STEP 5: Professional plan selection ────────────────────────────────
        session.update_step(5, "Profesyonel plan seçiliyor", SessionState.running)

        prof_selectors = [
            "text=Professional",
            '[data-value="professional"]',
            'button:has-text("Sign up")',
            'a:has-text("Professional")',
        ]
        await _try_selectors(page, prof_selectors, "click", timeout=8000)
        await page.wait_for_timeout(2000)
        await save_screenshot(page, session, "05_professional_plan")

        # ── STEP 6: Legal business name ─────────────────────────────────────────
        session.update_step(6, "Şirket adı ve türü giriliyor", SessionState.running)

        business_name_selectors = [
            '[name="legalBusinessName"]',
            '[name="businessLegalName"]',
            '[id*="business-name"]',
            '[id*="legal-name"]',
            '[placeholder*="legal"]',
            '[placeholder*="business name"]',
        ]
        for sel in business_name_selectors:
            if await _safe_fill(page, sel, profile.company_name, timeout=3000):
                break

        # Business type — Free Zone is typically "Privately Owned"
        type_selectors = [
            'select[name="businessType"]',
            'select[name="legalEntityType"]',
            '[id*="business-type"]',
        ]
        for sel in type_selectors:
            try:
                await page.select_option(sel, value="state_owned", timeout=2000)
                break
            except Exception:
                try:
                    await page.select_option(sel, label="Privately Owned", timeout=2000)
                    break
                except Exception:
                    continue

        await save_screenshot(page, session, "06_business_name")
        await _try_selectors(page, submit_selectors + ['button:has-text("Next")'], "click")
        await page.wait_for_timeout(2000)

        # ── STEP 7: Business address ────────────────────────────────────────────
        session.update_step(7, "İş adresi dolduruluyor", SessionState.running)

        # Parse address into parts
        address_parts = profile.free_zone_address.split(",")
        address_line1 = address_parts[0].strip() if address_parts else profile.free_zone_address
        city = address_parts[1].strip() if len(address_parts) > 1 else "Dubai"

        addr_selectors = [
            ('[name="addressLine1"]', address_line1),
            ('[id*="address-line-1"]', address_line1),
            ('[placeholder*="Address line 1"]', address_line1),
        ]
        for sel, val in addr_selectors:
            if await _safe_fill(page, sel, val, timeout=3000):
                break

        city_selectors = [
            ('[name="city"]', city),
            ('[id*="city"]', city),
            ('[placeholder*="City"]', city),
        ]
        for sel, val in city_selectors:
            if await _safe_fill(page, sel, val, timeout=3000):
                break

        # Country — select UAE
        country_selectors = ['select[name="country"]', 'select[id*="country"]']
        for sel in country_selectors:
            try:
                await page.select_option(sel, value="AE", timeout=2000)
                break
            except Exception:
                try:
                    await page.select_option(sel, label="United Arab Emirates", timeout=2000)
                    break
                except Exception:
                    continue

        await save_screenshot(page, session, "07_business_address")
        await _try_selectors(page, submit_selectors + ['button:has-text("Next")'], "click")
        await page.wait_for_timeout(2000)

        # ── STEP 8: Phone number entry ──────────────────────────────────────────
        session.update_step(8, "Telefon numarası giriliyor", SessionState.running)

        phone_selectors = [
            '[name="primaryPhone"]',
            '[name="phone"]',
            '[name="mobilePhone"]',
            '[id*="phone"]',
            '[placeholder*="phone"]',
            '[placeholder*="Phone"]',
        ]
        for sel in phone_selectors:
            if await _safe_fill(page, sel, profile.phone, timeout=3000):
                break

        # Click "Send SMS" if there's such a button
        sms_btn_selectors = [
            'button:has-text("Send SMS")',
            'button:has-text("Send code")',
            'button:has-text("Verify")',
        ]
        await _try_selectors(page, sms_btn_selectors, "click")
        await page.wait_for_timeout(2000)
        await save_screenshot(page, session, "08_phone_entered")

        # ── STEP 9: Phone SMS OTP ───────────────────────────────────────────────
        session.update_step(
            9,
            "Telefon SMS OTP bekleniyor",
            SessionState.waiting_for_otp,
            waiting_prompt=f"{profile.phone} numarasına Amazon'dan gelen 6 haneli SMS kodunu girin.",
        )
        await save_screenshot(page, session, "09_phone_otp_wait")
        phone_otp = await session.wait_for_otp(f"Phone OTP — {profile.phone}")

        session.update_step(9, "Telefon OTP giriliyor", SessionState.running)
        for sel in otp_selectors:
            if await _safe_fill(page, sel, phone_otp, timeout=3000):
                break

        await _try_selectors(page, submit_selectors, "click")
        await page.wait_for_timeout(3000)
        await save_screenshot(page, session, "09_phone_otp_submitted")

        # ── STEP 10: Billing / Credit card ─────────────────────────────────────
        session.update_step(
            10,
            "Faturalama bilgisi — Manuel eylem gerekli",
            SessionState.waiting_for_human_action,
            human_action_description=(
                "Amazon bir kredi kartı numarası istiyor. "
                "Mevcut tarayıcı oturumunun ekran görüntüsüne bakarak "
                "kart bilgilerinizi girin. Girişten sonra 'Devam Et' butonuna basın."
            ),
            waiting_prompt="Kredi kartı bilgilerini Amazon formuna girdikten sonra 'Devam Et'e basın.",
        )
        await save_screenshot(page, session, "10_billing_page")
        await session.wait_for_otp("Kredi kartı girildi — devam")

        session.update_step(10, "Faturalama tamamlandı", SessionState.running)
        await _try_selectors(page, submit_selectors + ['button:has-text("Next")'], "click")
        await page.wait_for_timeout(3000)
        await save_screenshot(page, session, "10b_billing_done")

        # ── STEP 11: Upload Trade License ───────────────────────────────────────
        session.update_step(11, "Ticaret Lisansı yükleniyor", SessionState.running)

        trade_license_files = list((UPLOADS_BASE / "documents").glob("trade_license.*"))
        if trade_license_files:
            try:
                file_inputs = page.locator('input[type="file"]')
                if await file_inputs.count() > 0:
                    await file_inputs.first.set_input_files(str(trade_license_files[0]))
                    await page.wait_for_timeout(2000)
            except Exception as e:
                session.status.steps_completed[-1]["error"] = f"Trade license upload warning: {e}"

        await save_screenshot(page, session, "11_trade_license")
        await _try_selectors(page, submit_selectors + ['button:has-text("Next")'], "click")
        await page.wait_for_timeout(2000)

        # ── STEP 12: Upload Passport ────────────────────────────────────────────
        session.update_step(12, "Pasaport yükleniyor", SessionState.running)

        passport_files = list((UPLOADS_BASE / "documents").glob("passport.*"))
        if passport_files:
            try:
                file_inputs = page.locator('input[type="file"]')
                count = await file_inputs.count()
                target = file_inputs.nth(1) if count > 1 else file_inputs.first
                await target.set_input_files(str(passport_files[0]))
                await page.wait_for_timeout(2000)
            except Exception as e:
                session.status.steps_completed[-1]["error"] = f"Passport upload warning: {e}"

        await save_screenshot(page, session, "12_passport")
        await _try_selectors(page, submit_selectors + ['button:has-text("Next")'], "click")
        await page.wait_for_timeout(2000)

        # ── STEP 13: VIDEO VERIFICATION PAUSE ──────────────────────────────────
        session.update_step(
            13,
            "Video Kimlik Doğrulama — Manuel Eylem Zorunlu",
            SessionState.waiting_for_human_action,
            human_action_description=(
                "Amazon, kimlik doğrulaması için canlı görüntülü bir arama yapmak istiyor. "
                "Bu adım otomatize edilemez. Yapmanız gerekenler:\n"
                "1. Amazon size arama için bir link/email gönderecek (genellikle birkaç saat içinde).\n"
                "2. Görüntülü aramayı planlayın ve randevuya gelin.\n"
                "3. Görüşme sırasında pasaportunuzu ve ticaret lisansınızı hazır bulundurun.\n"
                "4. Görüşmeyi tamamlayın.\n"
                "5. Tamamlandıktan sonra aşağıdaki 'Video Görüşmesi Tamamlandı' butonuna basın."
            ),
            waiting_prompt=(
                "Amazon video kimlik doğrulama görüşmesini tamamladıktan sonra "
                "'Video Görüşmesi Tamamlandı — Devam Et' butonuna basın."
            ),
        )
        await save_screenshot(page, session, "13_video_verification_pause")
        await session.wait_for_otp("Video görüşmesi tamamlandı")

        # ── STEP 14: Final submission ───────────────────────────────────────────
        session.update_step(14, "Başvuru gönderildi — Onay bekleniyor", SessionState.running)

        final_submit_selectors = [
            'button:has-text("Submit")',
            'button:has-text("Finish")',
            'button:has-text("Complete")',
            'button:has-text("Done")',
            'input[type="submit"]',
        ]
        await _try_selectors(page, final_submit_selectors, "click")
        await page.wait_for_timeout(3000)
        await save_screenshot(page, session, "14_submitted")

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

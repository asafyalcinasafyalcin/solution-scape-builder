"""
Dubai E-Ticaret Operasyon Platformu — FastAPI Backend

Endpoint'ler:
  /api/setup          → Hesap kurulum kontrol listeleri
  /api/products       → Ürün kataloğu CRUD
  /api/amazon         → Amazon SP-API işlemleri
  /api/noon           → noon Partner API işlemleri
  /api/research       → Ürün araştırma ve skorlama
  /api/content        → Claude API ile içerik üretimi
  /api/orders         → Sipariş yönetimi
  /api/inventory      → Stok yönetimi
"""

import asyncio
import json
import os
from contextlib import asynccontextmanager
from enum import Enum
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlmodel import SQLModel, create_engine, Session, select
import io

load_dotenv()

from models import Product, ProductCreate, ProductRead, Order
from amazon import listings as amazon_listings, orders as amazon_orders, inventory as amazon_inventory
from noon import content as noon_content, fulfillment as noon_fulfillment, nis_export
from research import ProductCandidate, rank_candidates
from content import generate_listing_content
from automation import (
    CompanyProfile,
    SessionState,
    get_session,
    get_or_create_session,
    run_noon_registration,
    run_amazon_registration,
)

UPLOADS_BASE = Path(__file__).parent / "uploads"
UPLOADS_BASE.mkdir(exist_ok=True)
(UPLOADS_BASE / "documents").mkdir(exist_ok=True)
(UPLOADS_BASE / "status").mkdir(exist_ok=True)
(UPLOADS_BASE / "screenshots" / "noon").mkdir(parents=True, exist_ok=True)
(UPLOADS_BASE / "screenshots" / "amazon").mkdir(parents=True, exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dubai_ecommerce.db")
engine = create_engine(DATABASE_URL, echo=False)


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(
    title="Dubai E-Ticaret Operasyon Platformu",
    description="Amazon.ae ve noon.com satış otomasyonu",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve screenshots as static files
app.mount(
    "/api/setup/screenshots",
    StaticFiles(directory=str(UPLOADS_BASE / "screenshots")),
    name="screenshots",
)


# ─── HESAP KURULUM ─────────────────────────────────────────────────────────────

@app.get("/api/setup/amazon-checklist")
def get_amazon_checklist():
    """Amazon.ae Seller Central kayıt kontrol listesi."""
    return {
        "platform": "Amazon.ae",
        "marketplace_id": "A2VIGQ35RCS4UG",
        "registration_url": "https://sell.amazon.ae",
        "company_type": "Serbest Bölge Şirketi",
        "required_documents": [
            {"item": "Serbest Bölge Ticaret Lisansı", "note": "E-ticaret faaliyet kodu dahil olmalı", "status": "pending"},
            {"item": "Pasaport veya Emirates ID", "note": "Şirket sahibi/yetkili kişi", "status": "pending"},
            {"item": "BAE banka hesabı ekstresi", "note": "Son 3 aylık ekstre veya kredi kartı", "status": "pending"},
            {"item": "BAE kayıtlı iş e-posta adresi", "note": "Amazon bildirimleri bu adrese gelecek", "status": "pending"},
            {"item": "BAE kayıtlı telefon numarası", "note": "SMS doğrulama için gerekli", "status": "pending"},
            {"item": "Vekaletname", "note": "Sadece temsilci ile kayıt yapılıyorsa", "status": "optional"},
        ],
        "steps": [
            "sell.amazon.ae adresine git",
            "Start Selling > Profesyonel hesap seç (39 USD/ay, >40 ürün için zorunlu)",
            "Şirket bilgileri gir (Serbest Bölge şirket adı, adresi)",
            "Belgeleri yükle",
            "Video kimlik doğrulama (canlı görüntülü arama)",
            "Onay bekleme süresi: ~5-10 iş günü",
            "Onay sonrası: SP-API erişimi için Seller Central > Apps & Services > Develop Apps",
        ],
        "fees": {
            "professional_plan": "39 USD/ay",
            "referral_under_50aed": "8%",
            "referral_over_50aed": "15%",
            "fba_storage": "~2 AED/cubic feet/ay",
        },
        "notes": [
            "BAE'de Avrupa bölgesi altında (Helium 10 entegrasyonunda 'Europe' seç)",
            "SP-API marketplace kodu: A2VIGQ35RCS4UG",
            "API endpoint: sellingpartnerapi-eu.amazon.com",
        ],
    }


@app.get("/api/setup/noon-checklist")
def get_noon_checklist():
    """noon Seller Lab kayıt kontrol listesi."""
    return {
        "platform": "noon.com",
        "registration_url": "https://sell.noon.com",
        "company_type": "Serbest Bölge Şirketi",
        "required_documents": [
            {"item": "Serbest Bölge Ticaret Lisansı", "note": "Ticaret sicili belgesi", "status": "pending"},
            {"item": "Pasaport veya Emirates ID", "note": "Şirket sahibi", "status": "pending"},
            {"item": "Oturma İzni", "note": "Yabancı kurucu için — Emirates ID yeterliyse opsiyonel", "status": "optional"},
            {"item": "BAE banka hesabı IBAN", "note": "Perşembe haftalık ödeme için", "status": "pending"},
            {"item": "KDV Sertifikası", "note": "375.000 AED'yi aşmadan muaf; ileride gerekecek", "status": "later"},
        ],
        "steps": [
            "sell.noon.com adresine git",
            "Önce noon müşteri hesabı oluştur (zorunlu)",
            "Seller Lab'a geç ve mağaza oluştur",
            "Şirket belgelerini yükle",
            "Onay bekleme süresi: ~2-5 iş günü",
            "Onay sonrası: Seller Lab > User & Access > API Users > servis hesabı oluştur",
            "API anahtarını (store_credentials.json) indir ve sisteme ekle",
        ],
        "fulfillment_options": {
            "FBN": "Fulfilled by noon — noon depolar, paketler, gönderir. Depolama + çıkış ücreti.",
            "FBP": "Fulfilled by Partner — kendin depolar, noon siparişi iletir. FBPI API ile senkron.",
        },
        "commission_rates": {
            "clothing_fashion": "~27% (en yüksek — marj hesabı kritik!)",
            "home_textiles": "~15%",
            "baby": "~15%",
            "kitchen": "~12%",
            "appliances": "~4%",
            "minimum_per_item": "1 AED",
        },
        "payment_schedule": "Her Perşembe (haftalık)",
        "notes": [
            "noon yalnızca yeni ve orijinal ürün kabul eder",
            "İki dilli içerik zorunlu: EN + AR",
            "FBN ücretleri 1 Eylül 2025'ten itibaren revize edildi",
            "API: noon-docs.noonpartners.dev (yeni platform, daha az test edilmiş)",
            "NIS Excel/CSV yedek yöntem olarak hazır",
        ],
    }


# ─── HESAP KAYIT OTOMASYONU ────────────────────────────────────────────────────

class CompanyProfileRequest(BaseModel):
    company_name: str
    free_zone_address: str
    owner_name: str
    email: str
    phone: str
    iban: str
    password: str


class OTPSubmission(BaseModel):
    value: str
    otp_type: str = "sms_otp"


class DocumentTypeEnum(str, Enum):
    trade_license = "trade_license"
    passport = "passport"
    bank_statement = "bank_statement"


@app.post("/api/setup/company-profile")
async def save_company_profile(profile: CompanyProfileRequest):
    """Şirket profilini kaydet (otomasyon için form verisi)."""
    path = UPLOADS_BASE / "company_profile.json"
    path.write_text(profile.model_dump_json(indent=2))
    return {"saved": True, "profile_path": str(path)}


@app.get("/api/setup/company-profile")
async def load_company_profile():
    """Kayıtlı şirket profilini yükle (şifre hariç)."""
    path = UPLOADS_BASE / "company_profile.json"
    if not path.exists():
        return {"exists": False}
    data = json.loads(path.read_text())
    data.pop("password", None)  # never return password
    return {"exists": True, **data}


@app.post("/api/setup/upload-document")
async def upload_document(
    document_type: DocumentTypeEnum = Form(...),
    file: UploadFile = File(...),
):
    """Belge yükle: trade_license | passport | bank_statement"""
    ALLOWED_MIME = {"application/pdf", "image/jpeg", "image/png", "image/webp"}
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(400, f"Desteklenmeyen dosya türü: {file.content_type}")

    suffix = Path(file.filename or "doc.pdf").suffix or ".pdf"
    dest = UPLOADS_BASE / "documents" / f"{document_type.value}{suffix}"

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(400, "Dosya çok büyük (max 10 MB)")

    dest.write_bytes(content)
    return {
        "saved": True,
        "document_type": document_type.value,
        "filename": dest.name,
        "size_bytes": len(content),
    }


@app.get("/api/setup/documents")
async def list_uploaded_documents():
    """Hangi belgeler yüklendi kontrol et."""
    docs_dir = UPLOADS_BASE / "documents"
    expected = ["trade_license", "passport", "bank_statement"]
    result = {}
    for doc in expected:
        matches = list(docs_dir.glob(f"{doc}.*"))
        result[doc] = {
            "uploaded": len(matches) > 0,
            "filename": matches[0].name if matches else None,
        }
    return result


@app.post("/api/setup/start-registration/{platform}")
async def start_registration(platform: str):
    """Playwright ile kayıt otomasyonunu başlat (noon veya amazon)."""
    if platform not in ("noon", "amazon"):
        raise HTTPException(400, "Platform 'noon' veya 'amazon' olmalı")

    profile_path = UPLOADS_BASE / "company_profile.json"
    if not profile_path.exists():
        raise HTTPException(400, "Şirket profili bulunamadı. Önce POST /api/setup/company-profile yapın.")

    for doc in ("trade_license", "passport"):
        if not list((UPLOADS_BASE / "documents").glob(f"{doc}.*")):
            raise HTTPException(400, f"Eksik belge: {doc}")

    session = get_or_create_session(platform)
    if session.status.state == SessionState.running:
        raise HTTPException(409, f"{platform} kaydı zaten devam ediyor")

    profile_data = json.loads(profile_path.read_text())
    profile = CompanyProfile(**profile_data)

    # Reset session for fresh run
    session.status.state = SessionState.idle
    session.status.current_step = 0
    session.status.steps_completed = []
    session.status.error_message = None
    session.status.completed_at = None
    session.status.started_at = None
    session._otp_event.clear()
    session._otp_value = None

    if platform == "noon":
        asyncio.create_task(run_noon_registration(profile, session))
    else:
        asyncio.create_task(run_amazon_registration(profile, session))

    return {"started": True, "platform": platform, "status": session.get_status_dict()}


@app.get("/api/setup/registration-status/{platform}")
async def get_registration_status(platform: str):
    """Kayıt otomasyon durumunu döndür (3sn'de bir polling)."""
    if platform not in ("noon", "amazon"):
        raise HTTPException(400, "Platform 'noon' veya 'amazon' olmalı")

    session = get_session(platform)
    if not session:
        return {"platform": platform, "state": "idle", "current_step": 0, "progress_pct": 0}

    status = session.get_status_dict()
    if status.get("latest_screenshot"):
        status["screenshot_url"] = f"/api/setup/screenshots/{platform}/{status['latest_screenshot']}"
    return status


@app.post("/api/setup/submit-otp/{platform}")
async def submit_otp(platform: str, body: OTPSubmission):
    """SMS OTP, email onayı veya manuel adım tamamlamayı ilet."""
    if platform not in ("noon", "amazon"):
        raise HTTPException(400, "Geçersiz platform")

    session = get_session(platform)
    if not session:
        raise HTTPException(404, "Bu platform için aktif oturum yok")

    waiting_states = {
        SessionState.waiting_for_otp,
        SessionState.waiting_for_email,
        SessionState.waiting_for_captcha,
        SessionState.waiting_for_human_action,
    }
    if session.status.state not in waiting_states:
        raise HTTPException(409, f"Oturum kullanıcı girdisi beklemiyor (durum: {session.status.state})")

    session.submit_otp(body.value)
    return {"relayed": True, "platform": platform, "otp_type": body.otp_type}


# ─── ÜRÜN KATALOĞU ─────────────────────────────────────────────────────────────

@app.get("/api/products", response_model=list[ProductRead])
def list_products(
    status_filter: Optional[str] = None,
    category: Optional[str] = None,
):
    with Session(engine) as session:
        query = select(Product)
        if status_filter:
            query = query.where(Product.amazon_status == status_filter)
        if category:
            query = query.where(Product.category == category)
        return session.exec(query).all()


@app.post("/api/products", response_model=ProductRead, status_code=201)
def create_product(product: ProductCreate):
    with Session(engine) as session:
        db_product = Product.model_validate(product)
        session.add(db_product)
        session.commit()
        session.refresh(db_product)
        return db_product


@app.get("/api/products/{product_id}", response_model=ProductRead)
def get_product(product_id: int):
    with Session(engine) as session:
        product = session.get(Product, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Ürün bulunamadı")
        return product


@app.delete("/api/products/{product_id}")
def delete_product(product_id: int):
    with Session(engine) as session:
        product = session.get(Product, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Ürün bulunamadı")
        session.delete(product)
        session.commit()
        return {"message": "Ürün silindi"}


# ─── İÇERİK ÜRETİMİ ──────────────────────────────────────────────────────────

@app.post("/api/content/generate")
async def generate_content(payload: dict):
    """
    Claude API ile EN/AR listing içeriği üret.

    payload: {
        "product_name": "Türk Pamuklu Havlu",
        "category": "Home Textiles",
        "key_features": ["100% cotton", "70x140cm", "Made in Turkey"],
        "brand": "MyBrand",
        "platform": "both",
        "keywords": ["turkish towel", "bath towel", "cotton towel"]
    }
    """
    try:
        content = await generate_listing_content(
            product_name=payload.get("product_name", ""),
            category=payload.get("category", ""),
            key_features=payload.get("key_features", []),
            brand=payload.get("brand", ""),
            target_platform=payload.get("platform", "both"),
            keywords=payload.get("keywords"),
        )
        return content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── ÜRÜN ARAŞTIRMA ──────────────────────────────────────────────────────────

@app.post("/api/research/score")
def score_products(candidates: list[dict]):
    """
    Ürün adaylarını puanla ve sırala.

    candidates: [{
        "name": "Türk Havlu",
        "category": "home_textiles",
        "estimated_price_aed": 45.0,
        "estimated_cost_try": 180.0,
        "amazon_bsr": 3200,
        "noon_demand_confirmed": true,
        "turkey_supplier_available": true,
        "requires_ecas_tdra": false
    }, ...]
    """
    product_candidates = [ProductCandidate(**c) for c in candidates]
    results = rank_candidates(product_candidates)
    return [
        {
            "name": r.candidate.name,
            "total_score": r.total_score,
            "recommendation": r.recommendation,
            "amazon_margin_pct": r.amazon_margin_pct,
            "noon_margin_pct": r.noon_margin_pct,
            "breakdown": r.breakdown,
            "warnings": r.warnings,
        }
        for r in results
    ]


# ─── AMAZON İŞLEMLERİ ────────────────────────────────────────────────────────

@app.get("/api/amazon/orders")
async def get_amazon_orders(status: str = "Unshipped", days: int = 7):
    """Amazon.ae siparişlerini çek."""
    from datetime import datetime, timedelta
    try:
        result = await amazon_orders.get_orders(
            created_after=datetime.utcnow() - timedelta(days=days),
            order_statuses=[status],
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Amazon API hatası: {e}")


@app.get("/api/amazon/inventory")
async def get_amazon_inventory(low_stock_threshold: int = 10):
    """FBA stok seviyelerini kontrol et."""
    try:
        data = await amazon_inventory.get_inventory_summaries()
        low_stock = await amazon_inventory.get_low_stock_skus(threshold=low_stock_threshold)
        return {"inventory": data, "low_stock_skus": low_stock}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Amazon API hatası: {e}")


@app.post("/api/amazon/listing/{sku}")
async def create_amazon_listing(sku: str, payload: dict):
    """Amazon.ae'de tekli ürün listele."""
    seller_id = payload.get("seller_id", "")
    if not seller_id:
        raise HTTPException(status_code=400, detail="seller_id zorunlu")
    try:
        result = await amazon_listings.put_listing(
            sku=sku,
            product_type=payload.get("product_type", "HOME_BED_AND_BATH"),
            attributes=payload.get("attributes", {}),
            seller_id=seller_id,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Amazon API hatası: {e}")


# ─── noon İŞLEMLERİ ──────────────────────────────────────────────────────────

@app.get("/api/noon/categories")
async def get_noon_categories(search: Optional[str] = None):
    """noon kategorilerini listele."""
    try:
        return await noon_content.list_categories(search)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"noon API hatası: {e}")


@app.post("/api/noon/product")
async def create_noon_product(payload: dict):
    """noon'da ürün oluştur veya güncelle (UpsertProduct)."""
    try:
        return await noon_content.upsert_product(payload)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"noon API hatası: {e}")


@app.get("/api/noon/orders")
async def get_noon_orders(status: str = "pending"):
    """noon siparişlerini çek."""
    try:
        return await noon_fulfillment.get_orders(status=status)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"noon API hatası: {e}")


@app.get("/api/noon/nis-export")
def download_nis_export(product_ids: str = ""):
    """Seçili ürünler için NIS Excel dosyası indir."""
    with Session(engine) as session:
        if product_ids:
            ids = [int(i) for i in product_ids.split(",") if i.strip()]
            products = [session.get(Product, pid) for pid in ids]
            products = [p for p in products if p]
        else:
            products = session.exec(select(Product)).all()

    product_dicts = [
        {
            "sku": p.sku,
            "title_en": p.title_en,
            "title_ar": p.title_ar or "",
            "brand": p.brand or "",
            "category": p.category or "",
            "color": p.color or "",
            "size": p.size or "",
            "price_aed": p.price_aed or 0,
            "stock": 0,
            "image_main_url": p.image_main_url or "",
            "origin": p.origin_country,
            "description_en": p.description_en or "",
            "description_ar": p.description_ar or "",
        }
        for p in products
    ]

    excel_bytes = nis_export.generate_nis_excel(product_dicts)
    return StreamingResponse(
        io.BytesIO(excel_bytes),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=noon_nis_export.xlsx"},
    )


# ─── DASHBOARD İSTATİSTİKLER ─────────────────────────────────────────────────

@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    """Ana dashboard için özet istatistikler."""
    with Session(engine) as session:
        total_products = len(session.exec(select(Product)).all())
        amazon_active = len(
            session.exec(select(Product).where(Product.amazon_status == "active")).all()
        )
        noon_active = len(
            session.exec(select(Product).where(Product.noon_status == "active")).all()
        )
        total_orders = len(session.exec(select(Order)).all())

    return {
        "total_products": total_products,
        "amazon_active_listings": amazon_active,
        "noon_active_listings": noon_active,
        "total_orders": total_orders,
        "platforms": {
            "amazon": {"marketplace": "Amazon.ae", "marketplace_id": "A2VIGQ35RCS4UG", "status": "ready"},
            "noon": {"marketplace": "noon.com UAE", "status": "ready"},
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

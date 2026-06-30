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

import os
from contextlib import asynccontextmanager
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlmodel import SQLModel, create_engine, Session, select
import io

load_dotenv()

from models import Product, ProductCreate, ProductRead, Order
from amazon import listings as amazon_listings, orders as amazon_orders, inventory as amazon_inventory
from noon import content as noon_content, fulfillment as noon_fulfillment, nis_export
from research import ProductCandidate, rank_candidates
from content import generate_listing_content

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
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

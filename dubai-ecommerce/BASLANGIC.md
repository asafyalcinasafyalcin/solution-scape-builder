# Dubai E-Ticaret Operasyon Platformu — Başlangıç Rehberi

## Ne Yaptık?

Amazon.ae ve noon.com için tam otomasyon platformu:

```
dubai-ecommerce/
├── backend/          Python FastAPI — Amazon SP-API + noon Partner API
│   ├── amazon/       SP-API: listeleme, sipariş, stok, toplu yükleme
│   ├── noon/         Content API + FBPI + NIS Excel yedek
│   ├── research/     Ürün fırsat skorlama algoritması
│   ├── content/      Claude AI ile EN/AR içerik üretimi
│   └── main.py       Ana API sunucusu (port 8000)
├── frontend/         React dashboard (port 5174)
│   └── src/pages/
│       ├── Dashboard         → Genel bakış + kurulum yol haritası
│       ├── Setup             → Amazon.ae + noon kayıt kontrol listesi
│       ├── Products          → Ürün kataloğu + NIS Excel export
│       ├── Research          → Fırsat skoru hesaplama
│       ├── ContentGenerator  → Claude AI ile EN/AR listing içeriği
│       └── Orders            → Sipariş takibi
└── make_scenarios/   Make.com otomasyon senaryoları (JSON şablonlar)
```

---

## Adım 1: Backend Başlatma

```bash
cd dubai-ecommerce/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Ortam değişkenlerini ayarla
cp .env.example .env
# .env dosyasını düzenle (aşağıya bak)

# Sunucuyu başlat
uvicorn main:app --reload --port 8000
# → http://localhost:8000/docs (Swagger UI)
```

## Adım 2: Frontend Başlatma

```bash
cd dubai-ecommerce/frontend
npm install
npm run dev
# → http://localhost:5174
```

---

## .env Dosyası Doldurma (Sırayla)

### 1. Claude API (Hemen — İçerik üretimi için)
```
ANTHROPIC_API_KEY=sk-ant-...
```
Claude API anahtarı için: console.anthropic.com

### 2. Amazon SP-API (Amazon hesabı onaylandıktan sonra)
```
AMAZON_CLIENT_ID=amzn1.application-oa2-client...
AMAZON_CLIENT_SECRET=...
AMAZON_REFRESH_TOKEN=Atzr|...
```
Seller Central > Apps & Services > Develop Apps > SP-API

### 3. noon API (noon hesabı onaylandıktan sonra)
Seller Lab > User & Access > API Users > Servis hesabı oluştur > .json key indir
Dosyayı `backend/noon/store_credentials.json` olarak kaydet.

---

## Ürün Araştırma Akışı

1. **Helium 10 Diamond** (yıllık 279$/ay) → Amazon.ae bağla ("Europe" bölgesi seç)
   - Black Box: BSR < 5000 olan ürünleri bul
   - Xray: Tahmini aylık satış adedi
   - Cerebro: Anahtar kelime araştırması (Arapça dahil)

2. **NoonSeller.ae** → noon kategori en çok satanlarını analiz et

3. **Research sayfasına** bulunan ürünleri gir → Fırsat skoru hesapla

4. **Content Generator** → 70+ skoru olan ürünler için EN+AR içerik üret

---

## İlk Listing Akışı (Pilot — 5 Ürün)

### noon (önce):
1. Seller Lab > Catalog > Partner Catalog > Create Multiple Products
2. `GET /api/noon/nis-export` → NIS Excel indir → Ürün bilgilerini doldur → Yükle
3. QC onayı: ~2-3 iş günü

### Amazon.ae (sonra):
1. `POST /api/amazon/listing/{sku}` endpoint'i ile listing oluştur
2. veya `POST /api/amazon/bulk-feed` ile toplu yükle

---

## Kritik Hatırlatmalar

| Kural | Detay |
|-------|-------|
| noon tekstil komisyonu | ~%27 (giyim) / ~%15 (ev tekstili) |
| Amazon referral | ≤50 AED: %8 / >50 AED: %15 |
| BAE KDV eşiği | 375.000 AED → kayıt zorunlu |
| noon ödeme | Her Perşembe |
| Amazon ödeme | 14 günde bir |
| İlk SKU tavsiyesi | Elektronikten kaçın (ECAS/TDRA gerektirir) |
| Arapça içerik | noon için zorunlu — Claude otomatik üretiyor |

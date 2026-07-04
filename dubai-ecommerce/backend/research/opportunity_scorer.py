"""
Ürün fırsat puanlama modülü.

Amazon.ae BSR verisi + noon talep verisi + Türkiye tedarik uygunluğu
birleştirilerek ürün başına 0-100 arası fırsat skoru hesaplar.

Hedef kategoriler:
  - Tekstil/Giyim/Ev Tekstili (noon komisyonu ~%27 dikkat!)
  - Bebek/Çocuk ürünleri
  - Türkiye ihracatına uygun
"""

from dataclasses import dataclass, field
from typing import Optional


# noon komisyon oranları (yaklaşık, kategoriye göre değişir)
NOON_COMMISSION_RATES = {
    "clothing": 0.27,
    "fashion": 0.27,
    "shoes": 0.27,
    "home_textiles": 0.15,
    "home": 0.12,
    "baby": 0.15,
    "toys": 0.15,
    "kitchen": 0.12,
    "electronics": 0.05,
    "appliances": 0.04,
    "default": 0.15,
}

# Amazon.ae referral ücretleri (fiyat bandına göre)
AMAZON_REFERRAL_RATE_LOW = 0.08   # ≤50 AED
AMAZON_REFERRAL_RATE_HIGH = 0.15  # >50 AED


@dataclass
class ProductCandidate:
    """Değerlendirilecek ürün adayı."""
    name: str
    category: str
    estimated_price_aed: float
    estimated_cost_try: float
    usd_try_rate: float = 34.0  # güncel USD/TRY kuru

    # Amazon verileri
    amazon_bsr: Optional[int] = None
    amazon_category_size: Optional[int] = None

    # noon verileri
    noon_demand_confirmed: bool = False
    noon_competitor_count: Optional[int] = None

    # Türkiye tedarik
    turkey_supplier_available: bool = True

    # Regülasyon
    requires_ecas_tdra: bool = False
    requires_distributor_auth: bool = False

    # Ek bayraklar
    is_gated_category: bool = False
    notes: str = ""


@dataclass
class OpportunityScore:
    candidate: ProductCandidate
    total_score: float = 0.0
    breakdown: dict = field(default_factory=dict)
    amazon_margin_pct: float = 0.0
    noon_margin_pct: float = 0.0
    recommendation: str = ""
    warnings: list[str] = field(default_factory=list)


def calculate_margin(
    price_aed: float,
    cost_try: float,
    usd_try_rate: float,
    platform: str,
    category: str,
    is_fba: bool = True,
) -> float:
    """
    Platform net marjını hesapla.

    Döner: net marj yüzdesi (0.0 - 1.0)
    """
    # Maliyet AED'ye çevir (1 USD ≈ 3.67 AED)
    cost_usd = cost_try / usd_try_rate
    cost_aed = cost_usd * 3.67

    # KDV (ithalat: %5 gümrük + %5 KDV)
    landed_cost_aed = cost_aed * 1.105

    if platform == "amazon":
        referral = AMAZON_REFERRAL_RATE_LOW if price_aed <= 50 else AMAZON_REFERRAL_RATE_HIGH
        fba_fee_aed = price_aed * 0.08 if is_fba else 0
        total_fees = price_aed * referral + fba_fee_aed
    elif platform == "noon":
        commission_rate = NOON_COMMISSION_RATES.get(category, NOON_COMMISSION_RATES["default"])
        fbn_fee_aed = max(price_aed * 0.06, 1.0)
        total_fees = price_aed * commission_rate + fbn_fee_aed
    else:
        total_fees = price_aed * 0.15

    net_revenue = price_aed - total_fees
    net_margin = (net_revenue - landed_cost_aed) / price_aed
    return round(net_margin, 4)


def score_product(candidate: ProductCandidate) -> OpportunityScore:
    """Ürün adayı için fırsat skoru hesapla."""
    result = OpportunityScore(candidate=candidate)
    breakdown = {}
    warnings = []

    # Amazon BSR skoru (max 30 puan)
    if candidate.amazon_bsr is not None:
        if candidate.amazon_bsr <= 1000:
            bsr_score = 30
        elif candidate.amazon_bsr <= 5000:
            bsr_score = 25
        elif candidate.amazon_bsr <= 15000:
            bsr_score = 15
        elif candidate.amazon_bsr <= 50000:
            bsr_score = 8
        else:
            bsr_score = 2
        breakdown["amazon_bsr"] = bsr_score
    else:
        bsr_score = 10  # Veri yok, orta değer
        breakdown["amazon_bsr"] = bsr_score
        warnings.append("Amazon BSR verisi yok — araştırma gerekli")

    # noon talep skoru (max 20 puan)
    noon_demand_score = 20 if candidate.noon_demand_confirmed else 5
    breakdown["noon_demand"] = noon_demand_score
    if not candidate.noon_demand_confirmed:
        warnings.append("noon talebi doğrulanmadı — NoonSeller ile kontrol et")

    # Türkiye tedarik skoru (max 15 puan)
    turkey_score = 15 if candidate.turkey_supplier_available else 0
    breakdown["turkey_supplier"] = turkey_score

    # Regülasyon cezası (max -40 puan)
    regulation_penalty = 0
    if candidate.requires_ecas_tdra:
        regulation_penalty -= 40
        warnings.append("ECAS/TDRA sertifikası gerekiyor (~2-6 hafta, ekstra maliyet)")
    if candidate.requires_distributor_auth:
        regulation_penalty -= 15
        warnings.append("Distribütör yetki mektubu gerekiyor (bebek/sağlık ürünü)")
    if candidate.is_gated_category:
        regulation_penalty -= 20
        warnings.append("Kapalı (gated) kategori — listeleme öncesi onay gerekli")
    breakdown["regulation_penalty"] = regulation_penalty

    # Marj skoru (max 25 puan)
    amazon_margin = calculate_margin(
        candidate.estimated_price_aed,
        candidate.estimated_cost_try,
        candidate.usd_try_rate,
        "amazon",
        candidate.category,
    )
    noon_margin = calculate_margin(
        candidate.estimated_price_aed,
        candidate.estimated_cost_try,
        candidate.usd_try_rate,
        "noon",
        candidate.category,
    )

    avg_margin = (amazon_margin + noon_margin) / 2
    if avg_margin >= 0.30:
        margin_score = 25
    elif avg_margin >= 0.20:
        margin_score = 20
    elif avg_margin >= 0.10:
        margin_score = 12
    elif avg_margin >= 0:
        margin_score = 5
    else:
        margin_score = -20
        warnings.append(f"Negatif marj! Amazon: {amazon_margin:.1%}, noon: {noon_margin:.1%}")

    breakdown["margin"] = margin_score

    if noon_margin < 0.10 and candidate.category in ("clothing", "fashion", "shoes"):
        warnings.append(f"noon tekstil komisyonu %27 — marj çok düşük ({noon_margin:.1%}). Fiyat artışı veya maliyet düşürme gerekli.")

    total = bsr_score + noon_demand_score + turkey_score + regulation_penalty + margin_score
    result.total_score = max(0, min(100, total))
    result.breakdown = breakdown
    result.amazon_margin_pct = round(amazon_margin * 100, 1)
    result.noon_margin_pct = round(noon_margin * 100, 1)
    result.warnings = warnings

    if result.total_score >= 70:
        result.recommendation = "GÜÇLÜ FIRSAT — Hemen araştırmaya devam et"
    elif result.total_score >= 50:
        result.recommendation = "ORTA FIRSAT — Fiyatlandırma veya tedariki optimize et"
    elif result.total_score >= 30:
        result.recommendation = "ZAYIF FIRSAT — Farklı kategori veya ürün dene"
    else:
        result.recommendation = "UYGUN DEĞİL — Bu SKU'dan vazgeç"

    return result


def rank_candidates(candidates: list[ProductCandidate]) -> list[OpportunityScore]:
    """Birden fazla aday için skor hesapla ve sırala."""
    scores = [score_product(c) for c in candidates]
    return sorted(scores, key=lambda s: s.total_score, reverse=True)


# Örnek kullanım
EXAMPLE_CANDIDATES = [
    ProductCandidate(
        name="Türk Pamuklu Havlu 70x140",
        category="home_textiles",
        estimated_price_aed=45.0,
        estimated_cost_try=180.0,
        amazon_bsr=3200,
        noon_demand_confirmed=True,
        requires_ecas_tdra=False,
    ),
    ProductCandidate(
        name="Bebek Uyku Tulumu 0-3 Ay",
        category="baby",
        estimated_price_aed=65.0,
        estimated_cost_try=250.0,
        amazon_bsr=8000,
        noon_demand_confirmed=True,
        requires_distributor_auth=True,
    ),
    ProductCandidate(
        name="Bluetooth Kulaklık",
        category="electronics",
        estimated_price_aed=89.0,
        estimated_cost_try=400.0,
        amazon_bsr=12000,
        noon_demand_confirmed=False,
        requires_ecas_tdra=True,
    ),
]

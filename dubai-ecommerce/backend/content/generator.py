"""
Claude API ile Amazon.ae ve noon.com için İngilizce + Arapça listing içeriği üret.

Model: claude-sonnet-4-6
Çıktı:
  - SEO uyumlu başlık (EN + AR)
  - 5 madde işareti (EN + AR)
  - Ürün açıklaması (EN + AR)
  - Amazon A+ içerik özeti

Arapça önemli: noon iki dilli içerik zorunlu kılıyor.
BAE yerel SEO anahtar kelimeleri dahil edilir.
"""

import os
from typing import Optional
import anthropic


def get_client() -> anthropic.Anthropic:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise EnvironmentError("ANTHROPIC_API_KEY ayarlanmamış — .env dosyasını kontrol et")
    return anthropic.Anthropic(api_key=api_key)


async def generate_listing_content(
    product_name: str,
    category: str,
    key_features: list[str],
    brand: str,
    target_platform: str = "both",
    keywords: Optional[list[str]] = None,
) -> dict:
    """
    Ürün listing içeriği üret.

    Args:
        product_name: Ürün adı (Türkçe veya İngilizce)
        category: Ürün kategorisi (ör. "Home Textiles", "Baby Clothing")
        key_features: Ana özellikler listesi (ör. ["100% cotton", "50x100cm"])
        brand: Marka adı
        target_platform: "amazon", "noon" veya "both"
        keywords: Helium 10 / NoonSeller'dan alınan anahtar kelimeler

    Döner:
        {
            "title_en": "...",
            "title_ar": "...",
            "bullet_points_en": ["...", "...", ...],
            "bullet_points_ar": ["...", "...", ...],
            "description_en": "...",
            "description_ar": "...",
        }
    """
    client = get_client()

    keyword_str = ", ".join(keywords) if keywords else "no specific keywords provided"
    features_str = "\n".join(f"- {f}" for f in key_features)

    platform_note = ""
    if target_platform == "amazon":
        platform_note = "Optimize for Amazon.ae UAE marketplace. Amazon title max 200 chars."
    elif target_platform == "noon":
        platform_note = "Optimize for noon.com UAE. noon requires bilingual EN+AR content."
    else:
        platform_note = "Optimize for both Amazon.ae and noon.com UAE marketplace."

    prompt = f"""You are an expert e-commerce copywriter for UAE marketplace (Amazon.ae and noon.com).
Create compelling, SEO-optimized product listing content for a product being sold from Turkey.

PRODUCT DETAILS:
- Name: {product_name}
- Category: {category}
- Brand: {brand}
- Key Features:
{features_str}
- Target Keywords (from research): {keyword_str}

PLATFORM: {platform_note}

UAE MARKET NOTES:
- UAE buyers respond to quality indicators, "Made in Turkey" has positive brand recognition for textiles
- Include relevant Arabic keywords naturally in Arabic content
- Price sensitivity: mid-range market, emphasize value
- Local seasons: Ramadan, White Friday, Dubai Shopping Festival are key periods

OUTPUT FORMAT (JSON only, no extra text):
{{
  "title_en": "product title in English (max 200 chars, include primary keyword)",
  "title_ar": "عنوان المنتج بالعربية (max 200 chars)",
  "bullet_points_en": [
    "Bullet 1: Lead with primary benefit",
    "Bullet 2: Material/quality detail",
    "Bullet 3: Size/compatibility detail",
    "Bullet 4: Use case / who it's for",
    "Bullet 5: Brand/origin trust signal"
  ],
  "bullet_points_ar": [
    "النقطة 1 بالعربية",
    "النقطة 2 بالعربية",
    "النقطة 3 بالعربية",
    "النقطة 4 بالعربية",
    "النقطة 5 بالعربية"
  ],
  "description_en": "Product description 200-500 words, conversational tone, include keywords naturally",
  "description_ar": "وصف المنتج باللغة العربية 150-300 كلمة"
}}"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}],
    )

    import json
    text = message.content[0].text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text)


async def generate_arabic_translation(text_en: str, context: str = "product listing") -> str:
    """İngilizce metni Arapça'ya çevir (UAE diyalekti tercih edilir)."""
    client = get_client()

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": f"Translate this {context} text to Arabic for UAE market (Modern Standard Arabic preferred for e-commerce). Return only the Arabic translation:\n\n{text_en}",
            }
        ],
    )
    return message.content[0].text.strip()


async def generate_keyword_optimized_title(
    base_title: str,
    keywords: list[str],
    max_chars: int = 200,
    language: str = "en",
) -> str:
    """Anahtar kelimeler dahil edilmiş SEO başlığı oluştur."""
    client = get_client()

    lang_instruction = "English" if language == "en" else "Arabic"
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=200,
        messages=[
            {
                "role": "user",
                "content": f"""Create an {lang_instruction} Amazon/noon product title for UAE market.
Base title: {base_title}
Must include these keywords naturally: {', '.join(keywords[:5])}
Max {max_chars} characters.
Return ONLY the title, nothing else.""",
            }
        ],
    )
    return message.content[0].text.strip()[:max_chars]

"""
noon Partner API — Content Integration API.

Ürün listelemeleri oluştur, güncelle ve QC durumunu takip et.
Rate limit: ~1.500 istek / 60 saniye.

Temel işlemler:
  ListCategories       → POST /v1/categories/list
  ListCategoryAttribs  → POST /v1/categories/attributes
  UpsertProduct        → POST /v1/product/upsert
  GetContent           → GET  /v1/product/content/{sku_parent}

Referans: noon-docs.noonpartners.dev/catalog/content
"""

from typing import Optional
import httpx

from .auth import get_noon_headers, settings


async def list_categories(search: Optional[str] = None) -> dict:
    """Noon kategorilerini listele."""
    headers = await get_noon_headers()
    payload = {}
    if search:
        payload["search"] = search

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.api_base}/v1/categories/list",
            headers=headers,
            json=payload,
        )
        return resp.json()


async def list_category_attributes(category_id: str) -> dict:
    """
    Belirli kategori için zorunlu/opsiyonel özellik şemasını al.
    Bu şemaya göre UpsertProduct payload'ı hazırla.
    """
    headers = await get_noon_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.api_base}/v1/categories/attributes",
            headers=headers,
            json={"category_id": category_id},
        )
        return resp.json()


async def upsert_product(product_payload: dict) -> dict:
    """
    Ürün oluştur veya güncelle.

    Döner: {"sku_parent": "...", "status": "...", ...}

    Örnek payload (Tekstil):
    {
      "sku": "MY-SKU-001",
      "title": {"en": "Cotton Towel 50x100", "ar": "منشفة قطنية"},
      "brand": "MyBrand",
      "category_id": "...",
      "attributes": {
        "color": "White",
        "size": "50x100cm",
        "material": "100% Cotton",
        "origin": "Turkey"
      },
      "price": {"selling_price": 29.99, "currency": "AED"},
      "stock": 100,
      "images": [
        {"url": "https://...image1.jpg", "type": "main"},
        {"url": "https://...image2.jpg", "type": "additional"}
      ]
    }
    """
    headers = await get_noon_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.api_base}/v1/product/upsert",
            headers=headers,
            json=product_payload,
        )
        return resp.json()


async def get_content(sku_parent: str) -> dict:
    """
    Ürün içeriğini ve QC durumunu al.

    QC durumları: pending, approved, rejected, under_review
    """
    headers = await get_noon_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.api_base}/v1/product/content/{sku_parent}",
            headers=headers,
        )
        return resp.json()


def build_textile_payload(
    sku: str,
    title_en: str,
    title_ar: str,
    brand: str,
    category_id: str,
    color: str,
    size: str,
    material: str,
    price_aed: float,
    stock: int,
    image_main_url: str,
    additional_images: Optional[list[str]] = None,
    description_en: Optional[str] = None,
    description_ar: Optional[str] = None,
) -> dict:
    """Tekstil ürünleri için noon UpsertProduct payload'ı oluştur."""
    images = [{"url": image_main_url, "type": "main"}]
    if additional_images:
        images += [{"url": url, "type": "additional"} for url in additional_images[:8]]

    payload: dict = {
        "sku": sku,
        "title": {"en": title_en, "ar": title_ar},
        "brand": brand,
        "category_id": category_id,
        "attributes": {
            "color": color,
            "size": size,
            "material": material,
            "origin_country": "Turkey",
        },
        "price": {
            "selling_price": price_aed,
            "currency": "AED",
        },
        "stock": stock,
        "images": images,
    }

    if description_en:
        payload.setdefault("description", {})["en"] = description_en
    if description_ar:
        payload.setdefault("description", {})["ar"] = description_ar

    return payload

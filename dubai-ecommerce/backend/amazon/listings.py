"""
Amazon SP-API Listings Items API.

Tek ürün oluşturma/güncelleme/silme işlemleri.
Toplu işlem için feeds.py kullan (JSON_LISTINGS_FEED).

Referans: developer-docs.amazon.com/sp-api/docs/listings-items-api-v2021-08-01-reference
"""

import json
from typing import Any, Optional
import httpx

from .auth import get_sp_api_headers, get_endpoint, settings


async def put_listing(
    sku: str,
    product_type: str,
    attributes: dict,
    seller_id: str,
) -> dict:
    """
    Yeni listing oluştur veya mevcut listing'i tamamen güncelle.

    Args:
        sku: Satıcı SKU kodu
        product_type: Ürün tipi (ör. SHIRT, HOME_BED_AND_BATH)
        attributes: Product Type Definitions API'dan gelen şemaya uygun özellikler
        seller_id: Amazon Seller ID (Seller Central > Account Info)
    """
    url = f"{get_endpoint()}/listings/2021-08-01/items/{seller_id}/{sku}"
    headers = await get_sp_api_headers()

    payload = {
        "productType": product_type,
        "attributes": attributes,
    }

    async with httpx.AsyncClient() as client:
        resp = await client.put(
            url,
            headers=headers,
            json=payload,
            params={"marketplaceIds": settings.marketplace_id},
        )
        return {"status_code": resp.status_code, "body": resp.json()}


async def patch_listing(
    sku: str,
    seller_id: str,
    patches: list[dict],
) -> dict:
    """
    Mevcut listing'in belirli alanlarını güncelle.

    patches örnek:
    [{"op": "replace", "path": "/attributes/purchasable_offer", "value": [{"currency": "AED", "our_price": [{"schedule": [{"value_with_tax": 99.0}]}]}]}]
    """
    url = f"{get_endpoint()}/listings/2021-08-01/items/{seller_id}/{sku}"
    headers = await get_sp_api_headers()

    payload = {
        "productType": "PRODUCT",
        "patches": patches,
    }

    async with httpx.AsyncClient() as client:
        resp = await client.patch(
            url,
            headers=headers,
            json=payload,
            params={"marketplaceIds": settings.marketplace_id},
        )
        return {"status_code": resp.status_code, "body": resp.json()}


async def delete_listing(sku: str, seller_id: str) -> dict:
    """Listing'i sil."""
    url = f"{get_endpoint()}/listings/2021-08-01/items/{seller_id}/{sku}"
    headers = await get_sp_api_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.delete(
            url,
            headers=headers,
            params={"marketplaceIds": settings.marketplace_id},
        )
        return {"status_code": resp.status_code, "body": resp.json()}


async def get_listing(sku: str, seller_id: str) -> dict:
    """Mevcut listing detayını al."""
    url = f"{get_endpoint()}/listings/2021-08-01/items/{seller_id}/{sku}"
    headers = await get_sp_api_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            url,
            headers=headers,
            params={
                "marketplaceIds": settings.marketplace_id,
                "includedData": "summaries,attributes,issues,offers,fulfillmentAvailability",
            },
        )
        return {"status_code": resp.status_code, "body": resp.json()}


async def get_product_type_definition(product_type: str) -> dict:
    """
    Ürün tipi için JSON şeması al.
    Listing oluştururken hangi alanların zorunlu/opsiyonel olduğunu gösterir.
    """
    url = f"{get_endpoint()}/definitions/2020-09-01/productTypes/{product_type}"
    headers = await get_sp_api_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            url,
            headers=headers,
            params={
                "marketplaceIds": settings.marketplace_id,
                "locale": "en_AE",
            },
        )
        return resp.json()


def build_textile_attributes(
    title: str,
    brand: str,
    color: str,
    size: str,
    price_aed: float,
    quantity: int,
    bullet_points: list[str],
    description: str,
    image_url: str,
    additional_images: Optional[list[str]] = None,
) -> dict:
    """
    Tekstil/Giyim ürünleri için SP-API attributes nesnesi oluştur.
    product_type = SHIRT veya CLOTHING kullanılabilir.
    """
    attributes: dict[str, Any] = {
        "item_name": [{"value": title, "marketplace_id": settings.marketplace_id}],
        "brand": [{"value": brand, "marketplace_id": settings.marketplace_id}],
        "color": [{"value": color, "marketplace_id": settings.marketplace_id}],
        "size": [{"value": size, "marketplace_id": settings.marketplace_id}],
        "bullet_point": [
            {"value": bp, "marketplace_id": settings.marketplace_id}
            for bp in bullet_points[:5]
        ],
        "product_description": [{"value": description, "marketplace_id": settings.marketplace_id}],
        "purchasable_offer": [
            {
                "marketplace_id": settings.marketplace_id,
                "currency": "AED",
                "our_price": [{"schedule": [{"value_with_tax": price_aed}]}],
            }
        ],
        "fulfillment_availability": [
            {
                "fulfillment_channel_code": "AMAZON_NA",
                "quantity": quantity,
            }
        ],
        "main_product_image_locator": [
            {"media_location": image_url, "marketplace_id": settings.marketplace_id}
        ],
        "country_of_origin": [{"value": "TR", "marketplace_id": settings.marketplace_id}],
    }

    if additional_images:
        attributes["other_product_image_locator_1"] = [
            {"media_location": url, "marketplace_id": settings.marketplace_id}
            for url in additional_images[:9]
        ]

    return attributes

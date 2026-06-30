"""
Amazon SP-API Feeds API — JSON_LISTINGS_FEED.

Toplu ürün yükleme için kullan: tek istekte 25.000 SKU'ya kadar.
Rate limit: 5 dakikada 5 istek.

Referans: developer-docs.amazon.com/sp-api/docs/feeds-api-v2021-06-30-reference
"""

import json
import time
import httpx

from .auth import get_sp_api_headers, get_endpoint, settings


async def create_feed_document() -> dict:
    """Feed belgesi yüklemek için presigned URL al."""
    url = f"{get_endpoint()}/feeds/2021-06-30/documents"
    headers = await get_sp_api_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            url,
            headers=headers,
            json={"contentType": "application/json; charset=UTF-8"},
        )
        resp.raise_for_status()
        return resp.json()


async def upload_feed_content(upload_url: str, content: bytes) -> None:
    """Feed içeriğini presigned URL'e yükle."""
    async with httpx.AsyncClient() as client:
        resp = await client.put(
            upload_url,
            content=content,
            headers={"Content-Type": "application/json; charset=UTF-8"},
        )
        resp.raise_for_status()


async def create_feed(feed_document_id: str) -> str:
    """Feed işlemini başlat ve feed_id döndür."""
    url = f"{get_endpoint()}/feeds/2021-06-30/feeds"
    headers = await get_sp_api_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            url,
            headers=headers,
            json={
                "feedType": "JSON_LISTINGS_FEED",
                "marketplaceIds": [settings.marketplace_id],
                "inputFeedDocumentId": feed_document_id,
            },
        )
        resp.raise_for_status()
        return resp.json()["feedId"]


async def get_feed_status(feed_id: str) -> dict:
    """Feed işlem durumunu kontrol et."""
    url = f"{get_endpoint()}/feeds/2021-06-30/feeds/{feed_id}"
    headers = await get_sp_api_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers)
        return resp.json()


async def bulk_upsert_products(products: list[dict], seller_id: str) -> str:
    """
    Birden fazla ürünü tek feed ile yükle.

    products: [{"sku": "...", "productType": "...", "attributes": {...}}, ...]
    Döner: feed_id (durumu takip etmek için kullan)
    """
    messages = [
        {
            "messageId": i + 1,
            "sku": p["sku"],
            "operationType": "PATCH",
            "productType": p["productType"],
            "patches": [
                {
                    "op": "replace",
                    "path": "/attributes",
                    "value": p["attributes"],
                }
            ],
        }
        for i, p in enumerate(products)
    ]

    feed_payload = {
        "header": {
            "sellerId": seller_id,
            "version": "2.0",
            "issueLocale": "en_AE",
        },
        "messages": messages,
    }

    feed_content = json.dumps(feed_payload, ensure_ascii=False).encode("utf-8")

    doc = await create_feed_document()
    await upload_feed_content(doc["url"], feed_content)
    feed_id = await create_feed(doc["feedDocumentId"])
    return feed_id


async def wait_for_feed(feed_id: str, max_wait_seconds: int = 300) -> dict:
    """Feed tamamlanana kadar bekle (polling)."""
    start = time.time()
    while time.time() - start < max_wait_seconds:
        status = await get_feed_status(feed_id)
        if status.get("processingStatus") in ("DONE", "FATAL"):
            return status
        time.sleep(15)
    return {"processingStatus": "TIMEOUT", "feedId": feed_id}

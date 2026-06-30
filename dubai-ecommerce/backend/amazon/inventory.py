"""
Amazon SP-API FBA Inventory API.

FBA deposundaki stok seviyelerini izle.
Referans: developer-docs.amazon.com/sp-api/docs/fba-inventory-api-v1-reference
"""

from typing import Optional
import httpx

from .auth import get_sp_api_headers, get_endpoint, settings


async def get_inventory_summaries(
    skus: Optional[list[str]] = None,
    granularity_type: str = "Marketplace",
) -> dict:
    """
    FBA stok özetini al.

    granularity_type: "Marketplace" (BAE deposu) veya "Country"
    """
    params = {
        "granularityType": granularity_type,
        "granularityId": settings.marketplace_id,
        "marketplaceIds": settings.marketplace_id,
    }
    if skus:
        params["sellerSkus"] = ",".join(skus)

    url = f"{get_endpoint()}/fba/inventory/v1/summaries"
    headers = await get_sp_api_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers, params=params)
        return resp.json()


async def get_low_stock_skus(threshold: int = 10) -> list[str]:
    """Stok seviyesi eşiğin altındaki SKU'ları döndür."""
    data = await get_inventory_summaries()
    low = []
    for item in data.get("payload", {}).get("inventorySummaries", []):
        qty = item.get("totalQuantity", 0)
        if qty <= threshold:
            low.append(item.get("sellerSku", ""))
    return [s for s in low if s]

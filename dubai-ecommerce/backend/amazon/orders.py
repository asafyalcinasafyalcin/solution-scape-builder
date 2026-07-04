"""
Amazon SP-API Orders API.

BAE marketplace'deki siparişleri çek ve yönet.
Referans: developer-docs.amazon.com/sp-api/docs/orders-api-v0-reference
"""

from datetime import datetime, timedelta
from typing import Optional
import httpx

from .auth import get_sp_api_headers, get_endpoint, settings


async def get_orders(
    created_after: Optional[datetime] = None,
    order_statuses: Optional[list[str]] = None,
    max_results: int = 100,
) -> dict:
    """
    Siparişleri listele.

    order_statuses: ["Pending", "Unshipped", "Shipped", "Canceled", "Unfulfillable"]
    """
    if created_after is None:
        created_after = datetime.utcnow() - timedelta(days=7)

    params = {
        "MarketplaceIds": settings.marketplace_id,
        "CreatedAfter": created_after.isoformat() + "Z",
        "MaxResultsPerPage": min(max_results, 100),
    }
    if order_statuses:
        params["OrderStatuses"] = ",".join(order_statuses)

    url = f"{get_endpoint()}/orders/v0/orders"
    headers = await get_sp_api_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers, params=params)
        return resp.json()


async def get_order(amazon_order_id: str) -> dict:
    """Tek sipariş detayını al."""
    url = f"{get_endpoint()}/orders/v0/orders/{amazon_order_id}"
    headers = await get_sp_api_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers)
        return resp.json()


async def get_order_items(amazon_order_id: str) -> dict:
    """Sipariş kalemlerini al."""
    url = f"{get_endpoint()}/orders/v0/orders/{amazon_order_id}/orderItems"
    headers = await get_sp_api_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers)
        return resp.json()

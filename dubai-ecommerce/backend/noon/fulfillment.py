"""
noon FBPI (Fulfilled by Partner Integration).

Satıcı kendi deposunu yönetirken stok, sipariş, sevkiyat ve iadeleri API ile senkronlar.
Aynı entegrasyon ile hem noon hem Namshi'yi destekler.

Referans: noon-docs.noonpartners.dev/fulfillment/fbpi
"""

import httpx

from .auth import get_noon_headers, settings


async def get_orders(
    status: str = "pending",
    page: int = 1,
    per_page: int = 50,
) -> dict:
    """
    noon siparişlerini çek.

    status: pending, confirmed, shipped, delivered, cancelled, returned
    """
    headers = await get_noon_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.api_base}/v1/orders",
            headers=headers,
            params={"status": status, "page": page, "per_page": per_page},
        )
        return resp.json()


async def confirm_order(order_id: str) -> dict:
    """Siparişi onayla."""
    headers = await get_noon_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.api_base}/v1/orders/{order_id}/confirm",
            headers=headers,
        )
        return resp.json()


async def ship_order(order_id: str, tracking_number: str, courier: str) -> dict:
    """Siparişin sevk edildiğini noon'a bildir."""
    headers = await get_noon_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.api_base}/v1/orders/{order_id}/ship",
            headers=headers,
            json={
                "tracking_number": tracking_number,
                "courier": courier,
            },
        )
        return resp.json()


async def update_stock(sku: str, quantity: int) -> dict:
    """SKU stok seviyesini güncelle."""
    headers = await get_noon_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.patch(
            f"{settings.api_base}/v1/products/{sku}/stock",
            headers=headers,
            json={"quantity": quantity},
        )
        return resp.json()


async def update_price(sku: str, price_aed: float) -> dict:
    """SKU fiyatını güncelle."""
    headers = await get_noon_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.patch(
            f"{settings.api_base}/v1/products/{sku}/price",
            headers=headers,
            json={"selling_price": price_aed, "currency": "AED"},
        )
        return resp.json()


async def get_returns(page: int = 1) -> dict:
    """İadeleri listele."""
    headers = await get_noon_headers()

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.api_base}/v1/returns",
            headers=headers,
            params={"page": page},
        )
        return resp.json()

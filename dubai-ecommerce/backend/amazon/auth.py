"""
Amazon SP-API OAuth / LWA (Login with Amazon) kimlik doğrulama.

Marketplace: A2VIGQ35RCS4UG (UAE)
Endpoint: sellingpartnerapi-eu.amazon.com (EU region)
Dokümantasyon: developer-docs.amazon.com/sp-api/docs/connecting-to-the-selling-partner-api
"""

import time
from typing import Optional
import httpx
from pydantic_settings import BaseSettings


class AmazonSettings(BaseSettings):
    client_id: str = ""
    client_secret: str = ""
    refresh_token: str = ""
    marketplace_id: str = "A2VIGQ35RCS4UG"
    endpoint: str = "https://sellingpartnerapi-eu.amazon.com"
    sandbox: bool = False

    model_config = {"env_prefix": "AMAZON_", "env_file": ".env"}


settings = AmazonSettings()

_token_cache: dict = {"access_token": None, "expires_at": 0}


async def get_access_token() -> str:
    """LWA token al. 1 saat geçerliliği var; önbellekte tutar."""
    if _token_cache["access_token"] and time.time() < _token_cache["expires_at"] - 60:
        return _token_cache["access_token"]

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.amazon.com/auth/o2/token",
            data={
                "grant_type": "refresh_token",
                "refresh_token": settings.refresh_token,
                "client_id": settings.client_id,
                "client_secret": settings.client_secret,
            },
        )
        resp.raise_for_status()
        data = resp.json()

    _token_cache["access_token"] = data["access_token"]
    _token_cache["expires_at"] = time.time() + data.get("expires_in", 3600)
    return _token_cache["access_token"]


async def get_sp_api_headers() -> dict:
    """SP-API istekleri için gerekli başlıkları döndür."""
    token = await get_access_token()
    return {
        "x-amz-access-token": token,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def get_endpoint() -> str:
    if settings.sandbox:
        return "https://sandbox.sellingpartnerapi-eu.amazon.com"
    return settings.endpoint

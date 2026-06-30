"""
noon Partner API kimlik doğrulama.

Seller Lab > User & Access > API Users > Servis hesabı oluştur > .json key indir
Dosya yapısı:
{
  "type": "apijwt",
  "store_id": "...",
  "private_key": "...",
  "client_email": "...",
  ...
}

Referans: noon-docs.noonpartners.dev
"""

import json
import time
from pathlib import Path
from typing import Optional
import httpx
from pydantic_settings import BaseSettings


class NoonSettings(BaseSettings):
    credentials_path: str = "./noon/store_credentials.json"
    api_base: str = "https://api.noon.partners"
    country: str = "UAE"

    model_config = {"env_prefix": "NOON_", "env_file": ".env"}


settings = NoonSettings()

_noon_token_cache: dict = {"token": None, "expires_at": 0}


def load_credentials() -> dict:
    """store_credentials.json dosyasını yükle."""
    path = Path(settings.credentials_path)
    if not path.exists():
        raise FileNotFoundError(
            f"noon credentials dosyası bulunamadı: {path}\n"
            "Seller Lab > User & Access > API Users > .json key indir"
        )
    return json.loads(path.read_text())


async def get_noon_token() -> str:
    """
    noon Partner API JWT token al.
    Token 30 gün geçerli; önbellekte tutar.
    """
    if _noon_token_cache["token"] and time.time() < _noon_token_cache["expires_at"] - 3600:
        return _noon_token_cache["token"]

    creds = load_credentials()

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.api_base}/auth/v1/token",
            json={
                "type": creds.get("type", "apijwt"),
                "store_id": creds.get("store_id"),
                "private_key": creds.get("private_key"),
                "client_email": creds.get("client_email"),
            },
        )
        resp.raise_for_status()
        data = resp.json()

    token = data.get("access_token") or data.get("token")
    _noon_token_cache["token"] = token
    _noon_token_cache["expires_at"] = time.time() + (30 * 24 * 3600)
    return token


async def get_noon_headers() -> dict:
    """noon API istekleri için başlıklar."""
    token = await get_noon_token()
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Country": settings.country,
    }

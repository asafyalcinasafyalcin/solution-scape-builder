from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class ProductBase(SQLModel):
    sku: str = Field(index=True)
    title_en: str
    title_ar: Optional[str] = None
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    bullet_points_en: Optional[str] = None  # JSON array stored as string
    bullet_points_ar: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    price_aed: Optional[float] = None
    cost_try: Optional[float] = None  # TRY cinsinden maliyet
    weight_kg: Optional[float] = None
    color: Optional[str] = None
    size: Optional[str] = None
    image_main_url: Optional[str] = None
    image_urls: Optional[str] = None  # JSON array
    hs_code: Optional[str] = None
    origin_country: str = "TR"


class Product(ProductBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Amazon durumu
    amazon_asin: Optional[str] = None
    amazon_status: Optional[str] = None  # active, inactive, pending, error
    amazon_bsr: Optional[int] = None
    amazon_last_synced: Optional[datetime] = None

    # noon durumu
    noon_sku_parent: Optional[str] = None
    noon_status: Optional[str] = None  # active, inactive, pending_qc, error
    noon_last_synced: Optional[datetime] = None


class ProductCreate(ProductBase):
    pass


class ProductRead(ProductBase):
    id: int
    amazon_asin: Optional[str]
    amazon_status: Optional[str]
    noon_sku_parent: Optional[str]
    noon_status: Optional[str]
    created_at: datetime

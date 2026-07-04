from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from enum import Enum


class Platform(str, Enum):
    amazon = "amazon"
    noon = "noon"


class OrderStatus(str, Enum):
    pending = "pending"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"
    returned = "returned"


class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    platform: Platform
    platform_order_id: str = Field(index=True)
    sku: str
    quantity: int
    price_aed: float
    status: OrderStatus = OrderStatus.pending
    buyer_name: Optional[str] = None
    shipping_city: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

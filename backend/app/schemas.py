import datetime as dt
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class ORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(ORM):
    id: int
    name: str
    email: EmailStr
    is_admin: bool


class TokenOut(BaseModel):
    access_token: str
    user: UserOut


class ProductIn(BaseModel):
    name: str
    brand: str
    price: Decimal = Field(gt=0)
    storage: str = ""
    color: str = ""
    description: str = ""
    image_url: str = ""
    stock: int = Field(ge=0, default=0)


class ProductOut(ProductIn, ORM):
    id: int


class CartLine(BaseModel):
    product_id: int
    qty: int = Field(gt=0, le=10)


class OrderIn(BaseModel):
    address: str = Field(min_length=5)
    items: List[CartLine] = Field(min_length=1)


class OrderItemOut(ORM):
    name: str
    price: Decimal
    qty: int


class OrderOut(ORM):
    id: int
    total: Decimal
    address: str
    status: str
    created_at: dt.datetime
    items: List[OrderItemOut]

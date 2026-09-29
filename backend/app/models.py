import datetime as dt
from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    brand = Column(String(50), index=True, nullable=False)  # Apple | Samsung
    price = Column(Numeric(10, 2), nullable=False)
    storage = Column(String(20))
    color = Column(String(50))
    description = Column(Text)
    image_url = Column(String(500), default="")
    stock = Column(Integer, default=0)


class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    address = Column(String(500), nullable=False)
    status = Column(String(30), default="Placed")
    created_at = Column(DateTime, default=dt.datetime.utcnow)
    items = relationship("OrderItem", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    name = Column(String(150), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    qty = Column(Integer, nullable=False)

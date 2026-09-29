import time
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_

from . import models, schemas
from .database import Base, engine, get_db, SessionLocal
from .security import hash_password, verify_password, create_token, current_user, admin_user
from .seed import seed

app = FastAPI(title="Phone Shop API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.on_event("startup")
def startup():
    for attempt in range(30):  # wait for MySQL
        try:
            Base.metadata.create_all(bind=engine)
            break
        except Exception:
            time.sleep(2)
    else:
        raise RuntimeError("Database not reachable")
    with SessionLocal() as db:
        seed(db)


@app.get("/api/health")
def health():
    return {"status": "ok"}


# ---------- Auth ----------
@app.post("/api/auth/register", response_model=schemas.TokenOut, status_code=201)
def register(data: schemas.RegisterIn, db: Session = Depends(get_db)):
    if db.query(models.User).filter_by(email=data.email).first():
        raise HTTPException(400, "Email already registered")
    user = models.User(name=data.name, email=data.email, password_hash=hash_password(data.password))
    db.add(user); db.commit(); db.refresh(user)
    return {"access_token": create_token(user.id), "user": user}


@app.post("/api/auth/login", response_model=schemas.TokenOut)
def login(data: schemas.LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(email=data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Wrong email or password")
    return {"access_token": create_token(user.id), "user": user}


@app.get("/api/auth/me", response_model=schemas.UserOut)
def me(user: models.User = Depends(current_user)):
    return user


# ---------- Products ----------
@app.get("/api/products", response_model=List[schemas.ProductOut])
def list_products(brand: Optional[str] = None, q: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Product)
    if brand:
        query = query.filter(models.Product.brand == brand)
    if q:
        like = f"%{q}%"
        query = query.filter(or_(models.Product.name.like(like), models.Product.description.like(like)))
    return query.order_by(models.Product.brand, models.Product.price.desc()).all()


@app.get("/api/products/{pid}", response_model=schemas.ProductOut)
def get_product(pid: int, db: Session = Depends(get_db)):
    p = db.get(models.Product, pid)
    if not p:
        raise HTTPException(404, "Product not found")
    return p


@app.post("/api/products", response_model=schemas.ProductOut, status_code=201)
def create_product(data: schemas.ProductIn, db: Session = Depends(get_db), _: models.User = Depends(admin_user)):
    p = models.Product(**data.model_dump())
    db.add(p); db.commit(); db.refresh(p)
    return p


@app.put("/api/products/{pid}", response_model=schemas.ProductOut)
def update_product(pid: int, data: schemas.ProductIn, db: Session = Depends(get_db), _: models.User = Depends(admin_user)):
    p = db.get(models.Product, pid)
    if not p:
        raise HTTPException(404, "Product not found")
    for k, v in data.model_dump().items():
        setattr(p, k, v)
    db.commit(); db.refresh(p)
    return p


@app.delete("/api/products/{pid}", status_code=204)
def delete_product(pid: int, db: Session = Depends(get_db), _: models.User = Depends(admin_user)):
    p = db.get(models.Product, pid)
    if not p:
        raise HTTPException(404, "Product not found")
    db.delete(p); db.commit()


# ---------- Orders ----------
@app.post("/api/orders", response_model=schemas.OrderOut, status_code=201)
def create_order(data: schemas.OrderIn, db: Session = Depends(get_db), user: models.User = Depends(current_user)):
    order = models.Order(user_id=user.id, address=data.address, total=0)
    total = 0
    for line in data.items:
        p = db.query(models.Product).filter_by(id=line.product_id).with_for_update().first()
        if not p:
            raise HTTPException(404, f"Product {line.product_id} not found")
        if p.stock < line.qty:
            raise HTTPException(400, f"Only {p.stock} left of {p.name}")
        p.stock -= line.qty
        total += p.price * line.qty
        order.items.append(models.OrderItem(product_id=p.id, name=p.name, price=p.price, qty=line.qty))
    order.total = total
    db.add(order); db.commit(); db.refresh(order)
    return order


@app.get("/api/orders", response_model=List[schemas.OrderOut])
def my_orders(db: Session = Depends(get_db), user: models.User = Depends(current_user)):
    return db.query(models.Order).filter_by(user_id=user.id).order_by(models.Order.id.desc()).all()

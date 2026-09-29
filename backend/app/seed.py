from .models import Product, User
from .security import hash_password

PRODUCTS = [
    ("iPhone 16 Pro Max", "Apple", 1199, "256GB", "Desert Titanium", "6.9-inch Super Retina XDR display, A18 Pro chip, 48MP Fusion camera with 5x telephoto.", 12),
    ("iPhone 16 Pro", "Apple", 999, "128GB", "Natural Titanium", "6.3-inch display, A18 Pro chip, Camera Control button and all-day battery.", 15),
    ("iPhone 16", "Apple", 799, "128GB", "Ultramarine", "A18 chip, 48MP Fusion camera, Action button and Apple Intelligence.", 20),
    ("iPhone 15", "Apple", 699, "128GB", "Pink", "Dynamic Island, 48MP main camera and USB-C.", 18),
    ("iPhone SE", "Apple", 429, "64GB", "Midnight", "Compact design, Touch ID and a fast A15 Bionic chip.", 25),
    ("Galaxy S24 Ultra", "Samsung", 1299, "256GB", "Titanium Gray", "6.8-inch Dynamic AMOLED 2X, built-in S Pen, 200MP camera and Galaxy AI.", 10),
    ("Galaxy S24+", "Samsung", 999, "256GB", "Onyx Black", "6.7-inch QHD+ display, Snapdragon 8 Gen 3 and 4900mAh battery.", 14),
    ("Galaxy S24", "Samsung", 799, "128GB", "Marble Gray", "6.2-inch compact flagship with a 50MP triple camera.", 16),
    ("Galaxy Z Fold6", "Samsung", 1899, "256GB", "Silver Shadow", "7.6-inch foldable main screen that turns into a pocket tablet.", 6),
    ("Galaxy Z Flip6", "Samsung", 1099, "256GB", "Mint", "Pocketable flip design with a 3.4-inch cover screen.", 8),
    ("Galaxy A55", "Samsung", 449, "128GB", "Awesome Navy", "6.6-inch Super AMOLED, metal frame and 5000mAh battery.", 30),
]


def seed(db):
    if db.query(Product).count() == 0:
        for n, b, p, s, c, d, st in PRODUCTS:
            db.add(Product(name=n, brand=b, price=p, storage=s, color=c, description=d, stock=st))
    if not db.query(User).filter_by(email="admin@shop.com").first():
        db.add(User(name="Admin", email="admin@shop.com", password_hash=hash_password("admin123"), is_admin=True))
    db.commit()

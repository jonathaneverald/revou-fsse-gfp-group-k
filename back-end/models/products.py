from db import db
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, Numeric, ForeignKey
from datetime import datetime, timedelta


def gmt_plus_7_now():
    return datetime.utcnow() + timedelta(hours=7)


class ProductModel(db.Model):
    __tablename__ = "products"

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = mapped_column(Integer, ForeignKey("categories.id"), nullable=False)
    seller_id = mapped_column(Integer, ForeignKey("sellers.id"), nullable=False)
    slug = mapped_column(String(255), unique=True)
    name = mapped_column(String(255))
    price = mapped_column(Numeric(10, 2))
    quantity = mapped_column(Integer)
    description = mapped_column(String(255))
    type = mapped_column(String(255))

    category = relationship('CategoryModel', back_populates='products')

    def to_dictionaries(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "category_id": self.category_id,
            "seller_id": self.seller_id,
            "slug": self.slug,
            "name": self.name,
            "price": self.price,
            "quantity": self.quantity,
            "description": self.description,
            "type": self.type,
        }

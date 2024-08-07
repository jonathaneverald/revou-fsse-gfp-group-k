from db import db
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, Numeric, ForeignKey
from datetime import datetime, timedelta


def gmt_plus_7_now():
    return datetime.utcnow() + timedelta(hours=7)


class ProductImageModel(db.Model):
    __tablename__ = "product_images"

    id = mapped_column(Integer, primary_key=True)
    product_id = mapped_column(Integer, ForeignKey("products.id"), nullable=False)
    image_url = mapped_column(String(255))

    products = relationship("ProductModel", back_populates="product_images")

    def to_dictionaries(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "image_url": self.image_url,
        }

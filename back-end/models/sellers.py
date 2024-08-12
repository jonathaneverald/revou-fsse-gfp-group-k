from db import db
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, Numeric, ForeignKey
from datetime import datetime, timedelta
from slugify import slugify
import random


def gmt_plus_7_now():
    return datetime.utcnow() + timedelta(hours=7)


class SellerModel(db.Model):
    __tablename__ = "sellers"

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(
        Integer, ForeignKey("users.id"), unique=True, nullable=False
    )
    location_id = mapped_column(Integer, ForeignKey("locations.id"), nullable=False)
    slug = mapped_column(String(255), unique=True)
    name = mapped_column(String(255))

    products = db.relationship("ProductModel", backref="seller", lazy=True)
    vouchers = relationship("VoucherModel", back_populates="sellers")

    def to_dictionaries(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "location_id": self.location_id,
            "slug": self.slug,
            "name": self.name,
        }

    @staticmethod
    def generate_slug(name):
        slug_base = slugify(name)
        unique_number = random.randint(100000, 999999)
        return f"{slug_base}-{unique_number}"

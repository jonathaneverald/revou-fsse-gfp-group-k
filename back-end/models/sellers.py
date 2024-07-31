from db import db
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, Numeric, ForeignKey
from datetime import datetime, timedelta


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

    def to_dictionaries(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "location_id": self.location_id,
            "slug": self.slug,
            "name": self.name,
        }

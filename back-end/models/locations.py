from db import db
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, Numeric, ForeignKey
from datetime import datetime, timedelta


def gmt_plus_7_now():
    return datetime.utcnow() + timedelta(hours=7)


class LocationModel(db.Model):
    __tablename__ = "locations"

    id = mapped_column(Integer, primary_key=True)
    slug = mapped_column(String(255), unique=True)
    city = mapped_column(String(255), unique=True)

    sellers = db.relationship("SellerModel", backref="user", lazy=True)

    def to_dictionaries(self):
        return {"id": self.id, "slug": self.slug, "city": self.city}

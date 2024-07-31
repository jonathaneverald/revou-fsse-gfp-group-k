from db import db
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, ForeignKey
from datetime import datetime, timedelta
import bcrypt
from flask_login import UserMixin


def gmt_plus_7_now():
    return datetime.utcnow() + timedelta(hours=7)


class UserModel(db.Model, UserMixin):
    __tablename__ = "users"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(255))
    email = mapped_column(String(255), unique=True)
    password = mapped_column(String(255))
    role = mapped_column(String(255))
    address = mapped_column(String(255))
    phone_number = mapped_column(String(255))
    created_at = mapped_column(DateTime, default=gmt_plus_7_now)
    updated_at = mapped_column(
        DateTime, default=gmt_plus_7_now, onupdate=gmt_plus_7_now
    )
    sellers = db.relationship("SellerModel", uselist=False, backref="user", lazy=True)
    products = db.relationship("ProductModel", backref="user", lazy=True)

    def to_dictionaries(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "address": self.address,
            "phone_number": self.phone_number,
        }

    def set_password(self, password):
        self.password = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

    def check_password(self, password):
        return bcrypt.checkpw(password.encode("utf-8"), self.password.encode("utf-8"))

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import DECIMAL, ForeignKey, String, Integer

from db import db


class CartModel(db.Model):
    __tablename__ = "carts"

    id = mapped_column(Integer, primary_key=True)
    product_id = mapped_column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    quantity = mapped_column(Integer, nullable=False)

    product = relationship("ProductModel", back_populates="carts")
    user = relationship("UserModel", back_populates="carts")

    def __repr__(self):
        return f"<Cart {self.id}>"

    def to_dictionaries(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "user_id": self.user_id,
            "quantity": self.quantity,
        }

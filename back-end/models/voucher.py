from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import DECIMAL, ForeignKey, Numeric, String, Integer

from db import db


class VoucherModel(db.Model):
    __tablename__ = "vouchers"

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = mapped_column(Integer, ForeignKey("sellers.id"), nullable=False)
    name = mapped_column(String(255), nullable=False)
    discount = mapped_column(Numeric(10, 2))

    users = relationship("UserModel", back_populates="vouchers")
    sellers = relationship("SellerModel", back_populates="vouchers")
    transaction_vouchers = relationship(
        "TransactionVoucherModel", back_populates="vouchers"
    )

    def __repr__(self):
        return f"<Voucher {self.id}>"

    def to_dictionaries(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "seller_id": self.seller_id,
            "name": self.name,
            "discount": self.discount,
        }

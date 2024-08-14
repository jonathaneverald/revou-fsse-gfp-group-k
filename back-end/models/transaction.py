from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import DECIMAL, ForeignKey, Numeric, String, Integer, DateTime

from db import db


class TransactionModel(db.Model):
    __tablename__ = "transactions"

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = mapped_column(Integer, ForeignKey("sellers.id"), nullable=False)
    total_price = mapped_column(Numeric(10, 2))
    status = mapped_column(String(255), nullable=False)
    created_at = mapped_column(DateTime, default=datetime.now)
    updated_at = mapped_column(DateTime, default=datetime.now, onupdate=datetime.now)

    users = relationship("UserModel", back_populates="transactions")
    sellers = relationship("SellerModel", back_populates="transactions")
    details = relationship("TransactionDetailModel", back_populates="transaction")
    transaction_vouchers = relationship(
        "TransactionVoucherModel", back_populates="transactions"
    )

    def __repr__(self):
        return f"<Transaction {self.id}>"

    def to_dictionaries(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "seller_id": self.seller_id,
            "total_price": self.total_price,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

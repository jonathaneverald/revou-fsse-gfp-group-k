from db import db
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, Numeric, ForeignKey
from datetime import datetime, timedelta


class TransactionVoucherModel(db.Model):
    __tablename__ = "transaction_vouchers"

    id = mapped_column(Integer, primary_key=True)
    transaction_id = mapped_column(
        Integer, ForeignKey("transactions.id"), nullable=False
    )
    voucher_id = mapped_column(Integer, ForeignKey("vouchers.id"), nullable=False)
    amount = mapped_column(Numeric(10, 2))

    transactions = relationship(
        "TransactionModel", back_populates="transaction_vouchers"
    )
    vouchers = relationship("VoucherModel", back_populates="transaction_vouchers")

    def to_dictionaries(self):
        return {
            "id": self.id,
            "transaction_id": self.transaction_id,
            "voucher_id": self.voucher_id,
            "amount": self.amount,
        }

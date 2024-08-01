from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import DECIMAL, ForeignKey, Numeric, String, Integer, DateTime

from db import db

class TransactionModel(db.Model):
    __tablename__ = 'transactions'

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    seller_id = mapped_column(Integer, ForeignKey('sellers.id'), nullable=False)
    voucher_id = mapped_column(Integer, ForeignKey('vouchers.id'), nullable=True)
    total_price =  mapped_column(Numeric(10, 2))
    total_discount =  mapped_column(Numeric(10, 2))
    status = mapped_column(String(255), nullable=False)
    created_at = mapped_column(DateTime, default=datetime.now)
    updated_at = mapped_column(DateTime, default=datetime.now, onupdate=datetime.now)

    details = relationship('TransactionDetailsModel', back_populates='transaction')
    voucher = relationship('VoucherModel', back_populates='transactions')

    def __repr__(self):
        return f'<Transaction {self.id}>'
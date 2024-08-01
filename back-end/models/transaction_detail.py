from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import DECIMAL, ForeignKey, Integer

from db import db

class TransactionDetailModel(db.Model):
    __tablename__ = 'transaction_details'

    id = mapped_column(Integer, primary_key=True)
    transaction_id = mapped_column(Integer, ForeignKey('transactions.id'), nullable=False)
    product_id = mapped_column(Integer, ForeignKey('products.id'), nullable=False)
    price = mapped_column(DECIMAL(10, 2), nullable=False)
    quantity = mapped_column(Integer, nullable=False)

    transaction = relationship('Transaction', back_populates='details')

    def __repr__(self):
        return f'<TransactionDetails {self.id}>'
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import DECIMAL, ForeignKey, String, Integer

db = SQLAlchemy()

class Voucher(db.Model):
    __tablename__ = 'vouchers'

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    seller_id = mapped_column(Integer, ForeignKey('sellers.id'), nullable=False)
    name = mapped_column(String(255), nullable=False)
    discount = mapped_column(DECIMAL(10, 2), nullable=False)

    transactions = relationship('Transaction', back_populates='voucher')

    def __repr__(self):
        return f'<Voucher {self.id}>'
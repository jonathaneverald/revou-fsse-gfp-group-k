from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import DECIMAL, ForeignKey, String, Integer

from db import db

class CartModel(db.Model):
    __tablename__ = 'carts'

    id = mapped_column(Integer, primary_key=True)
    product_id = mapped_column(Integer, ForeignKey('products.id'), nullable=False)
    user_id = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
 
    product = relationship('Product', back_populates='carts')
    user = relationship('User', back_populates='carts')

    def __repr__(self):
        return f'<Cart {self.id}>'
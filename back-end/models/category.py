from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import mapped_column
from sqlalchemy import String, Integer

db = SQLAlchemy()

class Category(db.Model):
    __tablename__ = 'categories'

    id = mapped_column(Integer, primary_key=True) 
    slug = mapped_column(String(255), unique=True)
    name = mapped_column(String(255), nullable=False)
 
    def __repr__(self):
        return f'<Category {self.id}>'
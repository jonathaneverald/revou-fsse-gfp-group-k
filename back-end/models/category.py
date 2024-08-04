from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Integer
from slugify import slugify
import random

from db import db


class CategoryModel(db.Model):
    __tablename__ = "categories"

    id = mapped_column(Integer, primary_key=True)
    slug = mapped_column(String(255), unique=True)
    name = mapped_column(String(255), nullable=False)

    products = relationship("ProductModel", back_populates="category")

    def __repr__(self):
        return f"<Category {self.id}>"

    def to_dictionaries(self):
        return {"id": self.id, "slug": self.slug, "name": self.name}

    @staticmethod
    def generate_slug(name):
        slug_base = slugify(name)
        unique_number = random.randint(100000, 999999)
        return f"{slug_base}-{unique_number}"

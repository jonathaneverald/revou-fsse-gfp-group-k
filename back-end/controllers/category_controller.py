from flask import Blueprint, request
from connector.mysql_connector import connection
from models.category import CategoryModel
from sqlalchemy.orm import sessionmaker
from schemas.category_schema import add_category_schema
from cerberus import Validator
from utils.handle_response import ResponseHandler

category_blueprint = Blueprint("category_blueprint", __name__)


@category_blueprint.post("/category")
def add_category():
    Session = sessionmaker(bind=connection)
    s = Session()
    s.begin()

    try:
        data = request.get_json()
        validator = Validator(add_category_schema)

        if not validator.validate(data):
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        name = data.get("name")
        slug = CategoryModel.generate_slug(name)

        new_category = CategoryModel(slug=slug, name=name)

        s.add(new_category)
        s.commit()

        return ResponseHandler.success(
            message="Category added successfully",
            data=new_category.to_dictionaries(),
            status=201,
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while adding the category",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@category_blueprint.get("/category")
def show_all_category():
    try:
        categories = CategoryModel.query.all()
        categories_list = [category.to_dictionaries() for category in categories]

        return ResponseHandler.success(data=categories_list, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occurred while showing categories",
            data=str(e),
            status=500,
        )


@category_blueprint.get("/category/<slug>")
def show_category_by_slug(slug):
    Session = sessionmaker(connection)
    s = Session()

    try:
        category = s.query(CategoryModel).filter_by(slug=slug).first()

        if not category:
            return ResponseHandler.error(
                message="Category not found", data=None, status=404
            )

        return ResponseHandler.success(
            message="Category retrieved successfully",
            data=category.to_dictionaries(),
            status=200,
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while showing category",
            data=str(e),
            status=500,
        )

    finally:
        s.close()

from flask import Blueprint, request
from connector.mysql_connector import connection
from models.products import ProductModel
from models.users import UserModel
from models.category import CategoryModel
from models.sellers import SellerModel
from models.locations import LocationModel
from sqlalchemy.orm import sessionmaker
from flask_jwt_extended import jwt_required, get_jwt_identity
from cerberus import Validator
from schemas.product_schema import add_product_schema, update_product_schema
from utils.handle_response import ResponseHandler
from slugify import slugify
from math import ceil

product_blueprint = Blueprint("product_blueprint", __name__)


@product_blueprint.post("/product")
@jwt_required()
def add_product():
    user_id = get_jwt_identity()
    Session = sessionmaker(bind=connection)
    s = Session()
    s.begin()

    try:
        current_user = s.query(UserModel).filter_by(id=user_id).first()
        if not current_user:
            return ResponseHandler.error(message="User not found", status=404)

        # Check if the current user's role is "seller"
        if current_user.role != "seller":
            return ResponseHandler.error(message="Unauthorized access", status=403)

        seller = s.query(SellerModel).filter_by(user_id=current_user.id).first()
        if not seller:
            return ResponseHandler.error(message="Seller not found", status=404)

        data = request.get_json()  # Get input data
        validator = Validator(add_product_schema)
        if not validator.validate(data):
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        # Check if inputted category is exists in database
        category = s.query(CategoryModel).filter_by(name=data["category_name"]).first()
        if not category:
            return ResponseHandler.error(message="Category not found", status=404)

        slug = ProductModel.generate_slug(data["name"])

        new_product = ProductModel(
            user_id=user_id,
            category_id=category.id,
            seller_id=seller.id,
            slug=slug,
            name=data["name"],
            price=data["price"],
            quantity=data["quantity"],
            description=data.get("description"),  # Use get to handle optional fields
            type=data.get("type"),
        )

        s.add(new_product)
        s.commit()

        product_info = (
            s.query(ProductModel, SellerModel.name, CategoryModel.name)
            .join(SellerModel, ProductModel.seller_id == SellerModel.id)
            .join(CategoryModel, ProductModel.category_id == CategoryModel.id)
            .filter(ProductModel.id == new_product.id)
            .first()
        )

        if product_info:
            product, seller_name, category_name = product_info
            product_dict = product.to_dictionaries()
            product_dict["seller_name"] = seller_name
            product_dict["category_name"] = category_name

            return ResponseHandler.success(data=product_dict, status=201)

        return ResponseHandler.error(
            message="Error retrieving product info", status=500
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while adding the product",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@product_blueprint.put("/product/<int:product_id>")
@jwt_required()
def update_product(product_id):
    user_id = get_jwt_identity()
    Session = sessionmaker(connection)
    s = Session()
    s.begin()

    try:
        current_user = s.query(UserModel).filter_by(id=user_id).first()
        if not current_user:
            return ResponseHandler.error(message="User not found", status=404)

        # Check if the current user's role is "seller"
        if current_user.role != "seller":
            return ResponseHandler.error(message="Unauthorized access", status=403)

        seller = s.query(SellerModel).filter_by(user_id=current_user.id).first()
        if not seller:
            return ResponseHandler.error(message="Seller not found", status=404)

        product = (
            s.query(ProductModel).filter_by(id=product_id, seller_id=seller.id).first()
        )
        if not product:
            return ResponseHandler.error(message="Product not found", status=404)

        data = request.get_json()  # Get input data
        validator = Validator(update_product_schema)
        if not validator.validate(data):
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        # Update location if provided
        if "category_name" in data:
            category = (
                s.query(CategoryModel).filter_by(name=data["category_name"]).first()
            )
            if not category:
                return ResponseHandler.error(message="Category not found", status=404)
            product.category_id = category.id
        else:
            # Fetch the current location if not updating the city_location
            category = s.query(CategoryModel).filter_by(id=product.category_id).first()

        # Update name and slug if provided
        if "name" in data:
            name = data["name"]
            slug_base = slugify(name)

            # Preserve the numeric part of the slug
            numeric_part = seller.slug.split("-")[-1]
            new_slug = f"{slug_base}-{numeric_part}"

            product.name = name
            product.slug = new_slug
        else:
            product = s.query(ProductModel).filter_by(name=product.name).first()

        # Update other fields
        if "price" in data:
            product.price = data["price"]
        if "quantity" in data:
            product.quantity = data["quantity"]
        if "description" in data:
            product.description = data["description"]
        if "type" in data:
            product.type = data["type"]

        s.commit()

        product_info = (
            s.query(ProductModel, SellerModel.name, CategoryModel.name)
            .join(SellerModel, ProductModel.seller_id == SellerModel.id)
            .join(CategoryModel, ProductModel.category_id == CategoryModel.id)
            .filter(ProductModel.id == product.id)
            .first()
        )

        if product_info:
            product, seller_name, category_name = product_info
            product_dict = product.to_dictionaries()
            product_dict["seller_name"] = seller_name
            product_dict["category_name"] = category_name

            return ResponseHandler.success(data=product_dict, status=201)

        return ResponseHandler.error(
            message="Error retrieving product info", status=500
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while updating the product detail",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@product_blueprint.get("/product")
@jwt_required()
def show_all_product():
    try:
        # Get query parameters for pagination
        page = request.args.get("page", default=None, type=int)
        per_page = request.args.get("per_page", default=None, type=int)

        if page is None or per_page is None:
            products = (
                ProductModel.query.join(
                    SellerModel, ProductModel.seller_id == SellerModel.id
                )
                .join(CategoryModel, ProductModel.category_id == CategoryModel.id)
                .add_columns(SellerModel.name, SellerModel.slug, CategoryModel.name)
                .all()
            )

            products_list = [
                {
                    "id": product.id,
                    "user_id": product.user_id,
                    "category_id": product.category_id,
                    "seller_id": product.seller_id,
                    "product_slug": product.slug,
                    "name": product.name,
                    "price": product.price,
                    "quantity": product.quantity,
                    "description": product.description,
                    "type": product.type,
                    "seller_name": seller_name,
                    "seller_slug": seller_slug,
                    "category_name": category_name,
                }
                for product, seller_name, seller_slug, category_name in products
            ]

            return ResponseHandler.success(data=products_list, status=200)

        else:
            # Get the total number of products
            total_products = ProductModel.query.count()

            # Calculate the total number of pages
            total_pages = ceil(total_products / per_page)

            products = (
                ProductModel.query.join(
                    SellerModel, ProductModel.seller_id == SellerModel.id
                )
                .join(CategoryModel, ProductModel.category_id == CategoryModel.id)
                .add_columns(SellerModel.name, SellerModel.slug, CategoryModel.name)
                .paginate(page=page, per_page=per_page, error_out=False)
            )

            products_list = [
                {
                    "id": product.id,
                    "user_id": product.user_id,
                    "category_id": product.category_id,
                    "seller_id": product.seller_id,
                    "product_slug": product.slug,
                    "name": product.name,
                    "price": product.price,
                    "quantity": product.quantity,
                    "description": product.description,
                    "type": product.type,
                    "seller_name": seller_name,
                    "seller_slug": seller_slug,
                    "category_name": category_name,
                }
                for product, seller_name, seller_slug, category_name in products.items
            ]

            pagination = {
                "total_products": total_products,
                "current_page": page,
                "total_pages": total_pages,
                "next_page": page + 1 if page < total_pages else None,
                "prev_page": page - 1 if page > 1 else None,
            }

            response = {"data": products_list, "pagination": pagination}

            return ResponseHandler.success(data=response, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occurred while showing products",
            data=str(e),
            status=500,
        )


@product_blueprint.get("/product/<slug>")
@jwt_required()
def show_product_by_slug(slug):
    try:
        product_result = (
            ProductModel.query.join(
                SellerModel, ProductModel.seller_id == SellerModel.id
            )
            .join(CategoryModel, ProductModel.category_id == CategoryModel.id)
            .join(LocationModel, SellerModel.location_id == LocationModel.id)
            .add_columns(
                SellerModel.name,
                SellerModel.slug,
                CategoryModel.name,
                CategoryModel.slug,
                LocationModel.city,
            )
            .filter(ProductModel.slug == slug)
            .first()
        )
        if not product_result:
            return ResponseHandler.error(message="Product not found", status=404)

        (
            product,
            seller_name,
            seller_slug,
            category_name,
            category_slug,
            location_city,
        ) = product_result

        product_detail = {
            "id": product.id,
            "user_id": product.user_id,
            "category_id": product.category_id,
            "seller_id": product.seller_id,
            "product_slug": product.slug,
            "name": product.name,
            "price": product.price,
            "quantity": product.quantity,
            "description": product.description,
            "type": product.type,
            "seller_name": seller_name,
            "category_name": category_name,
            "seller_slug": seller_slug,
            "category_slug": category_slug,
            "location_city": location_city,
        }

        return ResponseHandler.success(data=product_detail, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occurred while fetching product details",
            data=str(e),
            status=500,
        )


@product_blueprint.delete("/product/<int:product_id>")
@jwt_required()
def delete_product(product_id):
    user_id = get_jwt_identity()
    Session = sessionmaker(connection)
    s = Session()
    s.begin()

    try:
        current_user = s.query(UserModel).filter_by(id=user_id).first()
        if not current_user:
            return ResponseHandler.error(message="User not found", status=404)

        # Check if the current user's role is "seller"
        if current_user.role != "seller":
            return ResponseHandler.error(message="Unauthorized access", status=403)

        seller = s.query(SellerModel).filter_by(user_id=current_user.id).first()
        if not seller:
            return ResponseHandler.error(message="Seller not found", status=404)

        product = (
            s.query(ProductModel).filter_by(id=product_id, seller_id=seller.id).first()
        )
        if not product:
            return ResponseHandler.error(message="Product not found", status=404)

        s.delete(product)
        s.commit()

        return ResponseHandler.success(
            message="Product deleted successfully", status=200
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while deleting the product",
            data=str(e),
            status=500,
        )

    finally:
        s.close()

from flask import Blueprint, request
from flask_cors import cross_origin
from connector.mysql_connector import connection
from models.products import ProductModel
from models.product_images import ProductImageModel
from models.users import UserModel
from models.category import CategoryModel
from models.sellers import SellerModel
from models.locations import LocationModel
from models.cart import CartModel
from models.product_images import ProductImageModel
from sqlalchemy.orm import sessionmaker
from flask_jwt_extended import jwt_required, get_jwt_identity
from cerberus import Validator
from schemas.product_schema import add_product_schema, update_product_schema
from utils.handle_response import ResponseHandler
from slugify import slugify
from math import ceil
import os
import cloudinary
import cloudinary.uploader

product_blueprint = Blueprint("product_blueprint", __name__)

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)


@product_blueprint.post("/product")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
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
            return ResponseHandler.error(message="Data Invalid!", data=validator.errors, status=400)

        # Check if inputted category is exists in database
        category = s.query(CategoryModel).filter_by(slug=data["category_name"]).first()
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

        return ResponseHandler.error(message="Error retrieving product info", status=500)

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while adding the product",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@product_blueprint.post("/product/upload-image/<int:product_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def upload_product_image(product_id):
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

        product = s.query(ProductModel).filter_by(id=product_id, seller_id=seller.id).first()
        if not product:
            return ResponseHandler.error(
                message="Product not found or the Product belongs to other seller",
                status=404,
            )

        # Get the uploaded files from the request
        files = request.files.getlist("product_image")

        for file in files:
            upload_result = cloudinary.uploader.upload(file)
            image_url = upload_result["secure_url"]
            product_image = ProductImageModel(product_id=product_id, image_url=image_url)
            s.add(product_image)

        s.commit()

        product_images = s.query(ProductImageModel).filter_by(product_id=product_id).all()
        return ResponseHandler.success(data=[product_image.to_dictionaries() for product_image in product_images])

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while uploading product images",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@product_blueprint.put("/product/<int:product_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
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

        product = s.query(ProductModel).filter_by(id=product_id, seller_id=seller.id).first()
        if not product:
            return ResponseHandler.error(
                message="Product not found or the Product belongs to other seller",
                status=404,
            )

        data = request.get_json()  # Get input data
        validator = Validator(update_product_schema)
        if not validator.validate(data):
            return ResponseHandler.error(message="Data Invalid!", data=validator.errors, status=400)

        # Update location if provided
        if "category_name" in data:
            category = s.query(CategoryModel).filter_by(name=data["category_name"]).first()
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

        return ResponseHandler.error(message="Error retrieving product info", status=500)

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while updating the product detail",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@product_blueprint.put("/product/<int:product_id>/<int:image_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def update_product_image(product_id, image_id):
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

        product = s.query(ProductModel).filter_by(id=product_id, seller_id=seller.id).first()
        if not product:
            return ResponseHandler.error(
                message="Product not found or the Product belongs to other seller",
                status=404,
            )

        # Get the product image
        product_image = s.query(ProductImageModel).filter_by(id=image_id, product_id=product_id).first()
        if not product_image:
            return ResponseHandler.error(
                message="Product image not found or the image belongs to other product",
                status=404,
            )

        # Delete the previous image from Cloudinary
        public_id = os.path.splitext(os.path.basename(product_image.image_url))[0]
        cloudinary.uploader.destroy(public_id)

        new_images = request.files.getlist("product_image")
        if len(new_images) > 1:
            return ResponseHandler.error(
                message="Only one image can be uploaded at a time",
                status=400,
            )

        new_image = new_images[0]
        upload_result = cloudinary.uploader.upload(new_image)
        image_url = upload_result["secure_url"]

        product_image.product_id = product_id
        product_image.image_url = image_url

        s.commit()

        return ResponseHandler.success(data=product_image.to_dictionaries())

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while updating the product image",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@product_blueprint.get("/product")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def show_all_product():
    try:
        # Get query parameters for pagination
        page = request.args.get("page", default=None, type=int)
        per_page = request.args.get("per_page", default=None, type=int)

        # Get query parameters for search filters
        product_name = request.args.get("product_name", default=None, type=str)
        location = request.args.get("location", default=None, type=str)
        category = request.args.get("category", default=None, type=str)

        product_query = (
            ProductModel.query.join(SellerModel, ProductModel.seller_id == SellerModel.id)
            .join(CategoryModel, ProductModel.category_id == CategoryModel.id)
            .join(LocationModel, SellerModel.location_id == LocationModel.id)
            .add_columns(
                SellerModel.name,
                SellerModel.slug,
                CategoryModel.name,
            )
        )

        # Apply search filters
        if product_name:
            product_query = product_query.filter(ProductModel.name.ilike(f"%{product_name}%"))
        if location:
            product_query = product_query.filter(LocationModel.slug.ilike(f"%{location}%"))
        if category:
            product_query = product_query.filter(CategoryModel.slug.ilike(f"%{category}%"))

        if page and per_page:
            pagination = product_query.paginate(page=page, per_page=per_page, error_out=False)
            products = pagination.items
            total_products = product_query.count()
            total_pages = ceil(total_products / per_page)
        else:
            products = product_query.all()

        # Create a dictionary to store products and their image URLs
        product_dict = {}

        for product, seller_name, seller_slug, category_name in products:
            # Retrieve all images for this product
            images = ProductImageModel.query.filter_by(product_id=product.id).all()
            image_urls = [image.image_url for image in images]

            if product.id not in product_dict:
                product_dict[product.id] = {
                    **{column.name: getattr(product, column.name) for column in ProductModel.__table__.columns},
                    "seller_name": seller_name,
                    "seller_slug": seller_slug,
                    "category_name": category_name,
                    "image_urls": image_urls,
                }

        # Convert the dictionary to a list of products
        products_list = list(product_dict.values())

        if page and per_page:
            response = {
                "data": products_list,
                "pagination": {
                    "total_products": total_products,
                    "current_page": page,
                    "total_pages": total_pages,
                    "next_page": page + 1 if page < total_pages else None,
                    "prev_page": page - 1 if page > 1 else None,
                },
            }
        else:
            response = {"data": products_list}

        return ResponseHandler.success(data=response, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occurred while showing products",
            data=str(e),
            status=500,
        )


@product_blueprint.get("/product/<slug>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def show_product_by_slug(slug):
    user_id = get_jwt_identity()
    try:
        product_result = (
            ProductModel.query.join(SellerModel, ProductModel.seller_id == SellerModel.id)
            .join(CategoryModel, ProductModel.category_id == CategoryModel.id)
            .join(LocationModel, SellerModel.location_id == LocationModel.id)
            .outerjoin(
                ProductImageModel, ProductModel.id == ProductImageModel.product_id
            )  # Left join, to show all products even tho the product doesn't have image_url
            .add_columns(
                SellerModel.name,
                SellerModel.slug,
                CategoryModel.name,
                CategoryModel.slug,
                LocationModel.city,
                ProductImageModel.image_url,
            )
            .filter(ProductModel.slug == slug)
            .all()
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
            _,
        ) = product_result[0]

        # Extract all image URLs
        image_urls = [image_url for _, _, _, _, _, _, image_url in product_result if image_url]

        product_detail = {
            # Gets all column objects on the table and iterates each column name
            **{column.name: getattr(product, column.name) for column in ProductModel.__table__.columns},
            "seller_name": seller_name,
            "category_name": category_name,
            "seller_slug": seller_slug,
            "category_slug": category_slug,
            "location_city": location_city,
            "image_urls": image_urls,  # Return a list of image URLs
        }

        # Check if the product is in the current user's cart
        cart_item = CartModel.query.filter_by(user_id=user_id, product_id=product.id).first()

        # If the product is in the cart, add cart details to the response
        if cart_item:
            product_detail["cart"] = {
                "cart_id": cart_item.id,
                "quantity": cart_item.quantity,
            }

        return ResponseHandler.success(data=product_detail, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occurred while fetching product details",
            data=str(e),
            status=500,
        )


@product_blueprint.delete("/product/<int:product_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
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

        product = s.query(ProductModel).filter_by(id=product_id, seller_id=seller.id).first()
        if not product:
            return ResponseHandler.error(message="Product not found", status=404)

        s.delete(product)
        s.commit()

        return ResponseHandler.success(message="Product deleted successfully", status=200)

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while deleting the product",
            data=str(e),
            status=500,
        )

    finally:
        s.close()

@product_blueprint.delete("/product/<int:product_id>/<int:image_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def delete_product_image(product_id, image_id):
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

        product = s.query(ProductModel).filter_by(id=product_id, seller_id=seller.id).first()
        if not product:
            return ResponseHandler.error(
                message="Product not found or the Product belongs to other seller",
                status=404,
            )

        # Get the product image
        product_image = s.query(ProductImageModel).filter_by(id=image_id, product_id=product_id).first()
        if not product_image:
            return ResponseHandler.error(
                message="Product image not found or the image belongs to other product",
                status=404,
            )

        # Delete the image from Cloudinary
        public_id = os.path.splitext(os.path.basename(product_image.image_url))[0]
        cloudinary.uploader.destroy(public_id)

        # Delete the image record from the database
        s.delete(product_image)
        s.commit()

        return ResponseHandler.success(message="Product image deleted successfully")

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(message=str(e), status=500)

    finally:
        s.close()

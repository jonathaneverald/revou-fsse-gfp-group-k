from flask import Blueprint, request
from flask_cors import cross_origin
from connector.mysql_connector import connection
from models.cart import CartModel
from models.products import ProductModel
from models.users import UserModel
from models.sellers import SellerModel
from models.category import CategoryModel
from sqlalchemy.orm import sessionmaker
from flask_jwt_extended import jwt_required, get_jwt_identity
from cerberus import Validator
from schemas.cart_schema import add_cart_schema, update_cart_schema
from utils.handle_response import ResponseHandler

cart_blueprint = Blueprint("cart_blueprint", __name__)


@cart_blueprint.post("/cart")
@cross_origin(origin='localhost', headers=['Content-Type','Authorization'])
@jwt_required()
def add_cart():
    user_id = get_jwt_identity()
    Session = sessionmaker(bind=connection)
    s = Session()
    s.begin()

    try:
        current_user = s.query(UserModel).filter_by(id=user_id).first()
        if not current_user:
            return ResponseHandler.error(message="User not found", status=404)

        data = request.get_json()  # Get input data
        validator = Validator(add_cart_schema)
        if not validator.validate(data):
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        product = s.query(ProductModel).filter_by(slug=data["product_slug"]).first()
        if not product:
            return ResponseHandler.error(message="Product not found", status=404)

        seller = s.query(SellerModel).filter_by(id=product.seller_id).first()
        if not seller:
            return ResponseHandler.error(message="Seller not found", status=404)

        category = s.query(CategoryModel).filter_by(id=product.category_id).first()
        if not category:
            return ResponseHandler.error(message="Category not found", status=404)

        existing_cart_item = (
            s.query(CartModel).filter_by(user_id=user_id, product_id=product.id).first()
        )
        if existing_cart_item:
            return ResponseHandler.error(message="Product already in cart", status=400)

        new_cart = CartModel(
            product_id=product.id,
            user_id=user_id,
            quantity=data["quantity"],
        )

        s.add(new_cart)
        s.commit()

        cart_info = {
            "id": new_cart.id,
            "user_id": user_id,
            "seller_name": seller.name,
            "product_name": product.name,
            "category_name": category.name,
            "price": product.price,
            "quantity": new_cart.quantity,
            "description": product.description,
            "type": product.type,
        }

        return ResponseHandler.success(data=cart_info, status=201)

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while adding the cart",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@cart_blueprint.put("/cart/<int:cart_id>")
@cross_origin(origin='localhost', headers=['Content-Type','Authorization'])
@jwt_required()
def update_cart(cart_id):
    user_id = get_jwt_identity()
    Session = sessionmaker(connection)
    s = Session()
    s.begin()

    try:
        current_user = s.query(UserModel).filter_by(id=user_id).first()
        if not current_user:
            return ResponseHandler.error(message="User not found", status=404)

        # Retrieve the cart item and ensure it belongs to the current user
        cart_item = s.query(CartModel).filter_by(id=cart_id, user_id=user_id).first()
        if not cart_item:
            return ResponseHandler.error(
                message="Cart item not found or does not belong to the user", status=404
            )
        product = s.query(ProductModel).filter_by(id=cart_item.product_id).first()
        seller = s.query(SellerModel).filter_by(id=product.seller_id).first()
        category = s.query(CategoryModel).filter_by(id=product.category_id).first()

        data = request.get_json()  # Get input data
        validator = Validator(update_cart_schema)
        if not validator.validate(data):
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        updated_quantity = data["quantity"]
        cart_item.quantity = updated_quantity
        s.commit()

        updated_cart_info = {
            "id": cart_item.id,
            "user_id": user_id,
            "seller_name": seller.name,
            "product_name": product.name,
            "category_name": category.name,
            "price": product.price,
            "quantity": cart_item.quantity,
            "description": product.description,
            "type": product.type,
        }

        return ResponseHandler.success(data=updated_cart_info, status=201)

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while updating the cart",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@cart_blueprint.get("/cart")
@jwt_required()
def show_all_cart():
    try:
        user_id = get_jwt_identity()
        carts = (
            CartModel.query.filter_by(user_id=user_id)
            .join(ProductModel, CartModel.product_id == ProductModel.id)
            .join(SellerModel, ProductModel.seller_id == SellerModel.id)
            .join(CategoryModel, ProductModel.category_id == CategoryModel.id)
            .add_columns(
                SellerModel.name,
                CategoryModel.name,
                ProductModel.name,
                ProductModel.price,
                ProductModel.description,
                ProductModel.type,
            )
            .all()
        )

        if not carts:
            return ResponseHandler.error(message="Cart is still empty!", status=404)

        carts_list = [
            {
                "id": cart.id,
                "product_id": cart.product_id,
                "user_id": cart.user_id,
                "seller_name": seller_name,
                "product_name": product_name,
                "category_name": category_name,
                "price": product_price,
                "quantity": cart.quantity,
                "description": product_description,
                "type": product_type,
            }
            for cart, seller_name, category_name, product_name, product_price, product_type, product_description in carts
        ]

        return ResponseHandler.success(data=carts_list, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occurred while showing carts",
            data=str(e),
            status=500,
        )


@cart_blueprint.delete("/cart/<int:cart_id>")
@jwt_required()
def delete_cart(cart_id):
    user_id = get_jwt_identity()
    Session = sessionmaker(connection)
    s = Session()
    s.begin()

    try:
        current_user = s.query(UserModel).filter_by(id=user_id).first()
        if not current_user:
            return ResponseHandler.error(message="User not found", status=404)

        # Retrieve the cart item and ensure it belongs to the current user
        cart_item = s.query(CartModel).filter_by(id=cart_id, user_id=user_id).first()
        if not cart_item:
            return ResponseHandler.error(
                message="Cart item not found or does not belong to the user", status=404
            )

        s.delete(cart_item)
        s.commit()

        return ResponseHandler.success(message="Cart deleted successfully", status=200)

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while deleting the cart",
            data=str(e),
            status=500,
        )

    finally:
        s.close()

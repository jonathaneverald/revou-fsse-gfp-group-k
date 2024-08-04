from flask import Blueprint, request
from connector.mysql_connector import connection
from models.sellers import SellerModel
from models.users import UserModel
from models.locations import LocationModel
from sqlalchemy.orm import sessionmaker
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_login import current_user
from cerberus import Validator
from schemas.seller_schema import add_seller_schema, update_seller_schema
from utils.handle_response import ResponseHandler
from slugify import slugify

seller_blueprint = Blueprint("seller_blueprint", __name__)


@seller_blueprint.post("/seller")
@jwt_required()
def add_seller():
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

        # Check if the user already has a seller account
        existing_seller = s.query(SellerModel).filter_by(user_id=user_id).first()
        if existing_seller:
            return ResponseHandler.error(
                message="User already has a seller account", status=400
            )

        data = request.get_json()  # Get input data
        validator = Validator(add_seller_schema)
        if not validator.validate(data):
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        # Check if inputted location is exists in database
        location = s.query(LocationModel).filter_by(city=data["city_location"]).first()
        if not location:
            return ResponseHandler.error(message="Location not found", status=404)

        slug = SellerModel.generate_slug(data["name"])

        new_seller = SellerModel(
            user_id=user_id, location_id=location.id, slug=slug, name=data["name"]
        )
        s.add(new_seller)
        s.commit()

        data = {
            "id": new_seller.id,
            "user_id": new_seller.user_id,
            "location_id": location.id,
            "city": location.city,
            "slug": new_seller.slug,
            "name": new_seller.name,
        }

        return ResponseHandler.success(message="Seller added successfully", data=data)

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while adding the seller",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


# Profile seller for user's role seller
@seller_blueprint.get("/seller-profile/<slug>")
@jwt_required()
def seller_profile(slug):
    user_id = get_jwt_identity()
    Session = sessionmaker(connection)
    s = Session()

    try:
        current_user = s.query(UserModel).filter_by(id=user_id).first()
        if not current_user:
            return ResponseHandler.error(message="User not found", status=404)

        # Check if the current user's role is "seller"
        if current_user.role != "seller":
            return ResponseHandler.error(message="Unauthorized access", status=403)

        # Fetch the seller using the slug
        seller = s.query(SellerModel).filter_by(slug=slug).first()
        if not seller:
            return ResponseHandler.error(message="Seller not found", status=404)

        # Ensure the current user is the owner of the seller profile
        if seller.user_id != user_id:
            return ResponseHandler.error(message="Unauthorized access", status=403)

        # Fetch the city location
        location = s.query(LocationModel).filter_by(id=seller.location_id).first()

        data = {
            "id": seller.id,
            "user_id": seller.user_id,
            "location_id": location.id,
            "slug": seller.slug,
            "name": seller.name,
        }

        return ResponseHandler.success(
            message="Seller profile fetched successfully", data=data
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while fetching the seller profile",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@seller_blueprint.put("/seller-profile/<int:seller_id>")
@jwt_required()
def update_seller_profile(seller_id):
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

        # Fetch the seller using the slug
        seller = s.query(SellerModel).filter_by(id=seller_id, user_id=user_id).first()
        if not seller:
            return ResponseHandler.error(message="Seller not found", status=404)

        data = request.get_json()  # Get input data
        validator = Validator(update_seller_schema)
        if not validator.validate(data):
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        # Update location if provided
        if "city_location" in data:
            location = (
                s.query(LocationModel).filter_by(city=data["city_location"]).first()
            )
            if not location:
                return ResponseHandler.error(message="Location not found", status=404)
            seller.location_id = location.id
        else:
            # Fetch the current location if not updating the city_location
            location = s.query(LocationModel).filter_by(id=seller.location_id).first()

        # Update name and slug if provided
        if "name" in data:
            name = data["name"]
            slug_base = slugify(name)

            # Preserve the numeric part of the slug
            numeric_part = seller.slug.split("-")[-1]
            new_slug = f"{slug_base}-{numeric_part}"

            seller.name = name
            seller.slug = new_slug
        else:
            seller = s.query(SellerModel).filter_by(name=seller.name).first()

        s.commit()

        updated_profile_data = {
            "id": seller.id,
            "user_id": seller.user_id,
            "location_id": seller.location_id,
            "slug": seller.slug,
            "name": seller.name,
            "city": location.city,
        }

        return ResponseHandler.success(
            message="Seller profile updated successfully", data=updated_profile_data
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while updating the seller profile",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


# Show all seller for users
@seller_blueprint.get("/seller")
@jwt_required()
def show_seller():
    Session = sessionmaker(connection)
    s = Session()

    try:
        sellers = (
            s.query(SellerModel, LocationModel.city)
            .join(LocationModel, SellerModel.location_id == LocationModel.id)
            .all()
        )

        sellers_list = [
            {
                "id": seller.id,
                "user_id": seller.user_id,
                "location_id": seller.location_id,
                "slug": seller.slug,
                "name": seller.name,
                "city": city,
            }
            for seller, city in sellers
        ]

        return ResponseHandler.success(data=sellers_list, status=200)

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while showing sellers",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


# Show seller detail for users
@seller_blueprint.get("/seller/<slug>")
@jwt_required()
def show_seller_detail(slug):
    Session = sessionmaker(connection)
    s = Session()

    try:
        seller_result = (
            s.query(SellerModel, LocationModel.city)
            .join(LocationModel, SellerModel.location_id == LocationModel.id)
            .filter(SellerModel.slug == slug)
            .first()
        )

        if not seller_result:
            return ResponseHandler.error(message="Seller not found", status=404)

        seller, city = seller_result

        seller_detail = {
            "id": seller.id,
            "user_id": seller.user_id,
            "location_id": seller.location_id,
            "slug": seller.slug,
            "name": seller.name,
            "city": city,
        }

        return ResponseHandler.success(data=seller_detail, status=200)

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while fetching seller details",
            data=str(e),
            status=500,
        )

    finally:
        s.close()

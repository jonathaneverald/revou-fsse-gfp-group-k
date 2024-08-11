from flask import Blueprint, request
from connector.mysql_connector import connection
from models.voucher import VoucherModel
from models.users import UserModel
from models.sellers import SellerModel
from sqlalchemy.orm import sessionmaker
from flask_jwt_extended import jwt_required, get_jwt_identity
from cerberus import Validator
from schemas.voucher_schema import add_voucher_schema, update_voucher_schema
from utils.handle_response import ResponseHandler

voucher_blueprint = Blueprint("voucher_blueprint", __name__)


@voucher_blueprint.post("/voucher")
@jwt_required()
def add_voucher():
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
        validator = Validator(add_voucher_schema)
        if not validator.validate(data):
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        new_voucher = VoucherModel(
            user_id=user_id,
            seller_id=seller.id,
            name=data["name"],
            discount=data["discount"],
        )

        s.add(new_voucher)
        s.commit()

        voucher_info = (
            s.query(VoucherModel, SellerModel.name)
            .join(SellerModel, VoucherModel.seller_id == SellerModel.id)
            .filter(VoucherModel.id == new_voucher.id)
            .first()
        )

        if voucher_info:
            voucher, seller_name = voucher_info
            voucher_dict = voucher.to_dictionaries()
            voucher_dict["seller_name"] = seller_name
            return ResponseHandler.success(data=voucher_dict, status=201)

        return ResponseHandler.error(
            message="Error retrieving product info", status=500
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while adding the voucher",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@voucher_blueprint.put("/voucher/<int:voucher_id>")
@jwt_required()
def update_voucher(voucher_id):
    user_id = get_jwt_identity()
    Session = sessionmaker(connection)
    s = Session()
    s.begin()

    try:
        seller = s.query(SellerModel).filter_by(user_id=user_id).first()
        if not seller:
            return ResponseHandler.error(
                message="Unauthorized: Only sellers can update vouchers.",
                status=403,
            )

        voucher = (
            s.query(VoucherModel).filter_by(id=voucher_id, seller_id=seller.id).first()
        )

        if not voucher:
            return ResponseHandler.error(
                message="Voucher not found or the voucher belongs to another seller.",
                status=404,
            )

        data = request.get_json()  # Get input data
        validator = Validator(update_voucher_schema)
        if not validator.validate(data):
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        if "name" in data:
            voucher.name = data["name"]

        if "discount" in data:
            voucher.discount = data["discount"]

        s.commit()

        voucher_info = (
            s.query(VoucherModel, SellerModel.name)
            .join(SellerModel, VoucherModel.seller_id == SellerModel.id)
            .filter(VoucherModel.id == voucher.id)
            .first()
        )

        if voucher_info:
            voucher, seller_name = voucher_info
            voucher_dict = voucher.to_dictionaries()
            voucher_dict["seller_name"] = seller_name

            return ResponseHandler.success(data=voucher_dict, status=201)

        return ResponseHandler.error(
            message="Error retrieving voucher info", status=500
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while updating the voucher",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@voucher_blueprint.get("/voucher")
@jwt_required()
def show_all_voucher():
    user_id = get_jwt_identity()

    # Ensure the logged-in user is a seller
    seller = SellerModel.query.filter_by(user_id=user_id).first()
    if not seller:
        return ResponseHandler.error(
            message="Unauthorized: Only sellers can view vouchers.",
            status=403,
        )

    try:
        vouchers = (
            VoucherModel.query.join(
                SellerModel, VoucherModel.seller_id == SellerModel.id
            )
            .add_columns(SellerModel.name)
            .filter(VoucherModel.user_id == user_id)
        )
        vouchers_list = [
            {
                # Gets all column objects on the table and iterates each column name
                **{
                    column.name: getattr(voucher, column.name)
                    for column in VoucherModel.__table__.columns
                },
                "seller_name": seller_name,
            }
            for voucher, seller_name in vouchers
        ]

        return ResponseHandler.success(data=vouchers_list, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occurred while showing vouchers",
            data=str(e),
            status=500,
        )


@voucher_blueprint.get("/voucher/<int:voucher_id>")
@jwt_required()
def show_voucher_detail(voucher_id):
    user_id = get_jwt_identity()

    try:
        # Check if the current user's role is "seller"
        seller = SellerModel.query.filter_by(user_id=user_id).first()
        if not seller:
            return ResponseHandler.error(
                message="Unauthorized: Only sellers can view vouchers.",
                status=403,
            )

        # Query the voucher and join with the SellerModel to get the seller's name
        voucher = (
            VoucherModel.query.filter_by(id=voucher_id, seller_id=seller.id)
            .join(SellerModel, VoucherModel.seller_id == SellerModel.id)
            .add_columns(SellerModel.name)
            .first()
        )
        if not voucher:
            return ResponseHandler.error(
                message="Voucher not found or the voucher belongs to another seller.",
                status=404,
            )

        voucher_data, seller_name = voucher

        # Prepare the voucher details along with the seller's name
        voucher_details = {
            column.name: getattr(voucher_data, column.name)
            for column in VoucherModel.__table__.columns
        }
        voucher_details["seller_name"] = seller_name

        return ResponseHandler.success(data=voucher_details, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occurred while showing voucher",
            data=str(e),
            status=500,
        )


@voucher_blueprint.delete("/voucher/<int:voucher_id>")
@jwt_required()
def delete_voucher(voucher_id):
    user_id = get_jwt_identity()
    Session = sessionmaker(connection)
    s = Session()
    s.begin()

    try:
        seller = s.query(SellerModel).filter_by(user_id=user_id).first()
        if not seller:
            return ResponseHandler.error(
                message="Unauthorized: Only sellers can delete vouchers.",
                status=403,
            )

        voucher = (
            s.query(VoucherModel).filter_by(id=voucher_id, seller_id=seller.id).first()
        )

        if not voucher:
            return ResponseHandler.error(
                message="Voucher not found or the voucher belongs to another seller.",
                status=404,
            )

        s.delete(voucher)
        s.commit()

        return ResponseHandler.success(
            message="Voucher deleted successfully", status=200
        )

    except Exception as e:
        return ResponseHandler.error(
            message="An error occurred while deleting the voucher",
            data=str(e),
            status=500,
        )

    finally:
        s.close()

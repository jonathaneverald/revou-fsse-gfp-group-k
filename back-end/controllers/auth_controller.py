from flask import Blueprint, request
from flask_cors import cross_origin
from connector.mysql_connector import connection
from models.users import UserModel
from sqlalchemy.orm import sessionmaker
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)
from flask_login import logout_user, login_user, current_user
from cerberus import Validator
from schemas.user_schema import login_schema, register_schema, update_profile_schema
from utils.handle_response import ResponseHandler
import logging

auth_blueprint = Blueprint("auth_blueprint", __name__)
revoked_tokens = set()


@auth_blueprint.post("/register")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
def register():
    Session = sessionmaker(bind=connection)
    s = Session()
    s.begin()

    try:
        data = request.get_json()  # Get input data
        validator = Validator(register_schema)

        # Check data is valid or invalid
        if not validator.validate(data):
            logging.error("Validation error: %s", validator.errors)
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        email = data.get("email")
        password = data.get("password")
        name = data.get("name")
        role = "customer"
        address = data.get("address")
        phone_number = data.get("phone_number")

        # Check if the email already exists
        existing_email = s.query(UserModel).filter((UserModel.email == email)).first()
        if existing_email:
            return ResponseHandler.error(message="Email already exists", status=409)

        existing_phone_number = (
            s.query(UserModel).filter((UserModel.phone_number == phone_number)).first()
        )
        if existing_phone_number:
            return ResponseHandler.error(
                message="Phone Number already exists", status=409
            )

        # Create new user
        new_user = UserModel(
            email=email,
            name=name,
            role=role,
            address=address,
            phone_number=phone_number,
        )
        new_user.set_password(password)

        s.add(new_user)
        s.commit()

        return ResponseHandler.success(data=new_user.to_dictionaries(), status=201)

    except Exception as e:
        s.rollback()
        logging.error("Exception occurred: %s", str(e))
        return ResponseHandler.error(
            message="An error occurred while registering new account",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@auth_blueprint.post("/login")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
def login():
    Session = sessionmaker(connection)
    s = Session()
    s.begin()

    try:
        data = request.get_json()  # Get input data
        validator = Validator(login_schema)

        # Check data is valid or invalid
        if not validator.validate(data):
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        email = data.get("email")
        password = data.get("password")

        user = s.query(UserModel).filter(UserModel.email == email).first()

        # Checking if the user is available on database and check the password
        if user == None:
            return ResponseHandler.error(message="User not found!", status=403)
        if not user.check_password(password):
            return ResponseHandler.error(message="Invalid password!", status=403)

        login_user(user)
        access_token = create_access_token(identity=user.id)

        return ResponseHandler.success(
            data={"message": "Login success!", "access_token": access_token},
            status=200,
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="Login failed!",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@auth_blueprint.get("/profile")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    Session = sessionmaker(connection)
    s = Session()

    try:
        user = s.query(UserModel).filter(UserModel.id == user_id).first()
        if user == None:
            return ResponseHandler.error(message="User not found!", status=404)

        return ResponseHandler.success(
            data={
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "address": user.address,
                "phone_number": user.phone_number,
            },
            status=200,
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="Show Profile Failed!",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@auth_blueprint.put("/profile")
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    Session = sessionmaker(connection)
    s = Session()
    s.begin()

    try:
        data = request.get_json()  # Get input data
        validator = Validator(update_profile_schema)

        # Check data is valid or invalid
        if not validator.validate(data):
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        user = s.query(UserModel).filter(UserModel.id == user_id).first()

        # Checking if the user is available on database
        if user == None:
            return ResponseHandler.error(message="User not found!", status=403)

        email = data.get("email")
        password = data.get("password")
        name = data.get("name")
        address = data.get("address")
        phone_number = data.get("phone_number")

        # Check if the email already exists
        existing_email = s.query(UserModel).filter((UserModel.email == email)).first()
        if existing_email:
            return ResponseHandler.error(message="Email already exists", status=409)

        existing_phone_number = (
            s.query(UserModel).filter((UserModel.phone_number == phone_number)).first()
        )
        if existing_phone_number:
            return ResponseHandler.error(
                message="Phone Number already exists", status=409
            )

        user.email = email
        user.set_password(password)
        user.name = name
        user.address = address
        user.phone_number = phone_number
        s.commit()

        return ResponseHandler.success(data=user.to_dictionaries(), status=201)

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while updating the profile",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@auth_blueprint.get("/logout")
@jwt_required()
def logout():
    jti = get_jwt()["jti"]  # Get the unique identifier of the token
    revoked_tokens.add(jti)  # Add the token's jti to the revoked tokens set
    user_info = {"id": current_user.id, "email": current_user.email}
    logout_user()
    return ResponseHandler.success(
        data={"message": "Logout success!", "user": user_info}, status=200
    )


# @auth_blueprint.get("/verify-token")
# @jwt_required
# def verify_token():
#     Session = sessionmaker(connection)
#     s = Session()
#     s.begin()
#     try:
#         current_user_id = get_jwt_identity()
#         user = s.query(UserModel).filter(UserModel.id == current_user_id).first()
#         if user:
#             return ResponseHandler.success(
#                 data={"user_id": user.id, "email": user.email}, status=200
#             )
#         else:
#             return ResponseHandler.error(message="User not found", status=404)

#     except Exception as e:
#         s.rollback()
#         return ResponseHandler.error(message=f"Error: {str(e)}", status=500)

#     finally:
#         s.close()

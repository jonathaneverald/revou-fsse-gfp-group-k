from flask import Blueprint, request
from flask_cors import cross_origin
from connector.mysql_connector import connection
from models.locations import LocationModel
from sqlalchemy.orm import sessionmaker
from schemas.location_schema import add_location_schema
from cerberus import Validator
from utils.handle_response import ResponseHandler


location_blueprint = Blueprint("location_blueprint", __name__)


@location_blueprint.post("/location")
def add_location():
    Session = sessionmaker(bind=connection)
    s = Session()
    s.begin()

    try:
        data = request.get_json()
        validator = Validator(add_location_schema)

        if not validator.validate(data):
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        city = data.get("city")
        slug = LocationModel.generate_slug(city)

        new_location = LocationModel(slug=slug, city=city)

        s.add(new_location)
        s.commit()

        return ResponseHandler.success(
            message="Location added successfully",
            data=new_location.to_dictionaries(),
            status=201,
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while adding the location",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@location_blueprint.get("/location")
def show_all_location():
    try:
        locations = (LocationModel).query.all()
        locations_list = [location.to_dictionaries() for location in locations]
        return ResponseHandler.success(data=locations_list, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occurred while showing locations",
            data=str(e),
            status=500,
        )


@location_blueprint.get("/location/<slug>")
def show_location_by_slug(slug):
    Session = sessionmaker(connection)
    s = Session()

    try:
        location = s.query(LocationModel).filter_by(slug=slug).first()

        if not location:
            return ResponseHandler.error(
                message="Location not found", data=None, status=404
            )

        return ResponseHandler.success(
            message="Location retrieved successfully",
            data=location.to_dictionaries(),
            status=200,
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while showing location",
            data=str(e),
            status=500,
        )

    finally:
        s.close()

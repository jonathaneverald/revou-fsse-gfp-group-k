add_seller_schema = {
    "name": {
        "type": "string",
        "required": True,
    },
    "city_location": {
        "type": "string",
        "required": True,
    },
}

update_seller_schema = {
    "name": {
        "type": "string",
        "required": False,
    },
    "city_location": {
        "type": "string",
        "required": False,
    },
}

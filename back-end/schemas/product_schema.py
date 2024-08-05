add_product_schema = {
    "name": {
        "type": "string",
        "maxlength": 255,
        "required": True,
    },
    "category_name": {
        "type": "string",
        "maxlength": 255,
        "required": True,
    },
    "price": {
        "type": "float",
        "required": True,
    },
    "quantity": {
        "type": "integer",
        "required": True,
    },
    "description": {
        "type": "string",
        "maxlength": 255,
        "required": True,
    },
    "type": {
        "type": "string",
        "allowed": ["Standard", "Premium"],
        "required": True,
    },
}

update_product_schema = {
    "name": {
        "type": "string",
        "maxlength": 255,
        "required": False,
    },
    "category_name": {
        "type": "string",
        "maxlength": 255,
        "required": False,
    },
    "price": {
        "type": "float",
        "required": False,
    },
    "quantity": {
        "type": "integer",
        "required": False,
    },
    "description": {
        "type": "string",
        "maxlength": 255,
        "required": False,
    },
    "type": {
        "type": "string",
        "allowed": ["Standard", "Premium"],
        "required": False,
    },
}

add_cart_schema = {
    "product_name": {
        "type": "string",
        "maxlength": 255,
        "required": True,
    },
    "quantity": {
        "type": "integer",
        "min": 1,
        "required": True,
    },
}

update_cart_schema = {
    "quantity": {
        "type": "integer",
        "min": 1,
        "required": True,
    },
}

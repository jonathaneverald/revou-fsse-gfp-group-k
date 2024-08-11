add_voucher_schema = {
    "name": {
        "type": "string",
        "maxlength": 255,
        "required": True,
    },
    "discount": {
        "type": "float",
        "required": True,
    },
}

update_voucher_schema = {
    "name": {
        "type": "string",
        "maxlength": 255,
        "required": False,
    },
    "discount": {
        "type": "float",
        "required": False,
    },
}

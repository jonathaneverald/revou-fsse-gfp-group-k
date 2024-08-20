login_schema = {
    "email": {
        "type": "string",
        "regex": r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)",
        "required": True,
    },
    "password": {"type": "string", "minlength": 8, "maxlength": 255, "required": True},
}

register_schema = {
    "name": {"type": "string", "maxlength": 255, "required": True},
    "email": {
        "type": "string",
        "regex": r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)",
        "maxlength": 255,
        "required": True,
    },
    "password": {"type": "string", "minlength": 8, "maxlength": 255, "required": True},
    # "role": {
    #     "type": "string",
    #     "allowed": ["seller", "customer"],
    #     "required": True,
    # },
    "address": {"type": "string", "maxlength": 255, "required": True},
    "phone_number": {"type": "string", "maxlength": 16, "required": True},
}

update_profile_schema = {
    "name": {"type": "string", "maxlength": 255},
    "email": {
        "type": "string",
        "regex": r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)",
        "maxlength": 255,
    },
    "password": {"type": "string", "minlength": 8, "maxlength": 255},
    "address": {"type": "string", "maxlength": 255},
    "phone_number": {"type": "string", "maxlength": 16},
}

add_transaction_schema = {"voucher_id": {"type": "integer", "required": False}}

update_transaction_schema = {
    "status": {
        "type": "string",
        "allowed": ["Transaction Success", "Cancel", "Payment Success"],
        "required": True,
    }
}

from flask import Blueprint, request
from flask_cors import cross_origin
from connector.mysql_connector import connection
from sqlalchemy.orm import sessionmaker
from flask_jwt_extended import jwt_required, get_jwt_identity
from cerberus import Validator
from utils.handle_response import ResponseHandler
from models.transaction import TransactionModel
from models.transaction_detail import TransactionDetailModel
from models.transaction_voucher import TransactionVoucherModel
from models.users import UserModel
from models.cart import CartModel
from models.products import ProductModel
from models.sellers import SellerModel
from models.voucher import VoucherModel
from schemas.transaction_schema import add_transaction_schema, update_transaction_schema


transaction_blueprint = Blueprint("transaction_blueprint", __name__)


@transaction_blueprint.post("/transaction")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def add_transaction():
    user_id = get_jwt_identity()
    Session = sessionmaker(bind=connection)
    s = Session()
    s.begin()

    try:
        current_user = s.query(UserModel).filter_by(id=user_id).first()
        if not current_user:
            return ResponseHandler.error(message="User not found", status=404)

        # Retrieve current user's cart items
        cart_items = s.query(CartModel).filter_by(user_id=user_id).all()
        if not cart_items:
            return ResponseHandler.error(message="No items in the cart", status=400)

        # Group cart items by seller_id
        cart_items_by_seller = {}
        for item in cart_items:
            product = s.query(ProductModel).filter_by(id=item.product_id).first()
            if not product:
                return ResponseHandler.error(
                    message=f"Product with ID {item.product_id} is not found",
                    status=404,
                )
            seller_id = product.seller_id
            if seller_id not in cart_items_by_seller:
                cart_items_by_seller[seller_id] = []
            cart_items_by_seller[seller_id].append(item)

        # Check if a voucher is applied in transaction
        data = request.get_json()
        validator = Validator(add_transaction_schema)
        if not validator.validate(data):
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        transaction_info = []

        for seller_id, items in cart_items_by_seller.items():
            # Calculate total price for transaction
            total_price = 0
            for item in items:
                product = s.query(ProductModel).filter_by(id=item.product_id).first()
                total_price += item.quantity * product.price

            # Handle voucher for this seller
            voucher = None
            discount = 0

            if "voucher_id" in data:
                voucher = (
                    s.query(VoucherModel)
                    .filter(
                        VoucherModel.id == data["voucher_id"],
                        VoucherModel.seller_id == seller_id,
                    )
                    .first()
                )
                if voucher:
                    discount = voucher.discount
                    total_price -= discount

                    # Validate if total price is less than 0 after discount
                    if total_price < 0:
                        total_price = 0

            # Create the transaction for the current seller
            new_transaction = TransactionModel(
                user_id=user_id,
                seller_id=seller_id,
                total_price=total_price,
                status="pending",
            )
            new_transaction.generate_invoice()  # Generate invoice
            s.add(new_transaction)
            s.flush()  # Populate the new_transaction.id with the auto-incremented value

            # If a voucher is applied, create a new row in the TransactionVouchers table
            if voucher:
                new_transaction_voucher = TransactionVoucherModel(
                    transaction_id=new_transaction.id,
                    voucher_id=voucher.id,
                    amount=discount,
                )
                s.add(new_transaction_voucher)

            # Create transaction details for all products in current user's cart for this seller
            transaction_details = []
            for item in items:
                product = s.query(ProductModel).filter_by(id=item.product_id).first()
                transaction_detail = TransactionDetailModel(
                    transaction_id=new_transaction.id,
                    product_id=product.id,
                    price=product.price,
                    quantity=item.quantity,
                )
                s.add(transaction_detail)

                transaction_details.append(
                    {
                        "product_name": product.name,
                        "price": product.price,
                        "quantity": item.quantity,
                    }
                )

            # Prepare transaction info for response
            transaction_info.append(
                {
                    "transaction_id": new_transaction.id,
                    "seller_id": seller_id,
                    "total_price": new_transaction.total_price,
                    "status": new_transaction.status,
                    "voucher_applied": voucher.name if voucher else None,
                    "discount": discount,
                    "transaction_details": transaction_details,
                    "invoice": new_transaction.invoice,  # Include invoice in the response
                }
            )

        # Commit the transaction
        s.commit()

        # Clear the current user's cart after transaction (checkout)
        s.query(CartModel).filter_by(user_id=user_id).delete()
        s.commit()

        return ResponseHandler.success(data=transaction_info, status=201)

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while adding the transaction",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@transaction_blueprint.put("/transaction/<int:transaction_id>")
@jwt_required()
def update_transaction(transaction_id):
    user_id = get_jwt_identity()
    Session = sessionmaker(connection)
    s = Session()
    s.begin()

    try:
        # Fetch the user and transaction
        current_user = s.query(UserModel).filter_by(id=user_id).first()
        if not current_user:
            return ResponseHandler.error(message="User not found", status=404)

        transaction = s.query(TransactionModel).filter_by(id=transaction_id).first()
        if not transaction:
            return ResponseHandler.error(message="Transaction not found", status=404)

        # Fetch the JSON data from the request
        data = request.get_json()
        validator = Validator(update_transaction_schema)
        if not validator.validate(data):
            # Customizing error message for unallowed values
            errors = validator.errors
            for field, error_list in errors.items():
                for error in error_list:
                    if "unallowed value" in error:
                        allowed_values = update_transaction_schema[field].get(
                            "allowed", []
                        )
                        return ResponseHandler.error(
                            message=f"Data Invalid! The '{field}' field can only be one of the following: {', '.join(allowed_values)}",
                            data=validator.errors,
                            status=400,
                        )
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        new_status = data.get("status")

        # Define allowed status transitions
        allowed_customer_status = ["Transaction Success"]
        allowed_seller_status = ["Cancel", "Payment Success"]

        if current_user.role == "customer":
            # Ensure the transaction belongs to the current customer
            if transaction.user_id != user_id:
                return ResponseHandler.error(
                    message="Unauthorized: You can only update your own transactions",
                    status=403,
                )

            # Customer is only allowed to update status to "Transaction Success"
            if new_status not in allowed_customer_status:
                return ResponseHandler.error(
                    message="Customers can only update the status to 'Transaction Success'",
                    status=403,
                )

            if transaction.status != "Payment Success":
                return ResponseHandler.error(
                    message="Cannot update the status to 'Transaction Success' unless the status is 'Payment Success'",
                    status=400,
                )

            # Update transaction status
            transaction.status = new_status

        else:
            # Ensure the transaction belongs to the current seller
            seller = s.query(SellerModel).filter_by(user_id=user_id).first()
            if not seller or transaction.seller_id != seller.id:
                return ResponseHandler.error(
                    message="Unauthorized: You can only update your own transactions",
                    status=403,
                )

            # Seller is allowed to update status to "Cancel" or "Payment Success"
            if new_status not in allowed_seller_status:
                return ResponseHandler.error(
                    message="Sellers can only update the status to 'Cancel' or 'Payment Success'",
                    status=403,
                )

            # Update transaction status
            transaction.status = new_status

            if new_status == "Payment Success":
                # Decrease the quantity of each product in the transaction
                transaction_details = (
                    s.query(TransactionDetailModel)
                    .filter_by(transaction_id=transaction.id)
                    .all()
                )

                for detail in transaction_details:
                    product = (
                        s.query(ProductModel).filter_by(id=detail.product_id).first()
                    )
                    if product.quantity < detail.quantity:
                        return ResponseHandler.error(
                            message=f"Not enough stock for product {product.name}",
                            status=400,
                        )
                    product.quantity -= detail.quantity

        s.commit()
        return ResponseHandler.success(
            message="Transaction status updated successfully", status=200
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while updating the transaction",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


# Show all transactions for users/customers
@transaction_blueprint.get("/transaction")
@jwt_required()
def show_user_transactions():
    user_id = get_jwt_identity()

    try:
        # Retrieve all transactions for the current user
        transactions = TransactionModel.query.filter_by(user_id=user_id).all()
        if not transactions:
            return ResponseHandler.success(
                data=[], message="No transactions found", status=200
            )

        # Prepare transaction data
        transactions_data = []
        for transaction in transactions:
            # Retrieve the associated voucher if there is any voucher applied in this transaction
            transaction_voucher = TransactionVoucherModel.query.filter_by(
                transaction_id=transaction.id
            ).first()

            if transaction_voucher:
                voucher = VoucherModel.query.filter_by(
                    id=transaction_voucher.voucher_id
                ).first()
                voucher_name = voucher.name if voucher else None
                discount = transaction_voucher.amount

            # Retrieve transaction details
            transaction_details = TransactionDetailModel.query.filter_by(
                transaction_id=transaction.id
            ).all()

            # Prepare details for each product in this transaction
            products_data = [
                {
                    "product_name": ProductModel.query.get(detail.product_id).name,
                    "price": detail.price,
                    "quantity": detail.quantity,
                }
                for detail in transaction_details
            ]

            # Prepare the transaction data
            transactions_data.append(
                {
                    "id": transaction.id,
                    "total_price": transaction.total_price,
                    "status": transaction.status,
                    "voucher_applied": voucher_name,
                    "discount": discount,
                    "products": products_data,
                }
            )

        return ResponseHandler.success(data=transactions_data, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occurred while fetching transactions",
            data=str(e),
            status=500,
        )


# Show all transactions for current seller that logged in
@transaction_blueprint.get("/transaction-seller")
@jwt_required()
def show_seller_transactions():
    user_id = get_jwt_identity()

    try:
        # Check if the user is a seller
        user = UserModel.query.get(user_id)
        if user.role != "seller":
            return ResponseHandler.error(message="User is not a seller", status=403)

        # Get the seller ID from the SellerModel
        seller = SellerModel.query.filter_by(user_id=user_id).first()
        if not seller:
            return ResponseHandler.error(
                message="Seller information not found", status=404
            )

        # Retrieve all transactions where the current user is the seller
        transactions = TransactionModel.query.filter_by(seller_id=seller.id).all()
        if not transactions:
            return ResponseHandler.success(
                data=[], message="No transactions found", status=200
            )

        # Prepare transaction data
        transactions_data = []
        for transaction in transactions:
            # Retrieve the associated voucher if there is any voucher applied in this transaction
            transaction_voucher = TransactionVoucherModel.query.filter_by(
                transaction_id=transaction.id
            ).first()

            voucher_name = None
            discount = None
            if transaction_voucher:
                voucher = VoucherModel.query.filter_by(
                    id=transaction_voucher.voucher_id
                ).first()
                voucher_name = voucher.name if voucher else None
                discount = transaction_voucher.amount

            # Retrieve transaction details
            transaction_details = TransactionDetailModel.query.filter_by(
                transaction_id=transaction.id
            ).all()

            # Prepare details for each product in this transaction
            products_data = [
                {
                    "product_name": ProductModel.query.get(detail.product_id).name,
                    "price": detail.price,
                    "quantity": detail.quantity,
                }
                for detail in transaction_details
            ]

            # Prepare the transaction data
            transactions_data.append(
                {
                    "id": transaction.id,
                    "total_price": transaction.total_price,
                    "status": transaction.status,
                    "voucher_applied": voucher_name,
                    "discount": discount,
                    "products": products_data,
                }
            )

        return ResponseHandler.success(data=transactions_data, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occurred while fetching transactions",
            data=str(e),
            status=500,
        )

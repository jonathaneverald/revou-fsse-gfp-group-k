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
from schemas.transaction_schema import add_transaction_schema


transaction_blueprint = Blueprint("transaction_blueprint", __name__)


@transaction_blueprint.post("/transaction")
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

        # Retrieve the seller_ids in current user's cart
        seller_ids = {
            s.query(ProductModel).filter_by(id=item.product_id).first().seller_id
            for item in cart_items
        }

        # Calculate total price for transaction
        total_price = 0
        for item in cart_items:
            product = s.query(ProductModel).filter_by(id=item.product_id).first()
            if not product:
                return ResponseHandler.error(
                    message=f"Product with ID {item.product_id} is not found",
                    status=404,
                )
            total_price += item.quantity * product.price

        # Check if a voucher is applied in transaction
        data = request.get_json()
        validator = Validator(add_transaction_schema)
        if not validator.validate(data):
            return ResponseHandler.error(
                message="Data Invalid!", data=validator.errors, status=400
            )

        voucher = None  # Set default value for voucher to null (none)
        discount = 0  # Set default value for discount

        if "voucher_id" in data:
            voucher = (
                s.query(VoucherModel)
                .filter(
                    VoucherModel.id == data["voucher_id"],
                    VoucherModel.seller_id.in_(seller_ids),
                )
                .first()
            )
            if not voucher:
                return ResponseHandler.error(
                    message="Voucher not found or not applicable", status=400
                )
            discount = voucher.discount
            total_price -= discount

        # Create the transaction
        new_transaction = TransactionModel(
            user_id=user_id,
            total_price=total_price,
            status="pending",
        )
        s.add(new_transaction)
        s.flush()  # Populate the new_transaction.id with the auto-incremented value

        # If a voucher is applied, create a new row TransactionVouchers table
        if voucher:
            new_transaction_voucher = TransactionVoucherModel(
                transaction_id=new_transaction.id,
                voucher_id=voucher.id,
                amount=discount,
            )
            s.add(new_transaction_voucher)

        # Create transaction details for all products in current user's cart
        transaction_details = []
        for item in cart_items:
            product = s.query(ProductModel).filter_by(id=item.product_id).first()
            if not product:
                return ResponseHandler.error(
                    message=f"Product with ID {item.product_id} is not found",
                    status=404,
                )
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

        # Commit the transaction
        s.commit()

        transaction_info = {
            "transaction_id": new_transaction.id,
            "total_price": new_transaction.total_price,
            "status": new_transaction.status,
            "voucher_applied": voucher.name if voucher else None,
            "discount": discount,
            "transaction_details": transaction_details,
        }

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

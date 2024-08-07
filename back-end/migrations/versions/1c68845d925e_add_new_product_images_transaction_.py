"""add new product_images, transaction_vouchers table, modify relationship, and delete columns

Revision ID: 1c68845d925e
Revises: 946da05866b2
Create Date: 2024-08-07 21:20:00.255425

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '1c68845d925e'
down_revision = '946da05866b2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('carts', schema=None) as batch_op:
        batch_op.add_column(sa.Column('quantity', sa.Integer(), nullable=False))

    with op.batch_alter_table('transactions', schema=None) as batch_op:
        batch_op.drop_constraint('transactions_ibfk_3', type_='foreignkey')
        batch_op.drop_column('total_discount')
        batch_op.drop_column('voucher_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('transactions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('voucher_id', mysql.INTEGER(), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('total_discount', mysql.DECIMAL(precision=10, scale=2), nullable=True))
        batch_op.create_foreign_key('transactions_ibfk_3', 'vouchers', ['voucher_id'], ['id'])

    with op.batch_alter_table('carts', schema=None) as batch_op:
        batch_op.drop_column('quantity')

    # ### end Alembic commands ###

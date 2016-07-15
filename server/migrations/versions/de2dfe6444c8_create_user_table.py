"""create user table

Revision ID: de2dfe6444c8
Revises: 5baaa60f7a27
Create Date: 2016-07-15 14:42:21.560861

"""

# revision identifiers, used by Alembic.
revision = 'de2dfe6444c8'
down_revision = '5baaa60f7a27'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('social_id', sa.String(length=255), nullable=True),
    sa.Column('social_type', sa.Enum('google', 'facebook', name='social_network_list'), nullable=False),
    sa.Column('f_name', sa.String(length=255), nullable=True),
    sa.Column('l_name', sa.String(length=255), nullable=True),
    sa.Column('gender', sa.Enum('male', 'female', name='gender_list'), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=True),
    sa.Column('token', sa.String(length=32), nullable=True),
    sa.Column('role', sa.Enum('user', 'designer', 'admin', name='user_roles'), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_index(op.f('ix_user_social_id'), 'user', ['social_id'], unique=False)
    op.create_index(op.f('ix_user_token'), 'user', ['token'], unique=False)
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_user_token'), table_name='user')
    op.drop_index(op.f('ix_user_social_id'), table_name='user')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    ### end Alembic commands ###

"""empty message

Revision ID: 03b09c3d91cb
Revises: cc9b78ad9842
Create Date: 2016-08-03 09:20:09.995591

"""

# revision identifiers, used by Alembic.
revision = '03b09c3d91cb'
down_revision = 'cc9b78ad9842'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('banner_review', sa.Column('designer_imagename', sa.String(length=64), nullable=True))
    op.add_column('banner_review', sa.Column('designer_previewname', sa.String(length=64), nullable=True))
    op.drop_constraint('banner_review_designer_reviewed_key', 'banner_review', type_='unique')
    op.create_unique_constraint(None, 'banner_review', ['designer_imagename'])
    op.create_unique_constraint(None, 'banner_review', ['designer_previewname'])
    op.drop_column('banner_review', 'designer_reviewed')
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('banner_review', sa.Column('designer_reviewed', sa.VARCHAR(length=64), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'banner_review', type_='unique')
    op.drop_constraint(None, 'banner_review', type_='unique')
    op.create_unique_constraint('banner_review_designer_reviewed_key', 'banner_review', ['designer_reviewed'])
    op.drop_column('banner_review', 'designer_previewname')
    op.drop_column('banner_review', 'designer_imagename')
    ### end Alembic commands ###

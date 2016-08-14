"""create fonts

Revision ID: 6ddd40dc3e15
Revises: 03b09c3d91cb
Create Date: 2016-08-13 22:22:46.113303

"""

# revision identifiers, used by Alembic.
revision = '6ddd40dc3e15'
down_revision = '03b09c3d91cb'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('font',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('filename', sa.String(length=255), nullable=True),
    sa.Column('project_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['project_id'], ['project.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('project_id', 'name', name='project_font')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('font')
    ### end Alembic commands ###
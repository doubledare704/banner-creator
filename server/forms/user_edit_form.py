from flask_wtf import Form
from wtforms import StringField
from wtforms.validators import DataRequired, AnyOf

from server.models import User

USER_ROLES = [role.name for role in User.UserRole]


class UserEditForm(Form):
    first_name = StringField('first_name')
    last_name = StringField('last_name')
    role = StringField('role', validators=[DataRequired(), AnyOf(USER_ROLES)])

from flask_wtf import Form
from wtforms import StringField, SelectField
from wtforms.validators import DataRequired


class ProfileForm(Form):
    first_name = StringField('first_name', validators=[DataRequired()])
    last_name = StringField('last_name', validators=[DataRequired()])
    gender = SelectField('gender', choices=[('male', 'Мужской'), ('female' ,'Женский')], validators=[DataRequired()])

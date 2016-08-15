from flask_wtf import Form
from wtforms import StringField, FileField
from wtforms.validators import DataRequired


class FontUploadForm(Form):
    name = StringField('name', validators=[DataRequired()])
    font_file = FileField('font_file', validators=[DataRequired()])

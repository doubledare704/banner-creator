import os
from flask import current_app
from flask_wtf import Form
from wtforms import StringField, FileField
from wtforms.validators import DataRequired, ValidationError


def validate_font_file(form, field):
    _, extension = os.path.splitext(field.data.filename)
    allowed_extensions = current_app.config['ALLOWED_FONTS_EXTENSIONS']
    if extension not in allowed_extensions:
        raise ValidationError('File extension must be one of %s' % str(allowed_extensions))


class FontUploadForm(Form):
    font_name = StringField('name', validators=[DataRequired()])
    font_file = FileField('font_file', validators=[DataRequired(), validate_font_file])

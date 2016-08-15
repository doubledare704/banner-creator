from flask_wtf import Form
from wtforms import StringField
from wtforms.validators import DataRequired


class CreateProjectForm(Form):
    project_name = StringField('project_name', validators=[DataRequired()])

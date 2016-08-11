from flask import request
from flask_babel import format_datetime

from server.models import Project


def init_custom_filters(app):
    @app.template_filter('format_date')
    def format_date(value, custom_format='d MMMM YYYY HH:mm'):
        return format_datetime(value, custom_format)

    @app.template_global('projects_list')
    def projects_list():
        return Project.query.all()

    @app.template_global('active_endpoint')
    def active_endpoint(endpoint):
        if request.url_rule.endpoint == endpoint:
            return 'active'
        return ""

    @app.template_global('active_endpoint_startswith')
    def active_endpoint_startswith(endpoint):
        if request.url_rule.endpoint.startswith(endpoint):
            return 'active'
        return ""

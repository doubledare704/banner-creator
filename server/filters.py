from flask import request
from flask_babel import format_datetime

from server.models import Project


def init_custom_filters(app):
    @app.template_filter('format_date')
    def format_date(value, custom_format='d MMMM YYYY HH:mm'):
        return format_datetime(value, custom_format)

    @app.template_global('projects_list')
    def projects_list():
        return Project.query.order_by(Project.name).all()

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

    @app.template_global('active_tab')
    def active_endpoint(tab_name):
        if request.args.get('tab') == tab_name:
            return 'active'
        return ""

    @app.template_global('active_project')
    def active_project(item_id, project):
        if project and item_id == project.id:
            return 'active'
        return ""

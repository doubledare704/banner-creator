from flask_babel import format_datetime


def init_custom_filters(app):
    @app.template_filter('format_date')
    def format_date(value, format='d MMMM YYYY HH:mm'):
        return format_datetime(value, 'd MMMM YYYY HH:mm')

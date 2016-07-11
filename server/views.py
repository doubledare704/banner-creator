def setup_routes(app):
    """Here we map routes to handlers."""

    app.add_url_rule('/', view_func=index)


def index():
    return 'Hello world'

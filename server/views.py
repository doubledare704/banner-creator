from flask import render_template


def setup_routes(app):
    """Here we map routes to handlers."""

    app.add_url_rule('/', view_func=editor)


def editor():
    # return 'Hello world'
    return render_template('editor.html')

import flask
from flask_bootstrap import Bootstrap
from .views import setup_routes


def main():
    app = flask.Flask(__name__)
    bootstrap = Bootstrap(app)
    setup_routes(app)
    app.run()

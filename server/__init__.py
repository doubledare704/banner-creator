import flask
from .views import setup_routes


def main():
    app = flask.Flask(__name__)
    setup_routes(app)
    app.run()

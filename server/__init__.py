import flask
from flask_bootstrap import Bootstrap
from .views import setup_routes


def main():
    app = flask.Flask(__name__, instance_relative_config=True)
    bootstrap = Bootstrap(app)
    setup_routes(app)

    # Apply default config and dev config from instance/config.cfg if exists
    app.config.from_object('server.config')
    app.config.from_pyfile('config.cfg', silent=True)

    app.run()

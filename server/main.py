import flask
from flask_bootstrap import Bootstrap
from server.views import setup_routes
from server.db import db

bootstrap = Bootstrap()


def main():
    app = flask.Flask(__name__, instance_relative_config=True)
    setup_routes(app)

    # Apply default config and dev config from instance/config.cfg if exists
    app.config.from_object('server.config')
    app.config.from_pyfile('config.cfg', silent=True)

    bootstrap.init_app(app)
    db.init_app(app)

    app.run()

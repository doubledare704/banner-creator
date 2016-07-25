import logging
from logging import handlers

from flask import Flask

from flask_migrate import Migrate
from flask_login import LoginManager

from server.utils.auth import load_user
from server.routes import setup_routes
from server.db import db


def create_app():
    app = Flask(__name__, instance_relative_config=True)

    setup_routes(app)

    # apply default config and dev config from instance/config.py if exists
    app.config.from_object('server.config.default')
    app.config.from_pyfile('config.py', silent=True)
    # apply config from env variable, must be an absolute path to python file
    app.config.from_envvar('APP_CONFIG_FILE')

    db.init_app(app)

    # auth init
    login_manager = LoginManager(app)
    login_manager.login_view = "login_page"
    login_manager.user_loader(load_user)

    # load all models to be available for db migration tool
    from server import models

    migrate = Migrate(app, db, directory='server/migrations')

    # logging config
    handler = handlers.RotatingFileHandler(filename=app.config['LOGGING_LOCATION'],
                                           maxBytes=app.config['LOGGING_FILE_SIZE'],
                                           backupCount=1)
    handler.setLevel(app.config['LOGGING_LEVEL'])
    formatter = logging.Formatter(app.config['LOGGING_FORMAT'])
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)

    return app

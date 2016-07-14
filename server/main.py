import flask

from flask_bootstrap import Bootstrap
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from server.views import setup_routes
from server.db import db

bootstrap = Bootstrap()


def main():
    app = flask.Flask(__name__, instance_relative_config=True)
    setup_routes(app)

    # Apply default config and dev config from instance/config.py if exists
    app.config.from_object('server.config')
    app.config.from_pyfile('config.py', silent=True)

    bootstrap.init_app(app)
    db.init_app(app)

    # Load all models to be available for db migration tool
    from server import models


    migrate = Migrate(app, db, directory='server/migrations')
    manager = Manager(app)
    manager.add_command('db', MigrateCommand)

    manager.run()

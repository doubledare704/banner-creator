import sys

from flask_script import Manager
from flask_migrate import MigrateCommand

from server.main import create_app

app = create_app()

manager = Manager(app)
manager.add_command('db', MigrateCommand)


@manager.command
def test():
    """
    Discover all the tests and run them
    """
    import unittest
    tests = unittest.TestLoader().discover('server/tests')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if not result.wasSuccessful():
        sys.exit(1)


if __name__ == '__main__':
    manager.run()
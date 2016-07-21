import unittest
from flask import session, url_for

from server.main import create_app
from server.db import db

app = create_app()


def setUpModule():
    """
    Initializes a test environment
    """
    app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_TEST_DATABASE_URI']
    app.config['SERVER_NAME'] = 'localhost'
    app.config['TESTING'] = True
    app.config['DEBUG'] = False


class TestAuth(unittest.TestCase):
    def setUp(self):
        """
        Creates tables in test database
        """
        with app.app_context():
            db.create_all()

        self.client = app.test_client()

    def tearDown(self):
        """
        Deletes created tables and closes the session instance
        """
        db.session.remove()
        db.drop_all(app=app)

    def test_redirect_to_login(self):
        with app.app_context():
            response = self.client.get(url_for('index'))
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers['location'], url_for('login'))
        self.assertEqual(session['redirect_url'], url_for('index'))

    def test_log_out(self):
        with app.app_context():
            response = self.client.post(url_for('log_out'))
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers['location'], url_for('login'))
        self.assertEqual(session['redirect_url'], url_for('index'))

    def test_check_auth_login_url(self):
        with app.app_context():
            response = self.client.get(url_for('login'))
        self.assertEqual(response.status_code, 200)

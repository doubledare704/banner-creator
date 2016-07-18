import unittest
import datetime

import flask
from flask import request, session
from server.auth.base import BaseAuth
from server.auth.facebook import FacebookAuth
from server.auth.google import GoogleAuth

from server.main import create_app
from server.db import db
from server.models import User

# Create an instance of application
from server.utils import auth


# Create an instance of application
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
            request.path = '/test'
            response = auth._redirect_to_login()
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers['location'], '/login')
        self.assertEqual(session['redirect_url'], '/test')

    def test_redirect_after_login(self):
        with app.app_context():
            session['redirect_url'] = '/test'
            response = auth.redirect_after_login()
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers['location'], '/test')
        self.assertEqual(session.get('redirect_url', None), None)

    def test_create_user_google(self):
        user_auth = GoogleAuth(app)
        user_data = {'given_name': 'first_name',
                     'family_name': 'last_name',
                     'gender': 'male',
                     'id': 1234,
                     'email': 'test@test.com'
                     }
        user = user_auth._create_user(user_data)
        self.assertEqual(user.f_name, user_data['given_name'])
        self.assertEqual(user.l_name, user_data['family_name'])
        self.assertEqual(user.gender, user_data['gender'])
        self.assertEqual(user.social_id, user_data['id'])
        self.assertEqual(user.email, user_data['email'])
        self.assertEqual(user.social_type, 'google')

    def test_create_user_facebook(self):
        user_auth = FacebookAuth(app)
        user_data = {'first_name': 'first_name',
                     'last_name': 'last_name',
                     'gender': 'male',
                     'id': 1234,
                     'email': 'test@test.com'
                     }
        user = user_auth._create_user(user_data)
        self.assertEqual(user.f_name, user_data['first_name'])
        self.assertEqual(user.l_name, user_data['last_name'])
        self.assertEqual(user.gender, user_data['gender'])
        self.assertEqual(user.social_id, user_data['id'])
        self.assertEqual(user.email, user_data['email'])
        self.assertEqual(user.social_type, 'facebook')

    def test_log_out(self):
        user_auth = BaseAuth(app)
        user_data = {'first_name': 'first_name',
                     'last_name': 'last_name',
                     'gender': 'male',
                     'id': 1234,
                     'email': 'test@test.com'
                     }
        token = 'token'
        user = User(f_name=user_data['first_name'], l_name=user_data['last_name'], gender=user_data['gender'],
                    social_id=user_data['id'], role='user', email=user_data['email'],
                    created_at=datetime.datetime.now(), social_type='google', token=token)
        self.assertEqual(user.token, token)
        flask.g.current_user = user
        user_auth.log_out()
        self.assertEqual(user.token, None)

    def test_check_auth_login_url(self):
        request.path = '/login'
        response = auth.check_auth()
        self.assertEqual(response, None)

    def test_check_auth_static_url(self):
        # with app.app_context():
        request.path = '/login'
        response = auth.check_auth()
        self.assertEqual(response, None)

    def test_check_auth_another_url(self):
        # with app.app_context():
        request.path = '/test'
        response = auth.check_auth()
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers['location'], '/login')

    def test_check_auth_google(self):
        user_auth = GoogleAuth(app)
        # with app.app_context():
        response = user_auth.authorize()
        self.assertEqual(response.status_code, 302)

    def test_check_auth_facebook(self):
        user_auth = FacebookAuth(app)
        # with app.app_context():
        response = user_auth.authorize()
        self.assertEqual(response.status_code, 302)

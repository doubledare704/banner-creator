import datetime

from flask_oauthlib.client import OAuth
from flask_oauthlib.contrib.apps import google as google_app
from server.auth.base import BaseAuth
from server.models import User


class GoogleAuth(BaseAuth):
    def __init__(self):
        super().__init__()
        self._oauth_name = 'google'
        self._fetch_query = 'userinfo'
        self._oauth_app = google_app.register_to(OAuth(), app_key='GOOGLE_OAUTH_PARAMS')

    def _create_user(self, user_data):
        return User(f_name=user_data['given_name'], l_name=user_data['family_name'], gender=user_data['gender'],
                    social_id=user_data['id'], role='user', email=user_data['email'],
                    created_at=datetime.datetime.now(), social_type=self._oauth_name)

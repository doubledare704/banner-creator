import datetime
# from flask_oauthlib.client import OAuth
from flask_oauthlib.contrib.apps import facebook as facebook_app

from flask_oauthlib.client import OAuth
from server.auth.base import BaseAuth
from server.models import User


class FacebookAuth(BaseAuth):
    def __init__(self):
        super().__init__()
        self._oauth_name = 'facebook'
        self._fetch_query = '/me?fields=email,id,first_name,last_name,gender'
        self._oauth_app = facebook_app.register_to(OAuth(), app_key='FACEBOOK_OAUTH_PARAMS')

    def _create_user(self, user_data):
        return User(f_name=user_data['first_name'], l_name=user_data['last_name'], gender=user_data['gender'],
                    social_id=user_data['id'], role='user', email=user_data['email'],
                    created_at=datetime.datetime.now(), social_type=self._oauth_name)

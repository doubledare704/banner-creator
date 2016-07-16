import datetime

from flask_oauthlib.client import OAuth
from server.auth.base import BaseAuth
from server.models import User


class FacebookAuth(BaseAuth):
    def __init__(self, app):
        super().__init__(app)
        self._oauth_name = 'facebook'
        self._callback_method = 'auth_response'
        self._fetch_query = '/me?fields=email,id,first_name,last_name,gender'
        self._oauth_app = OAuth(app).remote_app(
            self._oauth_name,
            consumer_key=app.config['FACEBOOK_APP_ID'],
            consumer_secret=app.config['FACEBOOK_APP_SECRET'],
            request_token_params={'scope': 'email'},
            base_url=app.config['FACEBOOK_BASE_URL'],
            access_token_method=app.config['FACEBOOK_ACCESS_TOKEN_METHOD'],
            access_token_url=app.config['FACEBOOK_ACCESS_TOKEN_URL'],
            authorize_url=app.config['FACEBOOK_AUTHORIZE_URL']
        )

    def _create_user(self, user_data):
        return User(f_name=user_data['first_name'], l_name=user_data['last_name'], gender=user_data['gender'],
                    social_id=user_data['id'], role='user', email=user_data['email'],
                    created_at=datetime.datetime.now(), social_type=self._oauth_name)

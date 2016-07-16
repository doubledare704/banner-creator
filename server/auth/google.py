import datetime

from flask_oauthlib.client import OAuth
from server.auth.base import BaseAuth
from server.models import User


class GoogleAuth(BaseAuth):
    def __init__(self, app):
        super().__init__(app)
        self._oauth_name = 'google'
        self._callback_method = 'auth_response'
        self._fetch_query = 'userinfo'
        self._oauth_app = OAuth(app).remote_app(
            self._oauth_name,
            consumer_key=app.config['GOOGLE_ID'],
            consumer_secret=app.config['GOOGLE_SECRET'],
            request_token_params={'scope': 'email'},
            base_url=app.config['GOOGLE_BASE_URL'],
            access_token_method=app.config['GOOGLE_ACCESS_TOKEN_METHOD'],
            access_token_url=app.config['GOOGLE_ACCESS_TOKEN_URL'],
            authorize_url=app.config['GOOGLE_AUTHORIZE_URL'],
        )

    def _create_user(self, user_data):
        return User(f_name=user_data['given_name'], l_name=user_data['family_name'], gender=user_data['gender'],
                    social_id=user_data['id'], role='user', email=user_data['email'],
                    created_at=datetime.datetime.now(), social_type=self._oauth_name)

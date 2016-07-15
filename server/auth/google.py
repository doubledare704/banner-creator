import uuid

import datetime

from flask import session, request, url_for
from flask_oauthlib.client import OAuth
from flask_oauthlib.client import OAuthException
from server.models import User
from server.db import db

OAUTH_NAME = 'google'
TOKEN_NAME = 'google_token'
_google_oauth = None


def initialize(app):
    global _google_oauth
    _google_oauth = OAuth(app).remote_app(
        OAUTH_NAME,
        consumer_key=app.config['GOOGLE_ID'],
        consumer_secret=app.config['GOOGLE_SECRET'],
        request_token_params={
            'scope': 'email'
        },
        base_url=app.config['GOOGLE_BASE_URL'],
        access_token_method=app.config['GOOGLE_ACCESS_TOKEN_METHOD'],
        access_token_url=app.config['GOOGLE_ACCESS_TOKEN_URL'],
        authorize_url=app.config['GOOGLE_AUTHORIZE_URL'],
    )


def send_login():
    # TODO remove localhost, add _external=True for production
    return _google_oauth.authorize(callback='http://localhost:5000' + url_for('google_auth'))


def auth():
    resp = _google_oauth.authorized_response()
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    if isinstance(resp, OAuthException):
        return 'Access denied'

    google_token = (resp['access_token'], '')
    return get_user_info(google_token)


def get_user_info(google_token):
    user_data = _google_oauth.get('userinfo', token=google_token).data
    user = User.query.filter_by(social_id=user_data['id']).first()
    # user registration
    if user is None:
        user = User(f_name=user_data['given_name'], l_name=user_data['family_name'], gender=user_data['gender'],
                    social_id=user_data['id'], role='user', email=user_data['email'],
                    created_at=datetime.datetime.now(), social_type=OAUTH_NAME)
    token = uuid.uuid4().hex
    user.token = token
    db.session.add(user)
    session['auth_token'] = token
    return user


def log_out():
    user = User.query.filter_by(token=session['auth_token']).first()
    user.token = None
    del session['auth_token']
    db.session.add(user)

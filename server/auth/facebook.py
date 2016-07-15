import uuid

import datetime

from flask import url_for, session
from flask_oauthlib.client import OAuth, OAuthException
from server.db import db
from server.models import User

OAUTH_NAME = 'facebook'
TOKEN_NAME = 'facebook_token'
_facebook_oauth = None


def initialize(app):
    global _facebook_oauth
    _facebook_oauth = OAuth(app).remote_app(
        OAUTH_NAME,
        consumer_key=app.config['FACEBOOK_APP_ID'],
        consumer_secret=app.config['FACEBOOK_APP_SECRET'],
        request_token_params={'scope': 'email'},
        base_url=app.config['FACEBOOK_BASE_URL'],
        access_token_url=app.config['FACEBOOK_ACCESS_TOKEN_URL'],
        access_token_method=app.config['FACEBOOK_ACCESS_TOKEN_METHOD'],
        authorize_url=app.config['FACEBOOK_AUTHORIZE_URL']
    )


def send_login():
    # TODO remove localhost, add _external=True for production
    return _facebook_oauth.authorize(callback='http://localhost:5000' + url_for('facebook_auth'))


def auth():
    resp = _facebook_oauth.authorized_response()
    if resp is None:
        return None
    if isinstance(resp, OAuthException):
        return None
    session[TOKEN_NAME] = (resp['access_token'], '')
    facebook_token = (resp['access_token'], '')
    return get_user_info(facebook_token)


def get_user_info(facebook_token):
    user_data = _facebook_oauth.get('/me?fields=email,id,first_name,last_name,gender', token=facebook_token).data
    user = User.query.filter_by(social_id=user_data['id']).first()
    # user registration
    if user is None:
        user = User(f_name=user_data['first_name'], l_name=user_data['last_name'], gender=user_data['gender'],
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


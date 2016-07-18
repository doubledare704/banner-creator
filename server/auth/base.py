import uuid

import flask
from flask import url_for, session
from flask_oauthlib.client import OAuthException
from server.db import db
from server.models import User


class BaseAuth:
    def __init__(self, app):
        self._oauth_app = None
        self._callback_method = None
        self._token_name = 'auth_token'
        self._oauth_name = None
        self._fetch_query = None

    def authorize(self):
        # TODO remove localhost, add _external=True for production
        return self._oauth_app.authorize(
            callback='http://localhost:5000' + url_for(self._callback_method, social_network_name=self._oauth_name))

    def user_auth_response(self):
        resp = self._oauth_app.authorized_response()
        if resp is None:
            return None
        if isinstance(resp, OAuthException):
            return None
        social_token = (resp['access_token'], '')
        return self._fetch_user_from_social(social_token)

    def _fetch_user_from_social(self, social_token):
        user_data = self._oauth_app.get(self._fetch_query, token=social_token).data
        user = User.query.filter_by(social_id=user_data['id'], social_type=self._oauth_name).first()

        # user registration if not exist in db
        if user is None:
            user = self._create_user(user_data)
        token = uuid.uuid4().hex
        user.token = token
        db.session.add(user)
        flask.g.current_user_id = user.id
        session[self._token_name] = token
        return user

    def _create_user(self, user_data):
        return NotImplementedError

    def log_out(self):
        user = flask.g.get('current_user', None)
        if user:
            user.token = None
            db.session.add(user)
        if self._token_name in session:
            del session[self._token_name]

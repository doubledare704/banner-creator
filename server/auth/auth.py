import flask
from server.auth.base import BaseAuth
from server.auth.facebook import FacebookAuth
from server.auth.google import GoogleAuth
from server.models import User

_social_networks = None


def initialize(app):
    global _social_networks
    _social_networks = {'facebook': FacebookAuth(app),
                        'google': GoogleAuth(app),
                        'base': BaseAuth(app)}


def authorize(social_name):
    return _social_type(social_name).authorize()


def set_current_user(auth_token):
    user = User.query.filter_by(token=auth_token).first()
    if user:
        flask.g.current_user = user
        return user
    return None


def user_auth_response(social_name):
    return _social_type(social_name).user_auth_response()


def log_out():
    return _social_type('base').log_out()


def _social_type(name):
    return _social_networks[name]

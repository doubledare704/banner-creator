import flask
from server.db import db
from server.auth.facebook import FacebookAuth
from server.auth.google import GoogleAuth
from server.models import User


class Auth:
    _social_networks = None

    def __init__(self, app):
        global _social_networks
        _social_networks = {'facebook': FacebookAuth(app),
                            'google': GoogleAuth(app)}

    @staticmethod
    def authorize(social_name):
        return Auth._social_type(social_name).authorize()

    @staticmethod
    def set_current_user(auth_token):
        user = db.session.query(User.id).filter_by(token=auth_token).first()
        if user:
            flask.g.current_user = user[0]
            return user[0]
        return None

    @staticmethod
    def user_auth_response(social_name):
        return Auth._social_type(social_name).user_auth_response()

    @staticmethod
    def log_out(social_name):
        return Auth._social_type(social_name).log_out()

    @staticmethod
    def _social_type(name):
        return _social_networks[name]

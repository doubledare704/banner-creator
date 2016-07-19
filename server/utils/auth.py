from flask import redirect, url_for, current_app, request, session
# from flask_login import current_user
from server.auth.base import BaseAuth
from server.auth.facebook import FacebookAuth
from server.auth.google import GoogleAuth
from server.models import User

_social_networks = {'facebook': FacebookAuth(),
                    'google': GoogleAuth(),
                    'base': BaseAuth()}


def check_auth(something):
    if 'auth_token' in session:
        # user = _set_current_user(session['auth_token'])
        # if fake token
        user = User.query.filter_by(token=session['auth_token']).first()
        if user is None:
            del session['auth_token']
        else:
            return user
            # return _redirect_to_login()
    else:
        return None  # not static/login, not logged in


def _redirect_to_login():
    session['redirect_url'] = request.path
    return redirect(url_for('login_page', next=request))


def redirect_after_login():
    response = current_app.make_response(redirect(session.get('redirect_url', url_for('index'))))
    if session.get('redirect_url', None):
        del session['redirect_url']
    return response


def oauth_type(name):
    return _social_networks[name]


def load_user(auth_token):
    return User.query.filter_by(token=auth_token).first()

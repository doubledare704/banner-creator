import re
from flask import redirect, url_for, current_app, request, session
from server.auth import auth


def check_auth():
    path = request.path
    result = re.compile(
        r"^((/_debug_toolbar)|(" + current_app.static_url_path + ")|(" + url_for('login_page') + "))").match(
        path)

    if 'auth_token' in session:
        user = auth.set_current_user(session['auth_token'])
        # if fake token
        if user is None:
            del session['auth_token']
            return _redirect_to_login()
    elif result is None:  # not static/login, not logged in
        return _redirect_to_login()


def _redirect_to_login():
    session['redirect_url'] = request.path
    return redirect(url_for('login_page'))


def redirect_after_login():
    response = current_app.make_response(redirect(session.get('redirect_url', url_for('index'))))
    if session.get('redirect_url', None):
        del session['redirect_url']
    return response

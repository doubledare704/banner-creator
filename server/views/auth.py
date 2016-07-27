from server.models import User
from server.utils.auth import redirect_after_login, oauth_apps
from flask_oauthlib.client import OAuthException
from flask_login import login_required, login_user, logout_user
from flask import render_template, redirect, request, url_for, session
from server.db import db


def login_page():
    if request.args.get('next', None) and request.args['next'] != url_for('log_out'):
        session['redirect_url'] = request.args['next']
    return render_template('login.html')


def oauth_callback(social_network_name):
    oauth_dict = oauth_apps[social_network_name]
    oauth_app = oauth_dict['oauth']
    resp = oauth_app.authorized_response()
    if resp is None or isinstance(resp, OAuthException):
        return None
    user_data = oauth_app.get(oauth_dict['fetch_query'], token=(resp['access_token'], '')).data
    user = User.query.filter_by(social_id=user_data['id'], social_type=social_network_name).first()

    if user is None:
        user_fields = oauth_dict['custom_fields']
        user = User(
            first_name=user_data[user_fields['first_name']],
            last_name=user_data[user_fields['last_name']],
            gender=user_data.get('gender', None),
            social_id=user_data['id'],
            email=user_data['email'],
            role='user',
            social_type=social_network_name
        )
        db.session.add(user)
        db.session.commit()
    login_user(user)
    return redirect_after_login()


def authorize(social_network_name):
    return oauth_apps[social_network_name]['oauth'].authorize(
        callback=url_for('oauth_callback', _external=True, social_network_name=social_network_name))


@login_required
def log_out():
    logout_user()
    return redirect(url_for('index'))

import datetime

import os
import uuid
from flask_oauthlib.client import OAuthException

from flask_login import login_required, login_user, logout_user
from server.utils.auth import redirect_after_login, oauth_apps

from flask import render_template, redirect, current_app, flash, request, url_for, session
from werkzeug.utils import secure_filename
from server.models import Image, User
from server.db import db
from server.utils.image import uploaded_file, image_delete, allowed_file, image_resize, image_rename


def setup_routes(app):
    """Here we map routes to handlers."""
    app.add_url_rule('/', methods=['GET', 'POST'], view_func=index)
    app.add_url_rule('/uploads/<filename>', view_func=uploaded_file)
    app.add_url_rule('/delete/<int:id>', methods=['GET', 'POST'], view_func=image_delete)
    app.add_url_rule('/rename/<int:id>', methods=['GET', 'POST'], view_func=image_rename)
    app.add_url_rule('/editor/', view_func=editor)

    # auth routs
    app.add_url_rule('/login', view_func=login_page)
    app.add_url_rule('/login/<social_network_name>', view_func=authorize)
    app.add_url_rule('/login/authorized/<social_network_name>/', view_func=oauth_callback)
    app.add_url_rule('/logout', methods=['POST'], view_func=log_out)


@login_required
def index():
    images = Image.query.filter_by(active=True)
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = str(uuid.uuid1()).replace("-", "") + '.' + secure_filename(file.filename).rsplit('.', 1)[1]
            file = image_resize(file)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            title = request.form['title']
            image = Image(name=filename, title=title)
            db.session.add(image)

            return redirect(request.url)
    return render_template('list.html', images=images)


@login_required
def editor():
    return render_template('editor.html')


def login_page():
    session['redirect_url'] = request.args['next']
    return render_template('login.html')


def oauth_callback(social_network_name):
    oauth_app = oauth_apps[social_network_name]
    resp = oauth_app['oauth'].authorized_response()
    if resp is None or isinstance(resp, OAuthException):
        return None
    user_data = oauth_app['oauth'].get(oauth_app['fetch_query'], token=(resp['access_token'], '')).data
    user = User.query.filter_by(social_id=user_data['id'], social_type=social_network_name).first()

    # user registration if not exist in db
    if user is None:
        user_fields = oauth_app['custom_fields']
        user = User(f_name=user_data[user_fields['first_name']], l_name=user_data[user_fields['last_name']],
                    gender=user_data['gender'], social_id=user_data['id'], role='user', email=user_data['email'],
                    created_at=datetime.datetime.now(), social_type=social_network_name)
    login_user(user)
    return redirect_after_login()


def authorize(social_network_name):
    oauth_app = oauth_apps[social_network_name]
    return oauth_app['oauth'].authorize(
        callback=url_for('oauth_callback', _external=True, social_network_name=social_network_name))


@login_required
def log_out():
    logout_user()
    return redirect(url_for('index'))

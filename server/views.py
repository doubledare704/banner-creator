import os
import random
import string
import re
from flask import render_template, redirect, url_for, current_app, flash, request, send_from_directory, session, jsonify
from werkzeug.utils import secure_filename
from server.models import Image
from server.db import db
from server.models import User

from server.auth import facebook
from server.auth import google


def setup_routes(app):
    """Here we map routes to handlers."""
    app.add_url_rule('/', methods=['GET', 'POST'], view_func=index)
    app.add_url_rule('/uploads/<filename>', view_func=uploaded_file)
    app.add_url_rule('/delete/<int:id>', methods=['GET', 'POST'], view_func=image_delete)

    app.add_url_rule('/login', view_func=login_page)
    app.add_url_rule('/login/google', view_func=google_login)
    app.add_url_rule('/login/authorized/google/', view_func=google_auth)
    app.add_url_rule('/logout', view_func=log_out)

    app.add_url_rule('/login/facebook', view_func=facebook_login)
    app.add_url_rule('/login/authorized/facebook', view_func=facebook_auth)
    app.before_request(check_auth)


def allowed_file(filename):
    if not filename:
        return False
    name, extension = os.path.splitext(filename)
    return extension in current_app.config['ALLOWED_EXTENSIONS']


def uploaded_file(filename):
    return send_from_directory(
        current_app.config['UPLOAD_FOLDER'], filename
    )


def index():
    images = Image.query.all()
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
            char_set = string.ascii_uppercase + string.digits
            filename = ''.join(random.sample(char_set * 10, 10)) + secure_filename(file.filename)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            img = Image(
                name=url_for('uploaded_file', filename=filename
                             ))
            db.session.add(img)
            return redirect(request.url)
    return render_template('list.html', images=images)


def image_delete(id):
    img = Image.query.get_or_404(id)
    db.session.delete(img)
    return redirect(url_for('index'))


def check_auth():
    path = request.path
    result = re.compile(
        r"^((/_debug_toolbar)|(" + current_app.static_url_path + ")|(" + url_for('login_page') + "))").match(
        path)

    # wrong token
    if 'auth_token' in session and User.query.filter_by(token=session['auth_token']).first() is None:  # fake token
        del session['auth_token']
    if (result is None and 'auth_token' not in session) or (  # not static/login, not logged in
                    # try to get another page after redirecting to login page
                    result is None and 'redirect_url' in session):
        session['redirect_url'] = request.path
        return redirect(url_for('login_page'))


def redirect_after_login():
    response = current_app.make_response(redirect(session.get('redirect_url', url_for('index'))))
    if session.get('redirect_url', None):
        del session['redirect_url']
    return response


def login_page():
    return render_template('login.html')


def google_auth():
    google.auth()
    return redirect_after_login()


def google_login():
    return google.send_login()


def facebook_auth():
    facebook.auth()
    return redirect_after_login()


def facebook_login():
    return facebook.send_login()


def log_out():
    google.log_out()
    return redirect(url_for('login_page'))

import os
import random
import string
import re
from flask import render_template, redirect, url_for, current_app, flash, request, send_from_directory, session, jsonify
from server.auth.auth import Auth
from werkzeug.utils import secure_filename
from server.models import Image
from server.db import db


def setup_routes(app):
    """Here we map routes to handlers."""
    app.add_url_rule('/', methods=['GET', 'POST'], view_func=index)
    app.add_url_rule('/uploads/<filename>', view_func=uploaded_file)
    app.add_url_rule('/delete/<int:id>', methods=['GET', 'POST'], view_func=image_delete)

    # auth routs
    app.add_url_rule('/login', view_func=login_page)
    app.add_url_rule('/login/<social_network_name>', view_func=authorize)
    app.add_url_rule('/login/authorized/<social_network_name>/', view_func=auth_response)
    app.add_url_rule('/logout/<social_network_name>', view_func=log_out)

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

    if 'auth_token' in session:
        user = Auth.set_current_user(session['auth_token'])
        # if fake token
        if user is None:
            del session['auth_token']
            return redirect_to_login()
    elif result is None:  # not static/login, not logged in
        return redirect_to_login()


def redirect_to_login():
    session['redirect_url'] = request.path
    return redirect(url_for('login_page'))


def redirect_after_login():
    response = current_app.make_response(redirect(session.get('redirect_url', url_for('index'))))
    if session.get('redirect_url', None):
        del session['redirect_url']
    return response


def login_page():
    return render_template('login.html')


# callback for google redirect to
def auth_response(social_network_name):
    Auth.user_auth_response(social_network_name)
    return redirect_after_login()


def authorize(social_network_name):
    return Auth.authorize(social_network_name)


def log_out(social_network_name):
    Auth.log_out(social_network_name)
    return redirect(url_for('login_page'))

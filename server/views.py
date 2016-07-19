import os
import uuid

from flask_login import login_required, current_user
from server.utils.auth import redirect_after_login, oauth_type

from flask import render_template, redirect, current_app, flash, request
from werkzeug.utils import secure_filename
from server.models import Image
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

    @app.context_processor
    def inject_user():
        return dict(user=current_user)


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
    return render_template('login.html')


def oauth_callback(social_network_name):
    oauth_obj = oauth_type(social_network_name)
    oauth_obj.user_auth_response()
    # z = request.args
    return redirect_after_login()


def authorize(social_network_name):
    oauth_obj = oauth_type(social_network_name)
    return oauth_obj.authorize()


@login_required
def log_out():
    current_user.token = None
    db.session.add(current_user)
    return 'OK', 200

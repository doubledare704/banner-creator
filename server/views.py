import os
import random
import string
from flask import render_template,redirect,url_for,current_app,flash,request,send_from_directory
from werkzeug.utils import secure_filename
from server.models import Image
from server.db import db


def setup_routes(app):
    """Here we map routes to handlers."""
    app.add_url_rule('/', methods=['GET', 'POST'], view_func=index)
    app.add_url_rule('/uploads/<filename>', view_func=uploaded_file)
    app.add_url_rule('/delete/<int:id>', methods=['GET', 'POST'], view_func=image_delete)


def allowed_file(filename):
    if not filename:
        return False
    name, extension = os.path.splitext(filename)
    return extension in current_app.config['ALLOWED_EXTENSIONS']


def uploaded_file(filename):
    return send_from_directory(
        current_app.config['UPLOAD_FOLDER'],filename
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
            filename = ''.join(random.sample(char_set * 10, 10))+secure_filename(file.filename)
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



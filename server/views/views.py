import os
import uuid
from flask import render_template, redirect, current_app, flash, request
from werkzeug.utils import secure_filename
from server.models import Image
from server.db import db
from server.utils.image import uploaded_file,image_delete,allowed_file,image_resize, image_rename, send_from_directory


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
            filename = str(uuid.uuid1()).replace("-","")+'.'+secure_filename(file.filename).rsplit('.', 1)[1]
            file = image_resize(file)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            title = request.form['title']
            image = Image(name=filename, title = title)
            db.session.add(image)

            return redirect(request.url)
    return render_template('list.html', images=images)


def editor():
    return render_template('editor.html')

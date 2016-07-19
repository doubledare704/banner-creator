import os
import uuid
from flask import render_template, redirect, current_app, flash, request
from werkzeug.utils import secure_filename
from server.models import Image
from server.db import db
from server.utils.image import uploaded_file,image_delete,allowed_file,image_resize, image_rename, image_preview


def setup_routes(app):
    """Here we map routes to handlers."""
    app.add_url_rule('/', methods=['GET', 'POST'], view_func=index)
    app.add_url_rule('/uploads/<filename>', view_func=uploaded_file)
    app.add_url_rule('/delete/<int:id>', methods=['GET', 'POST'], view_func=image_delete)
    app.add_url_rule('/rename/<int:id>', methods=['GET', 'POST'], view_func=image_rename)
    app.add_url_rule('/editor/', view_func=editor)


imagenames = "BANNER Cretor"

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
            preview_name = 'preview_' + filename
            file = image_resize(file)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            preview_file = image_preview(file)
            preview_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], preview_name))
            title = request.form['title']
            image = Image(
                name=filename,
                title = title,
                preview = preview_name
            )
            db.session.add(image)

            return redirect(request.url)
    return render_template('list.html', images=images, imagenames=imagenames)


def editor():
    return render_template('editor.html')



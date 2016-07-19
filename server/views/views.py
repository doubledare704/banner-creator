import os
import uuid

from flask import render_template, redirect, current_app, flash, request, url_for, jsonify
from werkzeug.utils import secure_filename

from server.models import Image
from server.db import db
from server.utils.image import allowed_file,image_resize, image_preview




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

    list = [{'param': 'foo', 'val': 2},
            {'param': 'bar', 'val': 10}]
    results = jsonify(list)

    return render_template('list.html', images=images, all_img=results)


def image_delete(id):
    image = Image.query.get_or_404(id)
    image.active = False
    flash('File is deleted you are really brave person !')
    return redirect(url_for('index'))


def image_rename(id):
    image = Image.query.get_or_404(id)
    image.title = request.form['rename']
    flash('Image renamed')
    return redirect(url_for('index'))


def editor():
    return render_template('editor_markuped.html')


def background_images():
    background_images = Image.query.all()
    serialized_images = [{"id": image.id, "name": image.name, "title": image.title, "active": image.active}
                         for image in background_images]
    return jsonify({"backgroundImages": serialized_images})

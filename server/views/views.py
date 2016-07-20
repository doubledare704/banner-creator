import os
import uuid
import json

from flask import render_template, redirect, current_app, flash, request, url_for, jsonify
from werkzeug.utils import secure_filename

from server.models import Image
from server.db import db
from server.utils.image import allowed_file, image_resize, image_preview




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
            preview_name = 'preview_' + filename
            file = image_resize(file)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            preview_file = image_preview(file)
            preview_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], preview_name))
            title = request.form['title']
            image = Image(
                name=filename,
                title=title,
                preview=preview_name
            )
            db.session.add(image)

            return redirect(request.url)

    image_json = []
    for image in images:
        y = {'id':image.id,'url':'/uploads/'+image.name,'title':image.title,'preview':'/uploads/'+image.preview,'delete':'/delete/'+ str(image.id)}
        image_json.append(y)
    image_json = json.dumps(image_json)

    return render_template('list.html', images=images, image_json=image_json)


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


def background_images(page=1):
    paginated_images = Image.query.paginate(page, 4)
    serialized_images = [{"id": image.id, "name": image.name, "title": image.title, "active": image.active,
                          "preview": image.preview}
                         for image in paginated_images.items]
    return jsonify({"backgroundImages": serialized_images})

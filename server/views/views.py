import os
import uuid
import json

from flask import render_template, redirect, current_app, request, jsonify
from werkzeug.utils import secure_filename

from server.models import Image
from server.db import db
from server.utils.image import allowed_file,image_resize, image_preview


def index():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return json.dumps([{'message': 'No file part !'}])
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            return json.dumps([{'message': 'No selected file'}])
        if file and allowed_file(file.filename):
            filename = str(uuid.uuid1()).replace("-","") + '.' + secure_filename(file.filename).rsplit('.', 1)[1]
            preview_name = 'preview_' + filename
            preview_file = image_preview(file)
            original_file = image_resize(file)
            original_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            preview_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], preview_name))
            title = request.form['title']
            image = Image(
                name=filename,
                title = title,
                preview = preview_name
            )
            db.session.add(image)
            return redirect(request.url)

    images = Image.query.filter_by(active=True)
    image_json = json.dumps(
        [{'id':image.id,
          'url':'/uploads/'+image.name,
          'title':image.title,
          'preview':'/uploads/'+image.preview
          }
         for image in images
         ])

    return render_template('list.html', image_json=image_json)


def image_delete():
    img_id = request.json['id']
    image = Image.query.get_or_404(img_id)
    image.active = False
    return json.dumps([{'message': 'Image is Deleted !'}])


def image_rename():
    img_id = request.json['id']
    image = Image.query.get_or_404(img_id)
    image.title = request.json['name']
    return json.dumps([{'message': 'Image is Renamed !'}])


def editor():
    return render_template('editor_markuped.html')


def background_images():
    background_images = Image.query.all()
    serialized_images = [{"id": image.id, "name": image.name, "title": image.title, "active": image.active}
                         for image in background_images]
    return jsonify({"backgroundImages": serialized_images})




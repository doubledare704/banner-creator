import base64
import os
import uuid
import json

from flask_login import login_required
from io import BytesIO

from sqlalchemy import desc, asc
from werkzeug.datastructures import FileStorage
from flask import render_template, redirect, current_app, request, jsonify,url_for
from werkzeug.utils import secure_filename

from server.models import Image, Review, ImageHistory
from server.db import db
from server.utils.image import allowed_file, image_resize, image_preview


@login_required
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
            original_file = image_resize(file)
            original_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
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


@login_required
def image_delete():
    img_id = request.json['id']
    image = Image.query.get_or_404(img_id)
    image.active = False
    return json.dumps([{'message': 'Image is Deleted !'}])


@login_required
def image_rename():
    img_id = request.json['id']
    image = Image.query.get_or_404(img_id)
    image.title = request.json['title']
    return json.dumps([{'message': 'Image is Renamed !'}])


@login_required
def editor():
    return render_template('editor_markuped.html')


@login_required
def background_images(page=1):
    paginated_images = Image.query.paginate(page, 4)
    serialized_images = [{"id": image.id, "name": image.name, "title": image.title, "active": image.active,
                          "preview": image.preview}
                         for image in paginated_images.items]

    return jsonify({"backgroundImages": serialized_images})


def review():
    _, b64data = request.json['file'].split(',')
    random_name = request.json['name']
    decoded_data = base64.b64decode(b64data)
    file = FileStorage(BytesIO(decoded_data), filename=random_name)
    filename = secure_filename(file.filename)
    file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))

    rev = Review(
        name=filename
    )
    db.session.add(rev)
    db.session.flush()

    history = ImageHistory(
        review_image=rev.id,
        json_hist=request.json['file_json']
    )
    db.session.add(history)
    db.session.flush()
    review_jsoned = {
        "src": url_for('uploaded_file', filename=filename),
        "rev": history.review_image
    }
    return jsonify({'result': review_jsoned})


def continue_edit(history_image_id):
    edit = ImageHistory.query.filter_by(review_image=history_image_id).first_or_404()
    return render_template('editor_history.html', id_review=edit.review_image)


def history_image(history_image_id):
    if request.method == 'POST':
        hist_id = request.json['hist_id']
        new_history_json = request.method['jsn']
        history = ImageHistory(
            review_image=hist_id,
            json_hist=new_history_json
        )
        db.session.add(history)
        db.session.flush()

        return jsonify({'result': 'ok'})
    else:
        edit_history = ImageHistory.query.filter_by(
            review_image=history_image_id).order_by(asc(ImageHistory.created)).first_or_404()
        print(edit_history.json_hist)
        return jsonify({'fetch_history': edit_history.json_hist})

import base64
import datetime
import json
import os
import uuid
from io import BytesIO

from flask import (render_template, redirect, current_app, request, jsonify,
                   flash)
from flask_login import login_required, current_user
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from server.db import db
from server.forms import profile_form
from server.models import Banner, BannerReview, User, BackgroundImage
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
            filename = str(uuid.uuid1()).replace("-", "") + '.' + secure_filename(file.filename).rsplit('.', 1)[1]
            preview_name = 'preview_' + filename
            original_file = image_resize(file)
            original_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            preview_file = image_preview(file)
            preview_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], preview_name))
            title = request.form['title']
            image = BackgroundImage(
                name=filename,
                title=title,
                preview=preview_name
            )
            db.session.add(image)
            return redirect(request.url)

    images = BackgroundImage.query.filter_by(active=True)
    image_json = json.dumps(
        [{'id': image.id,
          'url': '/uploads/' + image.name,
          'title': image.title,
          'preview': '/uploads/' + image.preview
          }
         for image in images
         ])

    return render_template('list.html', image_json=image_json)


@login_required
def image_delete():
    img_id = request.json['id']
    image = BackgroundImage.query.get_or_404(img_id)
    image.active = False
    return json.dumps([{'message': 'Image is Deleted !'}])


@login_required
def image_rename():
    img_id = request.json['id']
    image = BackgroundImage.query.get_or_404(img_id)
    image.title = request.json['title']
    return json.dumps([{'message': 'Image is Renamed !'}])


@login_required
def review_tool():
    return render_template('review.html')


@login_required
def review_image(img_id):
    banner = Banner.query.get_or_404(img_id)
    image_url = '/uploads/' + banner.name
    return render_template('review.html', image_url=image_url, image_id=img_id)


@login_required
def review_action():
    form = request.form
    if 'file' not in request.form:
        return jsonify({'result': 'no field file in form'}), 406
    else:
        _, b64data = form['file'].split(',')
        name = str(uuid.uuid4()) + '.png'
        decoded_data = base64.b64decode(b64data)
        file_ = FileStorage(BytesIO(decoded_data), filename=name)
        filename = secure_filename(file_.filename)
        file_.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        preview_name = 'preview_' + filename
        preview_file = image_preview(file_)
        preview_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], preview_name))

        banner_review = BannerReview.query.get_or_404(form['id'])
        banner_review.designer_comment = form.get('comment', '')
        banner_review.reviewed = True
        banner_review.changed_at = datetime.datetime.utcnow()
        if form['status']:
            banner_review.status = form['status']
        banner_review.designer_imagename = filename
        banner_review.designer_previewname = preview_name

        return '', 200


@login_required
def user_profile():
    form = profile_form.ProfileForm()
    if form.validate_on_submit():
        user = User.query.get(current_user.id)
        user.query.update(form.data)
        db.session.commit()
        flash('Профиль изменен.')
    elif request.method == 'POST':
        flash('Профиль не изменен. Проверьте введенные данные.')
    return render_template('user/user_profile.html', form=form)

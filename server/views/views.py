import base64
import os
import uuid
import json
import datetime

from io import BytesIO
from flask import (render_template, redirect, current_app, request, jsonify,
                   flash, url_for)

from flask_login import login_required, current_user
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
from sqlalchemy import desc, asc

from server.db import db
from server import forms
from server.utils.image import allowed_file, image_resize, image_preview
from server.models import Image, ImageHistory, Banner, BannerReview, User


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
            image = Image(
                name=filename,
                title=title,
                preview=preview_name
            )
            db.session.add(image)
            return redirect(request.url)

    images = Image.query.filter_by(active=True)
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
    designers = User.query.filter_by(role=User.UserRole.designer)
    return render_template('editor_markuped.html', designers=designers)


@login_required
def background_images(page=1):
    paginated_images = Image.query.paginate(page, 4)
    serialized_images = [{"id": image.id, "name": image.name, "title": image.title, "active": image.active,
                          "preview": image.preview}
                         for image in paginated_images.items]

    return jsonify({"backgroundImages": serialized_images})


@login_required
def continue_edit(history_image_id):
    edit = ImageHistory.query.filter_by(review_image=history_image_id).first_or_404()
    return render_template('editor_history.html', id_review=edit.review_image)


@login_required
def history_image(history_image_id):
    if request.method == 'POST':
        hist_id = request.json['hist_id']
        new_history_json = request.json['jsn']
        history = ImageHistory(
            review_image=hist_id,
            json_hist=new_history_json
        )
        db.session.add(history)
        db.session.flush()

        return jsonify({'result': 'ok'})
    else:
        edit_history = ImageHistory.query.filter_by(
            review_image=history_image_id).order_by(desc(ImageHistory.created)).first_or_404()
        return jsonify({'fetch_history': edit_history.json_hist})


@login_required
def make_review():
    form = request.form
    _, b64data = form['file'].split(',')
    print(form)
    name = str(uuid.uuid4()) + '.png'
    decoded_data = base64.b64decode(b64data)
    file = FileStorage(BytesIO(decoded_data), filename=name)
    filename = secure_filename(file.filename)
    file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
    preview_name = 'preview_' + filename
    preview_file = image_preview(file)
    preview_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], preview_name))

    banner = Banner(
        name=filename,
        title=form.get('title', 'untitled'),
        preview=preview_name,
        user=current_user
    )
    db.session.add(banner)
    db.session.commit()

    designer = User.query.get(form['designer'])
    review = BannerReview(
        banner_id=banner.id,
        user=current_user,
        designer=designer,
        comment=form.get('comment', '')
    )
    db.session.expire_all()
    db.session.add(review)
    db.session.commit()

    history = ImageHistory(
        review_image=banner.id,
        json_hist=form['file_json']
    )
    db.session.add(history)
    # db.session.flush()
    review_jsoned = {
        "src": url_for('uploaded_file', filename=filename),
        "rev": history.review_image
    }
    return jsonify({'result': review_jsoned}), 201
    # return '', 201

@login_required
def review_tool():
    return render_template('review.html')

@login_required
def review_image(img_id):
    banner = Banner.query.get_or_404(img_id)
    image_url = '/uploads/'+ banner.name
    return render_template('review.html', image_url=image_url, image_id=img_id)

@login_required
def review_action():
    form = request.form
    _, b64data = form['file'].split(',')
    print(form)
    name = str(uuid.uuid4()) + '.png'
    decoded_data = base64.b64decode(b64data)
    file = FileStorage(BytesIO(decoded_data), filename=name)
    filename = secure_filename(file.filename)
    file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
    preview_name = 'preview_' + filename
    preview_file = image_preview(file)
    preview_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], preview_name))

    banner_review = BannerReview.query.get_or_404(form['id'])
    banner_review.designer_comment = form.get('comment', '')
    banner_review.reviewed = True
    banner_review.changed_at = datetime.datetime.utcnow()
    banner_review.status =form.get('status', '')
    banner_review.designer_imagename = filename
    banner_review.designer_previewname = preview_name

    return '', 200

@login_required
def cuts_background():
    return render_template('editor/cutbackground.html')


@login_required
def user_profile():
    form = forms.ProfileForm()
    if form.validate_on_submit():
        user = User.query.get(current_user.id)
        user.query.update(form.data)
        db.session.commit()
        flash('Профиль изменен')
    return render_template('user/user_profile.html', form=form)


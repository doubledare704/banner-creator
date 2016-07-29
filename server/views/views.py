import base64
import os
import uuid
import json
from io import BytesIO

from flask import render_template, redirect, current_app, request, jsonify,url_for

from flask_login import login_required, current_user
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
from sqlalchemy import desc, asc

from server.db import db
from server.utils.image import allowed_file, image_resize, image_preview
from server.models import Image, Review, ImageHistory, Banner, BannerReview, User


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
    name = str(uuid.uuid4()) + '.png'
    decoded_data = base64.b64decode(b64data)
    file = FileStorage(BytesIO(decoded_data), filename=name)
    filename = secure_filename(file.filename)
    file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))

    banner = Banner(
        name=filename,
        title=form.get('title', 'untitled'),
        user=current_user
    )
    db.session.add(banner)
    db.session.flush()

    designer = User.query.get(form['designer'])
    review = BannerReview(
        banner_id = banner.id,
        user=current_user,
        designer=designer,
        comment=form.get('comment', '')
    )
    db.session.add(review)
    db.session.flush()

    return '', 201


@login_required
def dashboard():
    if current_user.role == User.UserRole.user:
        reviews = BannerReview.query.filter_by(user_id=current_user.id).order_by(BannerReview.created_at.desc())
        return render_template('user/user_dashboard.html', reviews=reviews)
    elif current_user.role == User.UserRole.designer:
        reviews = BannerReview.query.filter_by(designer_id=current_user.id).order_by(BannerReview.created_at.desc())
        return render_template('user/designer_dashboard.html', reviews=reviews)

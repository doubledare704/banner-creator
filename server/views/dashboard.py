import json
import uuid
import os

from flask import render_template, request, redirect, current_app,url_for
from server.utils.image import allowed_file, image_resize, image_preview
from werkzeug.utils import secure_filename

from flask_login import current_user, login_required
from flask_paginate import Pagination

from server.models import User, BannerReview, Banner, BackgroundImage
from server.db import db

@login_required
def dashboard():
    page = int(request.args.get('page', 1))  # get page number from url query string
    if current_user.role == User.UserRole.user:
        reviews = BannerReview.query.filter_by(user_id=current_user.id).order_by(BannerReview.created_at.desc()
                                                                                 ).paginate(page=page, per_page=10)
        pagination = Pagination(per_page=10, page=page, total=reviews.total, css_framework='bootstrap3')
        return render_template('user/user_dashboard.html', reviews=reviews, pagination=pagination)
    elif current_user.role == User.UserRole.designer:
        reviews = BannerReview.query.filter_by(designer_id=current_user.id).order_by(BannerReview.created_at.desc()
                                                                                 ).paginate(page=page, per_page=10)
        pagination = Pagination(per_page=10, page=page, total=reviews.total, css_framework='bootstrap3')
        return render_template('user/designer_dashboard.html', reviews=reviews, pagination=pagination)


@login_required
def user_banners():
    page = int(request.args.get('page', 1))  # get page number from url query string
    banners = Banner.query.filter_by(user=current_user).paginate(page=page, per_page=10)
    return render_template('user/user_banners.html', banners=banners)

@login_required
def dashboard_images():
    # if request.method == 'POST':
    #     # check if the post request has the file part
    #     if 'file' not in request.files:
    #         return json.dumps([{'message': 'No file part !'}])
    #     file = request.files['file']
    #     # if user does not select file, browser also
    #     # submit a empty part without filename
    #     if file.filename == '':
    #         return json.dumps([{'message': 'No selected file'}])
    #     if file and allowed_file(file.filename):
    #         filename = str(uuid.uuid1()).replace("-", "") + '.' + secure_filename(file.filename).rsplit('.', 1)[1]
    #         preview_name = 'preview_' + filename
    #         original_file = image_resize(file)
    #         original_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
    #         preview_file = image_preview(file)
    #         preview_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], preview_name))
    #         title = request.form['title']
    #         image = BackgroundImage(
    #             name=filename,
    #             title=title,
    #             preview=preview_name
    #         )
    #         db.session.add(image)
    #         return redirect(request.url)

    images = BackgroundImage.query.filter_by(active=True)
    image_json = json.dumps(
        [{'id': image.id,
          'url': '/uploads/' + image.name,
          'title': image.title,
          'preview': '/uploads/' + image.preview
          }
         for image in images
         ])
    return render_template('user/dashboard_images.html', image_json=image_json)

def upload():

    uploaded_files = request.files.getlist("file[]")

    for file in uploaded_files:
        if file and allowed_file(file.filename):

            filename = str(uuid.uuid1()).replace("-", "") + '.' + secure_filename(file.filename).rsplit('.', 1)[1]
            preview_name = 'preview_' + filename
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            preview_file = image_preview(file)
            preview_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], preview_name))

            image = BackgroundImage(
                name=filename,
                title=file.filename,
                preview=preview_name
            )
            db.session.add(image)


    return redirect(url_for('dashboard_backrounds'))
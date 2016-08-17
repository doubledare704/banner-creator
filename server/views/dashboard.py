import json
import uuid
import os

from flask import render_template, request, redirect, current_app,url_for

import PIL
from flask_login import current_user, login_required
from flask_paginate import Pagination
from werkzeug.utils import secure_filename

from server.utils.image import allowed_file, image_preview
from server.models import User, BannerReview, Banner, BackgroundImage, Project
from server.db import db
from server.utils.auth import requires_roles


@login_required
def dashboard():
    page = int(request.args.get('page', 1))  # get page number from url query string
    if current_user.is_designer() or current_user.is_admin():
        reviews = BannerReview.query.filter_by(designer_id=current_user.id, reviewed=False, active=True
                                               ).order_by(BannerReview.created_at.desc()
                                               ).paginate(page=page, per_page=10)
        pagination = Pagination(per_page=10, page=page, total=reviews.total, css_framework='bootstrap3')
        return render_template('user/designer_dashboard.html', reviews=reviews, pagination=pagination)
    else:
        reviews = BannerReview.query.filter_by(user_id=current_user.id, active=True
                                               ).order_by(BannerReview.created_at.desc()
                                               ).paginate(page=page, per_page=10)
        pagination = Pagination(per_page=10, page=page, total=reviews.total, css_framework='bootstrap3')
        return render_template('user/user_dashboard.html', reviews=reviews, pagination=pagination)


@requires_roles('designer', 'admin')
def additional_reviews():
    page = int(request.args.get('page', 1))  # get page number from url query string
    reviews = BannerReview.query.filter_by(user_id=current_user.id, active=True
                                           ).order_by(BannerReview.created_at.desc()
                                           ).paginate(page=page, per_page=10)
    pagination = Pagination(per_page=10, page=page, total=reviews.total, css_framework='bootstrap3')
    return render_template('user/user_dashboard.html', reviews=reviews, pagination=pagination)


@login_required
def user_banners():
    page = int(request.args.get('page', 1))  # get page number from url query string
    title = request.args.get('title', '')
    banners = Banner.query.filter_by(user=current_user, active=True
                                     ).filter(Banner.title.contains(title)
                                     ).order_by(Banner.id.desc()
                                     ).paginate(page=page, per_page=10)
    pagination = Pagination(per_page=10, page=page, total=banners.total, css_framework='bootstrap3')
    return render_template('user/user_banners.html', banners=banners, pagination=pagination)


@login_required
def dashboard_backgrounds():
    images = BackgroundImage.query.filter_by(active=True)
    projects = Project.query.all()
    image_json = json.dumps(
        [{'id': image.id,
          'url': '/uploads/' + image.name,
          'title': image.title,
          'preview': '/uploads/' + image.preview
          }
         for image in images
         ])
    return render_template('user/dashboard_backgrounds.html', image_json=image_json, projects=projects)


@login_required
def upload():
    uploaded_files = request.files.getlist("file[]")
    project = request.form['project']
    project_prefix=Project.query.get(project).name
    for file in uploaded_files:
        if file and allowed_file(file.filename):

            filename = str(uuid.uuid1()).replace("-", "") + '.' + secure_filename(file.filename).rsplit('.', 1)[1]
            title = project_prefix + file.filename
            preview_name = 'preview_' + filename
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            preview_file = image_preview(file)
            preview_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], preview_name))

            width, height = PIL.Image.open(file).size  # get image size
            image = BackgroundImage(
                name=filename,
                title=title,
                preview=preview_name,
                project_id=project,
                width = width,
                height = height
            )
            db.session.add(image)

    return redirect(url_for('dashboard_backgrounds'))


@login_required
def dashboard_archive():
    page = int(request.args.get('page', 1))  # get page number from url query string
    if current_user.is_designer() or current_user.is_admin():
        reviews = BannerReview.query.filter_by(reviewed=True, designer_id=current_user.id
                                               ).paginate(page=page, per_page=10)
        pagination = Pagination(per_page=10, page=page, total=reviews.total, css_framework='bootstrap3')
        return render_template('user/dashboard_designer_archive.html', reviews=reviews, pagination=pagination)
    elif current_user.is_user():
        reviews = BannerReview.query.filter_by(active=False, user_id=current_user.id).paginate(page=page, per_page=10)
        pagination = Pagination(per_page=10, page=page, total=reviews.total, css_framework='bootstrap3')
        return render_template('user/dashboard_user_archive.html', reviews=reviews, pagination=pagination)


@login_required
def delete_review(review_id):
    user_reviews = BannerReview.query.filter_by(user_id=current_user.id)
    review = user_reviews.filter_by(id=review_id).first()
    review.active = False
    db.session.commit()
    return '', 204


@login_required
def delete_banner(banner_id):
    banner = Banner.query.get_or_404(banner_id)
    # check whether exist active reviews with this banner
    reviews = BannerReview.query.filter_by(banner_id=banner.id)
    # if there are such reviews then make them inactive
    if reviews.count():
        for review in reviews:
            review.active = False
    banner.active = False
    db.session.commit()
    return '', 204

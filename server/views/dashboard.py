import json
import uuid
import os
import shutil

from flask import render_template, request, redirect, current_app, url_for, jsonify
from flask.views import MethodView

import PIL
from flask_login import current_user, login_required
from flask_paginate import Pagination
from werkzeug.utils import secure_filename

from server.utils.image import allowed_file, image_preview
from server.models import User, BannerReview, Banner, BackgroundImage, Project, ImageHistory
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
                                     ).filter(Banner.title.ilike('%{}%'.format(title))
                                     ).order_by(Banner.id.desc()
                                     ).paginate(page=page, per_page=10)
    pagination = Pagination(per_page=10, page=page, total=banners.total, css_framework='bootstrap3')
    return render_template('user/user_banners.html', banners=banners, pagination=pagination)


@login_required
def dashboard_backgrounds():
    images = BackgroundImage.query.filter_by(active=True)
    projects_query = Project.query.all()
    projects = json.dumps(
        [{'id': project.id,
          'name': project.name
          }
         for project in projects_query])
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
    '''controller for uploading files. used in fileform in designer"s dashboard'''
    file = request.files['file']
    if file.filename == '':
        return json.dumps([{'message': 'No selected file'}]), 304
    project_id = request.form['project']
    project_prefix=Project.query.get(project_id).name

    if file and allowed_file(file.filename):
        filename = str(uuid.uuid1()).replace("-", "") + '.' + secure_filename(file.filename).rsplit('.', 1)[1]
        preview_name = 'preview_' + filename
        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        preview_file = image_preview(file)
        preview_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], preview_name))
        title = project_prefix + file.filename
        width, height = PIL.Image.open(file).size  # get image size
        image = BackgroundImage(
            name=filename,
            title=title,
            preview=preview_name,
            project_id=project_id,
            width = width,
            height = height
        )
        db.session.add(image)
        return json.dumps({'result': 'file saved'}), 200


@login_required
def dashboard_archive():
    page = int(request.args.get('page', 1))  # get page number from url query string
    if current_user.is_designer() or current_user.is_admin():
        reviews = BannerReview.query.filter_by(reviewed=True, designer_id=current_user.id
                                               ).order_by(BannerReview.created_at.desc()
                                               ).paginate(page=page, per_page=10)
        pagination = Pagination(per_page=10, page=page, total=reviews.total, css_framework='bootstrap3')
        return render_template('user/dashboard_designer_archive.html', reviews=reviews, pagination=pagination)
    elif current_user.is_user():
        reviews = BannerReview.query.filter_by(active=False, user_id=current_user.id
                                               ).order_by(BannerReview.created_at.desc()
                                               ).paginate(page=page, per_page=10)
        pagination = Pagination(per_page=10, page=page, total=reviews.total, css_framework='bootstrap3')
        return render_template('user/dashboard_user_archive.html', reviews=reviews, pagination=pagination)


@requires_roles('designer', 'admin')
def additional_dashboard_archive():
    page = int(request.args.get('page', 1))  # get page number from url query string
    reviews = BannerReview.query.filter_by(active=False, user_id=current_user.id
                                           ).order_by(BannerReview.created_at.desc()
                                           ).paginate(page=page, per_page=10)
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


@login_required
def copy_banner():
    banner_id = request.form.get('banner_id', 0)
    if banner_id:
        banner = Banner.query.get(banner_id)
        # copy banner files
        copy_banner_image = os.path.join(current_app.config['UPLOAD_FOLDER'], banner.name)
        copy_banner_image_preview = os.path.join(current_app.config['UPLOAD_FOLDER'], banner.preview)
        banner_name = secure_filename(str(uuid.uuid4()) + '.png')  # generate and normalize new filename
        banner_preview_name = 'preview_' + banner_name  # generate and normalize new preview filename

        shutil.copyfile(copy_banner_image, os.path.join(current_app.config['UPLOAD_FOLDER'], banner_name))
        shutil.copyfile(copy_banner_image_preview, os.path.join(current_app.config['UPLOAD_FOLDER'],
                                                                banner_preview_name))
        copy_banner_obj = Banner(
            title='Копия ' + banner.title,
            name=banner_name,
            preview=banner_preview_name,
            user=current_user,
            project_id=banner.project_id,

        )
        db.session.add(copy_banner_obj)
        db.session.commit()
        copy_image_history = ImageHistory.query.filter_by(
            review_image=banner.id).order_by(ImageHistory.created.desc()).first_or_404()
        image_history = ImageHistory(
            review_image=copy_banner_obj.id,
            json_hist=copy_image_history.json_hist
        )
        db.session.add(image_history)
        db.session.commit()
        return render_template('user/dashboard_copy_banner.html', banner=copy_banner_obj)
    return '', 400


class RenameBanner(MethodView):
    decorators = [login_required]

    def get(self):
        banner_id = request.args.get('id', 0)
        banner = Banner.query.filter_by(id=banner_id, user=current_user).first_or_404()
        return render_template('user/dashboard_rename_banner_form.html', banner=banner)

    def post(self):
        banner_id = request.form.get('banner_id', 0)
        banner_new_title = request.form.get('title', '')
        banner = Banner.query.filter_by(id=banner_id, user=current_user).first_or_404()
        banner.title = banner_new_title
        db.session.commit()
        return banner.title, 200

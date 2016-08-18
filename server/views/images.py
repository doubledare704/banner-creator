import base64
import datetime
import json
import os
import uuid
from io import BytesIO

from flask import (render_template, redirect, current_app, request, jsonify,)
from flask_login import login_required,current_user
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from server.db import db
from server.models import Banner, BannerReview, BackgroundImage
from server.utils.image import allowed_file, image_resize, image_preview


@login_required
def image_delete():
    '''function handles delete button click'''
    img_id = request.json['id']
    image = BackgroundImage.query.get_or_404(img_id)
    image.active = False
    return json.dumps([{'message': 'Image is Deleted !'}])


@login_required
def image_rename():
    '''function handles rename button click'''
    img_id = request.json['id']
    image = BackgroundImage.query.get_or_404(img_id)
    image.title = request.json['title']
    return json.dumps([{'message': 'Image is Renamed !'}])


@login_required
def review_tool():
    return render_template('images/review.html')


@login_required
def review_image(img_id):
    '''function for review tool for designers'''
    banner = Banner.query.get_or_404(img_id)

    image_url = '/uploads/' + banner.name
    return render_template('images/review.html', image_url=image_url, image_id=img_id)


@login_required
def review_action():
    '''handles the confirm action in review tool '''
    form = request.form
    banner_review = BannerReview.query.get_or_404(form['id'])
    banner_review.reviewed = True
    banner_review.changed_at = datetime.datetime.utcnow()
    banner_review.status = form['status']
    banner_review.comment_clouds = form['commentClouds']
    return '', 200


@login_required
def review_result(img_id):
    review = BannerReview.query.get_or_404(img_id)
    image_url = '/uploads/' + review.banner.name
    return render_template(
        'images/review_result.html',
        image_url=image_url,
        comments_json=review.comment_clouds
    )
import base64
import os
import uuid
from io import BytesIO

from flask import (render_template, current_app, request, jsonify,
                   url_for)
from flask_login import login_required, current_user
from sqlalchemy import desc
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from server.db import db
from server.models import Image, ImageHistory, Banner, BannerReview, User, BackgroundImage
from server.utils.image import image_preview


@login_required
def editor():
    designers = User.query.filter_by(role=User.UserRole.designer)
    return render_template('editor_markuped.html', designers=designers)


@login_required
def background_images(page=1):
    paginated_images = BackgroundImage.query.paginate(page, 4)
    serialized_images = [{"id": image.id, "name": image.name, "title": image.title, "active": image.active,
                          "preview": image.preview}
                         for image in paginated_images.items]

    return jsonify({"backgroundImages": serialized_images})


@login_required
def continue_edit(history_image_id):
    edit = ImageHistory.query.filter_by(review_image=history_image_id).first_or_404()
    designers = User.query.filter_by(role=User.UserRole.designer)
    return render_template('editor_history.html', id_review=edit.review_image, designers=designers)


@login_required
def history_image(history_image_id):
    if request.method == 'POST':
        if 'jsn' not in request.json:
            return jsonify({'result': 'no hist_id or jsn field'})
        else:
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
        if 'ids' in request.form:
            comment_to_review = 'Относится к прошлому баннеру /editor/' + form['ids'] + ' ' + form.get('comment', '')
        else:
            comment_to_review = form.get('comment', '')

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
            comment=comment_to_review
        )
        db.session.expire_all()
        db.session.add(review)
        db.session.commit()

        history = ImageHistory(
            review_image=banner.id,
            json_hist=form['file_json']
        )
        db.session.add(history)
        review_jsoned = {
            "src": url_for('uploaded_file', filename=filename),
            "rev": history.review_image
        }
        return jsonify({'result': review_jsoned}), 201


@login_required
def cuts_background():
    return render_template('editor/cutbackground.html')


@login_required
def save_cuted():
    if 'file' not in request.json:
        return jsonify({'result': 'no field file in form'}), 406
    else:
        _, b64data = request.json['file'].split(',')
        random_name = request.json['name']
        decoded_data = base64.b64decode(b64data)
        file_ = FileStorage(BytesIO(decoded_data), filename=random_name)
        filename = secure_filename(file_.filename)
        file_.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        preview_name = 'preview_' + filename
        preview_file = image_preview(file_)
        preview_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], preview_name))
        title = random_name

        img_cutted = Image(
            name=filename,
            title=title,
            preview=preview_name
        )
        db.session.add(img_cutted)
        db.session.flush()
        r = {
            'src': url_for('editor'),
            'file': url_for('uploaded_file', filename=filename)
        }
        return jsonify({'result': r}), 201


@login_required
def load_from_pc():
    if not request.files:
        return jsonify({'result': 'no field file in form'}), 406
    else:
        file_ = request.files['file']
        name = str(uuid.uuid4()) + '.png'
        preview_name = 'preview_' + name
        file_.save(os.path.join(current_app.config['UPLOAD_FOLDER'], name))
        preview_file = image_preview(file_)
        preview_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], preview_name))

        img_cutted = Image(
            name=name,
            title=name[:9],
            preview=preview_name
        )
        db.session.add(img_cutted)
        db.session.flush()

        review_jsoned = {
            "src": url_for('uploaded_file', filename=name)
        }

        return jsonify({'result': review_jsoned}), 201


@login_required
def load_all_cuts():
    allimages = Image.query.all()
    cut_jsoned = []
    for img in allimages:
        cut_jsoned.append({
            'url': url_for('uploaded_file', filename=img.name),
            'preview': url_for('uploaded_file', filename=img.preview)
        })

    return jsonify({'result': cut_jsoned}), 201

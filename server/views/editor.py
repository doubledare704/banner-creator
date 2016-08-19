import base64
import json
import os
import uuid
from io import BytesIO

from flask import (render_template, current_app, request, jsonify,
                   url_for)
from flask.views import MethodView
from flask_login import login_required, current_user
from sqlalchemy import desc, asc
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from server.db import db
from server.models import Image, ImageHistory, Banner, BannerReview, User, BackgroundImage, Project, Header, Font
from server.utils.image import image_preview


@login_required
def editor():
    proj_id = request.args.get('project_id')
    current_project = Project.query.get_or_404(proj_id)
    button = current_project.button
    if button:
        button_url = url_for('uploaded_file', filename=button)
    else:
        button_url = ''
    fonts = Header.query.filter_by(
        project_id=proj_id).order_by(asc(Header.name)).join(Font).add_columns(Font.name, Header.size).all()
    return render_template('editor_markuped.html', p_id=proj_id, project=current_project, fonts=fonts,
                           button=button_url)


@login_required
def background_images():
    page = int(request.args.get('page', 1))
    project_id = int(request.args.get('project', 0))
    paginated_images = BackgroundImage.query.filter_by(project_id=project_id, active=True).paginate(page, 4)
    serialized_images = [{"id": image.id, "name": image.name, "title": image.title, "active": image.active,
                          "preview": image.preview, "width": image.width, "height": image.height}
                         for image in paginated_images.items]

    return jsonify({"backgroundImages": serialized_images})


@login_required
def continue_edit(history_image_id):
    proj_id = request.args.get('project_id')
    current_project = Project.query.get_or_404(proj_id)
    edit = ImageHistory.query.filter_by(review_image=history_image_id).first_or_404()
    return render_template('editor_history.html', p_id=proj_id, id_review=edit.review_image,
                           project=current_project)


@login_required
def history_image(history_image_id):
    if request.method == 'POST':
        if 'jsn' not in request.json:
            return jsonify({'result': 'no hist_id or jsn field'})
        else:
            hist_id = request.json['hist_id']
            banner = Banner.query.get_or_404(hist_id)
            new_history_json = request.json['jsn']
            history = ImageHistory(
                review_image=hist_id,
                json_hist=new_history_json
            )
            _, b64data = request.json['image'].split(',')
            decoded_data = base64.b64decode(b64data)
            file_ = FileStorage(BytesIO(decoded_data), filename=banner.name)
            file_.save(os.path.join(current_app.config['UPLOAD_FOLDER'], file_.filename))
            preview_name = 'preview_' + file_.filename
            preview_file = image_preview(file_)
            preview_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], preview_name))
            db.session.add(history)
            db.session.flush()

            return '', 200
    else:
        edit_history = ImageHistory.query.filter_by(
            review_image=history_image_id).order_by(desc(ImageHistory.created)).first_or_404()
        return jsonify(fetch_history=edit_history.json_hist, banner_title=edit_history.parent.title)


@login_required
def cuts_background():
    return render_template('editor/cutbackground.html')


@login_required
def save_cuted():
    if 'file' and 'u_id' not in request.json:
        return jsonify({'result': 'no field file in form'}), 404
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

        user = User.query.get_or_404(request.json['u_id'])

        img_cutted = Image(
            user_id=user.id,
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
        return jsonify({'result': 'no field file in form'}), 404
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
    allimages = Image.query.filter_by(user_id=current_user.id)
    cut_jsoned = []
    for img in allimages:
        cut_jsoned.append({
            'url': url_for('uploaded_file', filename=img.name),
            'preview': url_for('uploaded_file', filename=img.preview)
        })

    return jsonify({'result': cut_jsoned}), 201


class ReviewView(MethodView):
    decorators = [login_required]

    def get(self):
        designers = User.query.filter(User.role.in_(['admin', 'designer'])).filter(User.id != current_user.id)
        return render_template('editor/review_modal.html', designers=designers)

    def post(self):
        form = request.form
        if 'file' not in request.form:
            return jsonify({'result': 'no field file in form'}), 404
        else:
            banner_id = form.get('banner_id', 0)
            _, b64data = form['file'].split(',')
            p_id = form['project']
            name = str(uuid.uuid4()) + '.png'
            decoded_data = base64.b64decode(b64data)
            file_ = FileStorage(BytesIO(decoded_data), filename=name)
            filename = secure_filename(file_.filename)
            file_.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            preview_name = 'preview_' + filename
            preview_file = image_preview(file_)
            preview_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], preview_name))
            if 'ids' in request.form:
                comment_to_review = 'Относится к прошлому баннеру /editor/' + form['ids'] + ' ' + form.get('comment',
                                                                                                           '')
            else:
                comment_to_review = form.get('comment', '')

            if not banner_id:
                banner = Banner(
                    name=filename,
                    project_id=p_id,
                    title=form.get('title', 'untitled'),
                    preview=preview_name,
                    user=current_user
                )
                db.session.add(banner)
            else:
                banner = Banner.query.get_or_404(banner_id)
                # delete old banner from file system
                os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], banner.name))
                os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], banner.preview))
                # update banner object
                banner.name = filename
                banner.preview = preview_name
                banner.title = form.get('title', 'untitled')
                BannerReview.query.filter_by(banner_id=banner_id).delete()

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
                json_hist=json.loads(form['file_json'])
            )
            db.session.add(history)
            review_jsoned = {
                "src": url_for('uploaded_file', filename=filename),
                "rev": history.review_image,
                "url": url_for('editor')
            }
            return jsonify({'result': review_jsoned}), 201

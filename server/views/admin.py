import json
import uuid

import os

from werkzeug.exceptions import Forbidden, BadRequest, UnprocessableEntity
from werkzeug.utils import secure_filename

from server.forms.create_project_form import CreateProjectForm
from server.forms.font_upload_form import FontUploadForm
from server.forms.user_edit_form import UserEditForm, USER_ROLES
from flask_login import current_user

from flask import render_template, json, request, current_app, url_for, redirect
from flask_paginate import Pagination
from werkzeug.exceptions import NotFound

from server.db import db
from server.models import User, BackgroundImage, Project, Font, Header
from server.utils.auth import requires_roles

PER_PAGE = 10


@requires_roles('admin', 'designer')
def admin():
    if current_user.is_admin():
        return redirect(url_for('admin_users'))
    if current_user.is_designer:
        return redirect(url_for('default_project_page'))


@requires_roles('admin')
def users_page():
    query_db = User.query

    search_query = request.args.get('search', None)
    search = bool(search_query)

    if search:
        query_db = query_db.filter((User.first_name.contains(search_query))
                                   | (User.last_name.contains(search_query))
                                   | (User.email.contains(search_query))).order_by(User.active.desc())
    else:
        query_db = query_db.filter_by(active=True)

    query_db = query_db.order_by(User.created_at.desc())

    users_paginator = query_db.paginate(per_page=PER_PAGE)

    users_list = []
    for user in users_paginator.items:
        users_map = {'id': user.id,
                     'first_name': user.first_name,
                     'last_name': user.last_name,
                     'email': user.email,
                     'role': user.role.name,
                     'registration_date': user.created_at.isoformat(),
                     'auth_by': user.social_type.name,
                     'active': user.active
                     }
        if user.gender:
            users_map['gender'] = user.gender.name
        users_list.append(users_map)

    pagination = Pagination(per_page=PER_PAGE, page=users_paginator.page, total=users_paginator.total, search=search,
                            record_name='users', css_framework='bootstrap3', found=users_paginator.total)

    roles_list = json.dumps(USER_ROLES)

    return render_template('admin/users.html',
                           users_list=json.dumps(users_list),
                           pagination=pagination,
                           search_query=search_query,
                           roles_list=roles_list
                           )


@requires_roles('admin')
def change_user(user_id):
    form = UserEditForm()
    if not form.validate_on_submit():
        raise BadRequest()
    user = User.query.get_or_404(user_id)
    user.first_name = form.first_name.data
    user.last_name = form.last_name.data
    user.role = form.role.data

    db.session.add(user)
    db.session.commit()
    return json.jsonify({'id': user.id,
                         'first_name': user.first_name,
                         'last_name': user.last_name,
                         'email': user.email,
                         'gender': user.gender.name,
                         'role': user.role.name,
                         'registration_date': user.created_at.isoformat(),
                         'auth_by': user.social_type.name,
                         'active': user.active
                         })


@requires_roles('admin')
def remove_user(user_id):
    user = User.query.get_or_404(user_id)
    if user == current_user:
        raise Forbidden()
    user.active = False
    db.session.add(user)
    db.session.commit()
    return 'OK', 200


@requires_roles('admin')
def activate_user(user_id):
    user = User.query.get_or_404(user_id)
    user.active = True
    db.session.add(user)
    db.session.commit()
    return 'OK', 200


@requires_roles('admin')
def backgrounds():
    tab = request.args.get('tab')
    background_images = BackgroundImage.query.filter(BackgroundImage.active == (tab == 'active')).order_by(
        BackgroundImage.title.asc())

    try:
        backgrounds_paginator = background_images.paginate(per_page=PER_PAGE, error_out=True)
    except NotFound:
        last_page = round(background_images.count() / PER_PAGE)
        return redirect(url_for('admin_backgrounds', tab=tab, page=last_page))

    background_images = [
        {
            "id": background.id,
            'title': background.title,
            'preview': '/uploads/' + background.preview,
            "active": background.active
        } for background in backgrounds_paginator.items
        ]

    pagination = Pagination(per_page=PER_PAGE, page=backgrounds_paginator.page, total=backgrounds_paginator.total,
                            css_framework='bootstrap3')

    background_images = json.dumps(background_images)

    return render_template('admin/backgrounds.html', backgrounds=background_images, pagination=pagination, tab=tab)


@requires_roles('admin')
def inactivate_image(image_id):
    image = BackgroundImage.query.get_or_404(image_id)
    image.active = False
    db.session.add(image)
    db.session.commit()
    return '', 200


@requires_roles('admin')
def activate_image(image_id):
    image = BackgroundImage.query.get_or_404(image_id)
    image.active = True
    db.session.add(image)
    db.session.commit()
    return '', 200


@requires_roles('admin', 'designer')
def default_project_page():
    return render_template('admin/projects/projects_default.html')


@requires_roles('admin')
def create_project():
    form = CreateProjectForm()
    if not form.validate_on_submit():
        raise BadRequest()
    project = Project(name=form.project_name.data)
    db.session.add(project)
    db.session.commit()
    return redirect(url_for('admin_project_page', project_id=project.id))


@requires_roles('admin', 'designer')
def project_page(project_id):
    tab = request.args.get('tab', 'fonts')
    project = Project.query.get_or_404(project_id)

    if tab == 'fonts':
        project_fonts = [font.name for font in project.fonts]
        return render_template('admin/projects/fonts.html', project=project, fonts=json.dumps(project_fonts))

    # TODO optimize queries to db: non-lazy load, limit
    elif tab == 'headers':
        project_fonts = [[font.name, font.id] for font in project.fonts]
        project_headers = {
            header.name: {
                'id': header.id,
                'font_name': header.font.name,
                'font_id': header.font.id,
                'size': header.size
            } for header in project.headers}
        return render_template('admin/projects/headers.html', project=project, fonts=json.dumps(project_fonts),
                               headers=json.dumps(project_headers))
    elif tab == 'background':
        image_json = [{'id': image.id,
                       'url': '/uploads/' + image.name,
                       'title': image.title,
                       'preview': '/uploads/' + image.preview
                       } for image in project.background_images if image.active]
        return render_template('admin/projects/backgrounds.html', project=project, image_json=json.dumps(image_json))
    elif tab == 'button':
        return render_template('admin/projects/button.html', project=project)


@requires_roles('admin', 'designer')
def add_font(project_id):
    project = Project.query.get_or_404(project_id)
    form = FontUploadForm()
    if not form.validate_on_submit():
        raise BadRequest()
    name = form.font_name.data
    if Font.query.filter_by(name=name, project_id=project_id).first():
        raise UnprocessableEntity
    file = form.font_file.data
    _, extension = os.path.splitext(file.filename)
    filename = "%s_%s" % (project.name, secure_filename(name + extension))
    file.save(os.path.join(current_app.config['FONT_FOLDER'], filename))
    db.session.add(Font(name=name, project_id=project_id, filename=filename))
    db.session.commit()
    return redirect(url_for('admin_project_page', project_id=project_id))


@requires_roles('admin', 'designer')
def change_headers(project_id):
    project = Project.query.get_or_404(project_id)
    new_headers = request.json

    # existing headers
    for header in project.headers:
        new_header = new_headers[header.name]
        header.font_id = new_header['font_id']  # not valid
        header.size = new_header['size']
        db.session.add(header)

    # new headers
    for name, header in new_headers.items():
        if not header.get('id', None):
            db.session.add(Header(name=name, font_id=header['font_id'], size=header['size'], project_id=project_id))
    db.session.commit()
    return 'OK', 200


@requires_roles('admin', 'designer')
def change_project_button(project_id):
    project = Project.query.get_or_404(project_id)
    if 'button_file' not in request.files:
        raise BadRequest()
    file = request.files['button_file']
    if file.filename == '':
        raise BadRequest()
    _, extension = os.path.splitext(file.filename)
    if file and extension == ".png":
        filename = str(uuid.uuid1()).replace("-", "") + '.' + secure_filename(file.filename).rsplit('.', 1)[1]
        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        project.button = filename
        db.session.add(project)
    return redirect(url_for('admin_project_page', project_id=project.id, tab='button'))


@requires_roles('admin', 'designer')
def remove_project_button(project_id):
    project = Project.query.get_or_404(project_id)
    project.button = None
    db.session.add(project)
    return 'OK', 200


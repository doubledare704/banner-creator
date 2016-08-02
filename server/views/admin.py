import json

from flask_paginate import Pagination
from werkzeug.exceptions import Forbidden, BadRequest

from server.forms.user_edit_form import UserEditForm
from server.models import Image, User
from flask import render_template, json, request, current_app
from flask_login import current_user, login_required

from server.db import db
import os


def admin():
    return render_template('admin/admin.html')


@login_required
def users_page():
    query_db = User.query

    search_query = request.args.get('search', None)
    search = bool(search_query)

    if search:
        query_db = query_db.filter((User.first_name.contains(search_query))
                                   | (User.last_name.contains(search_query))
                                   | (User.email.contains(search_query)))

    query_db = query_db.filter_by(active=request.args.get('active', True)).order_by(User.created_at.desc())

    users_paginator = query_db.paginate(per_page=10)
    users_list = ([{'id': user.id,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'gender': user.gender.name,
                    'role': user.role.name,
                    'registration_date': user.created_at.isoformat(),
                    'auth_by': user.social_type.name
                    }
                   for user in users_paginator.items])

    pagination = Pagination(per_page=10, page=users_paginator.page, total=users_paginator.total, search=search,
                            record_name='users', css_framework='bootstrap3', found=users_paginator.total)

    roles_list = json.dumps([role.name for role in User.UserRole])

    return render_template('admin/users.html',
                           users_list=json.dumps(users_list),
                           pagination=pagination,
                           search_query=search_query,
                           roles_list=roles_list
                           )


@login_required
def change_user(user_id):
    form = UserEditForm()
    if form.validate_on_submit():
        db.session.query(User).filter(User.id == user_id).update(form.data)
        user = User.query.get_or_404(user_id)
        return json.jsonify({'id': user.id,
                             'first_name': user.first_name,
                             'last_name': user.last_name,
                             'email': user.email,
                             'gender': user.gender.name,
                             'role': user.role.name,
                             'registration_date': user.created_at.isoformat(),
                             'auth_by': user.social_type.name
                             })
    raise BadRequest()


@login_required
def remove_user(user_id):
    user = User.query.get_or_404(user_id)
    if user == current_user:
        raise Forbidden()
    user.active = False
    db.session.add(user)
    db.session.commit()
    return 'OK', 200


def backgrounds():
    query = Image.query.order_by(Image.name.asc())

    backgrounds = [
        {
           "id": background.id,
           'title': background.title,
           'preview': '/uploads/' + background.preview,
           "active": background.active
        } for background in query.all()
    ]

    backgrounds = json.dumps(backgrounds)

    return render_template('admin/backgrounds.html', backgrounds=backgrounds)


def inactivate_image(id):
    image = Image.query.get_or_404(id)
    image.active = False
    return '', 200


def image_delete_from_DB(id):
    image = Image.query.get_or_404(id)
    os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], image.name))
    os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], image.preview))
    db.session.delete(image)
    db.session.commit()
    return '', 204


def activate_image(id):
    image = Image.query.get_or_404(id)
    image.active = True
    return '', 200

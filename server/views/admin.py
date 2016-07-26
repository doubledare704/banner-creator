import json

import decimal

import datetime

from flask import render_template, jsonify, request
from flask_paginate import Pagination

from server.models import Image, User
from server.db import db
from server.utils.admin import date_serialize


def admin():
    return render_template('admin/admin.html')


def users_page():
    q = request.args.get('search')
    search = (True if q else False)

    users_paginator = User.query.order_by(User.created_at.desc()).paginate(per_page=10)
    users_list = ([{'id': user.id,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'gender': user.gender.name,
                    'role': user.role.name,
                    'registration_date': date_serialize(user.created_at),
                    'auth_by': user.social_type.name
                    }
                   for user in users_paginator.items])

    pagination = Pagination(per_page=10, page=users_paginator.page, total=users_paginator.total, search=search,
                            record_name='users', css_framework='foundation', found=users_paginator.total)

    return render_template('admin/users.html',
                           users_list=json.dumps(users_list),
                           pagination=pagination
                           )


def remove_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return 'OK', 200


def alchemyencoder(obj):
    """JSON encoder function for SQLAlchemy special classes."""
    if isinstance(obj, datetime.date):
        return obj.isoformat()
    elif isinstance(obj, decimal.Decimal):
        return float(obj)


def backgrounds():
    act_backgrounds = Image.query.filter(Image.active == 't').order_by(Image.name.asc()).all()
    del_backgrounds = Image.query.filter(Image.active == 'f').order_by(Image.name.asc()).all()
    return render_template('admin/backgrounds.html', act_backgrounds=act_backgrounds, del_backgrounds=del_backgrounds)


def inactiveImg(id):
    image = Image.query.get_or_404(id)
    image.active = False
    return '', 200


def image_delete_from_DB(id):
    image = Image.query.get_or_404(id)
    db.session.delete(image)
    db.session.commit()
    return '', 204

import json

import decimal

import datetime

from flask import render_template, jsonify
from flask_login import login_required

from server.models import Image, User
from server.db import db
from server.utils.admin import get_users


def admin():
    return render_template('admin/admin.html')


def users_page():
    users_list = get_users()
    return render_template('admin/users.html', users_list=json.dumps(users_list))


def remove_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return 'OK', 200


def users_json():
    return jsonify(get_users())


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

from flask import render_template
from server.models import Image
from server.db import db


def admin():
    return render_template('admin/admin.html')


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

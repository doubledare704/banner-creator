from flask import render_template,json,flash
from server.models import Image
from server.db import db


def admin():
    return render_template('admin/admin.html')


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


def inactiveImg(id):
    image = Image.query.get_or_404(id)
    image.active = False
    return '', 200


def image_delete_from_DB(id):
    image = Image.query.get_or_404(id)
    db.session.delete(image)
    db.session.commit()
    return '', 204

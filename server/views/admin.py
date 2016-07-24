from flask import render_template,json,flash
from server.models import Image
from server.db import db


def admin():
    return render_template('admin/admin.html')


def backgrounds():
    backgrounds = Image.query.order_by(Image.name.asc()).all()

    back_im = [{
                   "id": act_background.id,
                   'title': act_background.title,
                   'preview': '/uploads/' + act_background.preview,
                   "active": str(act_background.active)
               }
               for act_background in backgrounds]

    back_im = json.dumps(back_im)

    return render_template('admin/backgrounds.html', back_im=back_im)


def inactiveImg(id):
    image = Image.query.get_or_404(id)
    image.active = False
    return '', 200


def image_delete_from_DB(id):
    image = Image.query.get_or_404(id)
    db.session.delete(image)
    db.session.commit()
    return '', 204

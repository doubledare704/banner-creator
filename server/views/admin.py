from flask import render_template, json, flash
from server.models import Image, Review
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


def inactivate_image(id):
    image = Image.query.get_or_404(id)
    image.active = False
    return '', 200


def image_delete_from_DB(id):
    image = Image.query.get_or_404(id)
    db.session.delete(image)
    db.session.commit()
    return '', 204


def activate_image(id):
    image = Image.query.get_or_404(id)
    image.active = True
    return '', 200


def review_images():
    banners = Review.query.order_by(Review.id.asc())

    images = []
    for banner in banners:
        images.append({
            'source': '/uploads/' + banner.name
        })
    images = json.dumps(images)
    return render_template('admin/resultimages.html', images=images)

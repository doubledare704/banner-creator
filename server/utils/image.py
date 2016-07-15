import os
from flask import request,redirect, url_for, current_app, flash, send_from_directory
from PIL import Image as pil
from server.models import Image


def allowed_file(filename):
    if not filename:
        return False
    name, extension = os.path.splitext(filename)
    return extension in current_app.config['ALLOWED_EXTENSIONS']


def uploaded_file(filename):
    return send_from_directory(
        current_app.config['UPLOAD_FOLDER'], filename
    )


def image_resize(file):
    width, height = request.form['width'], request.form['height']
    if len(width) == 0 and len(height) == 0:
        return file
    width = int(request.form['width'])
    height = int(request.form['height'])

    try:
        image = pil.open(file)
        size = width, height
        image = image.resize(size, pil.ANTIALIAS)
        if image.mode == 'RGBA':
            bg = pil.new(mode='RGBA', size=image.size, color=(255, 255, 255, 0))
            bg.paste(image, image)
            image = bg
        return image
    except IOError as e:
        print(e.errno)
        print(e)
        print("Can not resize image ")


def image_delete(id):
    image = Image.query.get_or_404(id)
    image.active = False
    flash('File is deleted you are really brave person !')
    return redirect(url_for('index'))

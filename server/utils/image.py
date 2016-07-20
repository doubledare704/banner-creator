import os
from flask import request, current_app, send_from_directory
from PIL import Image as pil
from math import ceil


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


def image_preview(file, position=('center', 'center'), fill='contain'):

    try:
        image = pil.open(file)
        owidth = image.size[0]
        oheight = image.size[1]
        print(owidth, oheight, type(owidth), type(oheight))
        width = 250
        height = (width/owidth)*oheight
        wr, hr = 1.0*width/owidth, 1.0*height/oheight
        size = owidth, oheight
        x, y = position
        # back = Image.new('RGBA', (width, height), (125, 125, 125, 0))
        if fill == 'cover':
            if wr < hr:
                size = owidth*height/oheight, height
            else:
                size = width, oheight*width/owidth
        else:
            if wr > hr:
                size = owidth*height/oheight, height
            else:
                size = width, oheight*width/owidth

        if x == 'center':
            x = (size[0] - width) / 2
        elif x == 'right':
            x = size[0] - width
        else:
            x = 0

        if y == 'center':
            y = (size[1] - height) / 2
        elif y == 'bottom':
            y = size[1] - height
        else:
            y = 0
        size = ceil(size[0]),ceil(size[1])
        image = image.resize(size, pil.ANTIALIAS)
        image = image.crop((x, y, x+width, y+height))
        return image

    except IOError as e:
        print(e.errno)
        print(e)
        print("Can not resize image ")

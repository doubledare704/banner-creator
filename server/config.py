import os

basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG = False
UPLOAD_FOLDER = os.path.join(basedir, 'media')
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])



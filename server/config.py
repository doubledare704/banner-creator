import os

basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG = False
UPLOAD_FOLDER = os.path.join(basedir, 'media')
ALLOWED_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif')

SQLALCHEMY_COMMIT_ON_TEARDOWN = True

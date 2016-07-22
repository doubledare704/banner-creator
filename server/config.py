import os

basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG = True

UPLOAD_FOLDER = os.path.join(basedir, 'media')
ALLOWED_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif')
SQLALCHEMY_COMMIT_ON_TEARDOWN = True

SQLALCHEMY_COMMIT_ON_TEARDOWN = True
FLASK_SECRET_KEY = 'super secret key'
FLASK_SESSION_TYPE = 'filesystem'
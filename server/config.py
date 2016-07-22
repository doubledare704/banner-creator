import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Set debug to False in production
DEBUG = True

# Settings for uploading images
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'media')
ALLOWED_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif')

# Database settings
SQLALCHEMY_COMMIT_ON_TEARDOWN = True
SQLALCHEMY_TRACK_MODIFICATIONS = True

# Sessions' settings
FLASK_SESSION_TYPE = 'filesystem'


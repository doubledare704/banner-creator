import os
import logging

CUR_DIR = os.path.abspath(os.path.dirname(__file__))  # directory with config files
BASE_DIR = os.path.abspath(os.path.dirname(CUR_DIR))  # server directory

# Set debug to False in production
DEBUG = True
WTF_CSRF_CHECK_DEFAULT = False
WTF_CSRF_ENABLED = False

# Settings for uploading images
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'media')
ALLOWED_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif')

# Database settings
SQLALCHEMY_COMMIT_ON_TEARDOWN = True
SQLALCHEMY_TRACK_MODIFICATIONS = True

# Sessions' settings
FLASK_SESSION_TYPE = 'filesystem'

# logging settings
LOGGING_FORMAT = '%(levelname)s - %(asctime)s - %(message)s [module: %(module)s, function: %(funcName)s]'
LOGGING_LOCATION = 'logs/banner.log'
LOGGING_LEVEL = logging.WARNING
LOGGING_FILE_SIZE = 1 * 1024 * 1024  # 1 MB

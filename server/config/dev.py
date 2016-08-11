import os

CUR_DIR = os.path.abspath(os.path.dirname(__file__))  # directory with config files
BASE_DIR = os.path.abspath(os.path.dirname(CUR_DIR))  # server directory

UPLOAD_FOLDER = os.path.join(BASE_DIR, 'media')


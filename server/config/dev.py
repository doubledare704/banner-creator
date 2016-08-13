import os
import logging

DEBUG = True
LOGGING_LEVEL = logging.DEBUG

CUR_DIR = os.path.abspath(os.path.dirname(__file__))  # directory with config files
BASE_DIR = os.path.abspath(os.path.dirname(CUR_DIR))  # server directory

STORAGE_DIR = os.path.join(BASE_DIR, 'media')

# UPLOAD_FOLDER = os.path.join(STORAGE_DIR, 'media')
UPLOAD_FOLDER = os.path.join(STORAGE_DIR)
FONT_FOLDER = os.path.join(STORAGE_DIR, 'fonts')

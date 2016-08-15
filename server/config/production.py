import os
import logging

DEBUG = False
LOGGING_LEVEL = logging.ERROR

STORAGE_DIR = '/storage'  # directory of storage with user's files

UPLOAD_FOLDER = os.path.join(STORAGE_DIR, 'media')
FONT_FOLDER = UPLOAD_FOLDER

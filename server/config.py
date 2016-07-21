import os

basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG = False
UPLOAD_FOLDER = os.path.join(basedir, 'media')
ALLOWED_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif')

SQLALCHEMY_COMMIT_ON_TEARDOWN = True
SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://postgres@localhost:5433/banner_creator'
SQLALCHEMY_TEST_DATABASE_URI = 'postgresql+psycopg2://postgres@localhost:5433/banner_creator_tests'

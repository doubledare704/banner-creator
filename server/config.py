import os

basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG = True

UPLOAD_FOLDER = os.path.join(basedir, 'media')
ALLOWED_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif')
FLASK_SESSION_TYPE = 'filesystem'
FLASK_SECRET_KEY = 'super secret key'

GOOGLE_ID = "484099415435-1vf1lcsr3nlrjvtfa3esb3lf9ke3nhua.apps.googleusercontent.com"
GOOGLE_SECRET = "XfU0t6lBbfve7abq5wY9V3yJ"
GOOGLE_BASE_URL = "https://www.googleapis.com/oauth2/v1/"
GOOGLE_ACCESS_TOKEN_METHOD = 'POST'
GOOGLE_ACCESS_TOKEN_URL = 'https://accounts.google.com/o/oauth2/token'
GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/auth'

FACEBOOK_APP_ID = '981604035270534'
FACEBOOK_APP_SECRET = '28dccfd8a82acf58137926fd338f9e7d'
FACEBOOK_BASE_URL = "https://graph.facebook.com"
FACEBOOK_ACCESS_TOKEN_METHOD = 'GET'
FACEBOOK_ACCESS_TOKEN_URL = '/oauth/access_token'
FACEBOOK_AUTHORIZE_URL = 'https://www.facebook.com/dialog/oauth'

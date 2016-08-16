import logging

WTF_CSRF_CHECK_DEFAULT = True
WTF_CSRF_ENABLED = True

# Settings for uploading images
ALLOWED_IMAGES_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif')
ALLOWED_FONTS_EXTENSIONS = ('.ttf', '.otf', '.woff', '.woff2', '.svg')

# Database settings
SQLALCHEMY_COMMIT_ON_TEARDOWN = True
SQLALCHEMY_TRACK_MODIFICATIONS = True

# Sessions' settings
FLASK_SESSION_TYPE = 'filesystem'

# logging settings
LOGGING_FORMAT = '%(levelname)s - %(asctime)s - %(message)s [module: %(module)s, function: %(funcName)s]'
LOGGING_LEVEL = logging.WARNING

# i18n
BABEL_DEFAULT_LOCALE = 'ru'
BABEL_DEFAULT_TIMEZONE = 'Europe/Kiev'

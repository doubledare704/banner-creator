from flask_oauthlib.client import OAuth
from flask_oauthlib.contrib.apps import facebook as facebook_app
from flask_oauthlib.contrib.apps import google as google_app

from server.models import User

app = OAuth()

facebook_data = {
    'fetch_query': '/me?fields=email,id,first_name,last_name,gender',
    'oauth': facebook_app.register_to(app, app_key='FACEBOOK_OAUTH_PARAMS'),
    'custom_fields': {
        'first_name': 'first_name',
        'last_name': 'last_name'
    }
}

google_data = {
    'fetch_query': 'userinfo',
    'oauth': google_app.register_to(app, app_key='GOOGLE_OAUTH_PARAMS'),
    'custom_fields': {
        'first_name': 'given_name',
        'last_name': 'family_name'
    }
}

oauth_apps = {
    'facebook': facebook_data,
    'google': google_data
}


def load_user(user_id):
    return User.query.filter_by(id=user_id, active=True).first()

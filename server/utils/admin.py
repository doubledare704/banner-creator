from datetime import datetime

from server.models import User


def date_serialize(obj):
    if isinstance(obj, datetime):
        serial = obj.isoformat()
        return serial
    raise TypeError("Type not serializable")


def get_users():
    users = User.query.all()
    return ([{'id': user.id,
              'first_name': user.first_name,
              'last_name': user.last_name,
              'email': user.email,
              'gender': user.gender.name,
              'role': user.role.name,
              'registration_date': date_serialize(user.created_at),
              'auth_by': user.social_type.name
              }
             for user in users])
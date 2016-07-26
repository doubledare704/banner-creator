from datetime import datetime

from server.models import User


def date_serialize(obj):
    if isinstance(obj, datetime):
        serial = obj.isoformat()
        return serial
    raise TypeError("Type not serializable")
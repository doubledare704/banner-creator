import datetime

from flask_login import unicode
from server.db import db
from sqlalchemy.schema import Index
from sqlalchemy.types import Enum
import enum


class Image(db.Model):
    __tablename__ = 'image'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    title = db.Column(db.String(120), unique=False)
    preview = db.Column(db.String(64), unique=True)
    active = db.Column(db.BOOLEAN, default=True, nullable=False)

    def __repr__(self):
        return '<Image %r>' % self.name


class User(db.Model):
    class Gender(enum.Enum):
        male = 0
        female = 1

    class UserRole(enum.Enum):
        user = 0
        designer = 1
        admin = 2

    class SocialNetwork(enum.Enum):
        google = 0
        facebook = 1

    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    social_id = db.Column(db.String(255), index=True)
    social_type = db.Column(Enum(SocialNetwork), nullable=False)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    gender = db.Column(Enum(Gender), nullable=False)
    email = db.Column(db.String(255), index=True, unique=True)
    role = db.Column(Enum(UserRole), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    __table_args__ = (Index('ix_user_id_social_type', "social_type", "id"),)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

    def __repr__(self):
        return '<User %r>' % self.first_name

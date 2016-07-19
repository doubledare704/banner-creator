from flask.ext.login import unicode
from server.db import db
from sqlalchemy import Enum
from sqlalchemy.schema import Index


class Image(db.Model):
    __tablename__ = 'image'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    title = db.Column(db.String(120), unique=False)
    active = db.Column(db.BOOLEAN, default=True, nullable=False)

    def __repr__(self):
        return '<Image %r>' % self.name


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    social_id = db.Column(db.String(255), index=True)
    social_type = db.Column(Enum('google', 'facebook', name='social_network_list'), nullable=False)
    f_name = db.Column(db.String(255))
    l_name = db.Column(db.String(255))
    gender = db.Column(Enum('male', 'female', name='gender_list'), nullable=False)
    email = db.Column(db.String(255), index=True, unique=True)
    token = db.Column(db.String(32), index=True)
    role = db.Column(Enum('user', 'designer', 'admin', name='user_roles'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    __table_args__ = (Index('ix_user_token_social_type', "social_type", "token"),)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

    def __repr__(self):
        return '<User %r>' % self.f_name

import datetime
import enum

from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.schema import Index
from sqlalchemy.types import Enum
from flask_login import unicode

from server.db import db


class BaseImage(db.Model):
    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    title = db.Column(db.String(120), unique=False)
    preview = db.Column(db.String(64), unique=True)
    active = db.Column(db.BOOLEAN, default=True, nullable=False)

    def __repr__(self):
        return '<Image %r>' % self.name


class Banner(BaseImage):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    review = db.relationship('BannerReview', backref='banner',
                             uselist=False)
    history = db.relationship('ImageHistory', backref="parent")


class Image(BaseImage):
    description = db.Column(db.Text, nullable=True)


class BackgroundImage(BaseImage):
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'))


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), unique=True)
    background_images = db.relationship('BackgroundImage', backref='project', lazy='dynamic')


class BannerReview(db.Model):
    class Status(enum.Enum):
        accepted = 0
        not_accepted = 1

    id = db.Column(db.Integer, primary_key=True)
    banner_id = db.Column(db.Integer, db.ForeignKey('banner.id'))
    comment = db.Column(db.Text, nullable=True)
    reviewed = db.Column(db.Boolean, default=False)
    status = db.Column(Enum(Status))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    designer_comment = db.Column(db.Text, nullable=True)
    changed_at = db.Column(db.DateTime, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    designer_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    designer_imagename = db.Column(db.String(64), unique=True)
    designer_previewname = db.Column(db.String(64), unique=True)
    comment_clouds = db.Column(JSON, nullable=True)

    user = db.relationship("User", foreign_keys=[user_id])
    designer = db.relationship("User", foreign_keys=[designer_id])


class ImageHistory(db.Model):
    __tablename__ = 'image_history'
    id = db.Column(db.Integer, primary_key=True)
    review_image = db.Column(db.Integer, db.ForeignKey('banner.id'), nullable=False)
    json_hist = db.Column(JSON, nullable=False)
    created = db.Column(db.DateTime, default=datetime.datetime.utcnow, nullable=False)

    def __str__(self):
        return 'History for image {0} created at {1}'.format(self.review_image, self.created)


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
    social_id = db.Column(db.String(255))
    social_type = db.Column(Enum(SocialNetwork), nullable=False)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    gender = db.Column(Enum(Gender))
    email = db.Column(db.String(255), unique=True)
    role = db.Column(Enum(UserRole), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    active = db.Column(db.BOOLEAN, default=True, nullable=False)
    banners = db.relationship('Banner', backref='user')

    __table_args__ = (Index('ix_user_id_social_type', "social_type", "id"),)

    def is_authenticated(self):
        return True

    def is_active(self):
        return self.active

    def is_anonymous(self):
        return False

    def is_user(self):
        return (not self.is_anonymous) and self.role == User.UserRole.user

    def is_designer(self):
        return (not self.is_anonymous) and self.role == User.UserRole.designer

    def is_admin(self):
        return (not self.is_anonymous) and self.role == User.UserRole.admin

    def get_id(self):
        return unicode(self.id)

    def __repr__(self):
        return '<User %r>' % self.first_name

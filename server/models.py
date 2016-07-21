from server.db import db


class Image(db.Model):
    __tablename__ = 'image'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    title = db.Column(db.String(120), unique=False)
    preview = db.Column(db.String(64), unique=True)
    active = db.Column(db.BOOLEAN, default=True, nullable=False)

    def __repr__(self):
        return '<Image %r>' % self.name


class Review(db.Model):
    __tablename__ = 'review'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)
    status_review = db.Column(db.Boolean, default=False, nullable=False)

    def __str__(self):
        return 'Review image {0}'.format(self.name)

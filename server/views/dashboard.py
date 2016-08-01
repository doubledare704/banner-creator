from flask import render_template

from flask_login import current_user, login_required

from server.models import User, BannerReview, Banner


@login_required
def dashboard():
    if current_user.role == User.UserRole.user:
        reviews = BannerReview.query.filter_by(user_id=current_user.id).order_by(BannerReview.created_at.desc())
        return render_template('user/user_dashboard.html', reviews=reviews)
    elif current_user.role == User.UserRole.designer:
        reviews = BannerReview.query.filter_by(designer_id=current_user.id).order_by(BannerReview.created_at.desc())
        return render_template('user/designer_dashboard.html', reviews=reviews)


def user_banners():
    banners = Banner.query.filter_by(user=current_user)
    return render_template('user/user_banners.html', banners=banners)
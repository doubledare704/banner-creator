from flask import render_template, request

from flask_login import current_user, login_required

from server.models import User, BannerReview, Banner


@login_required
def dashboard():
    page = int(request.args.get('page', 1))  # get page number from url query string
    if current_user.role == User.UserRole.user:
        reviews = BannerReview.query.filter_by(user_id=current_user.id).order_by(BannerReview.created_at.desc()
                                                                                 ).paginate(page=page, per_page=10)
        return render_template('user/user_dashboard.html', reviews=reviews)
    elif current_user.role == User.UserRole.designer:
        reviews = BannerReview.query.filter_by(designer_id=current_user.id).order_by(BannerReview.created_at.desc())
        return render_template('user/designer_dashboard.html', reviews=reviews)


@login_required
def user_banners():
    page = int(request.args.get('page', 1))  # get page number from url query string
    banners = Banner.query.filter_by(user=current_user).paginate(page=page, per_page=10)
    return render_template('user/user_banners.html', banners=banners)
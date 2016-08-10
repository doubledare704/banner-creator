from flask import (render_template, request, flash)
from flask_login import login_required, current_user


from server.db import db
from server.forms import profile_form
from server.models import User


@login_required
def user_profile():
    form = profile_form.ProfileForm()
    if form.validate_on_submit():
        user = User.query.get(current_user.id)
        user.query.update(form.data)
        db.session.commit()
        flash('Профиль изменен.')
    elif request.method == 'POST':
        flash('Профиль не изменен. Проверьте введенные данные.')
    return render_template('user/user_profile.html', form=form)

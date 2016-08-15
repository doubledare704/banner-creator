from server.utils.image import uploaded_file
from server.views import views as main_views, dashboard as dashboard_views
from server.views.admin import (
    admin, backgrounds, inactivate_image, activate_image, users_page, remove_user, change_user,
    default_project_page, create_project, project_page, add_font)
from server.views.auth import login_page, authorize, oauth_callback, log_out
from server.views.editor import (continue_edit, history_image, cuts_background,
                                 save_cuted, load_from_pc, load_all_cuts,
                                 background_images, editor, make_review)
from server.views.images import (
    image_delete, image_rename,
    review_tool, review_image, review_action,
    backgrounds_page)


def setup_routes(app):
    """Here we map routes to handlers."""
    app.add_url_rule('/index/', view_func=dashboard_views.dashboard, endpoint='index')
    app.add_url_rule('/backgrounds/', methods=['GET', 'POST'], view_func=backgrounds_page)
    app.add_url_rule('/uploads/<filename>', view_func=uploaded_file)
    app.add_url_rule('/delete/', methods=['POST'], view_func=image_delete)
    app.add_url_rule('/rename/', methods=['POST'], view_func=image_rename)
    app.add_url_rule('/editor/', view_func=editor)
    app.add_url_rule('/api/backgrounds/', view_func=background_images)
    app.add_url_rule('/api/backgrounds/<int:page>', view_func=background_images)
    app.add_url_rule('/api/review', methods=['POST'], view_func=make_review)

    # user profile
    app.add_url_rule('/profile/', methods=['GET', 'POST'], view_func=main_views.user_profile)

    # dashboard
    app.add_url_rule('/', view_func=dashboard_views.dashboard)
    app.add_url_rule('/dashboard/banners/', view_func=dashboard_views.user_banners, endpoint='dashboard_user_banners')
    app.add_url_rule('/dashboard/backgrounds/', methods=['GET', 'POST'],
                     view_func=dashboard_views.dashboard_backgrounds,
                     endpoint='dashboard_backgrounds')
    app.add_url_rule('/upload', methods=['GET', 'POST'], view_func=dashboard_views.upload, endpoint='upload')

    # admin
    app.add_url_rule('/admin/', view_func=admin)
    app.add_url_rule('/admin/backgrounds/', view_func=backgrounds, endpoint='admin_backgrounds')
    app.add_url_rule('/admin/inactivate_image/<int:image_id>', methods=['POST'], view_func=inactivate_image)
    app.add_url_rule('/admin/activate_image/<int:image_id>', methods=['POST'], view_func=activate_image)

    app.add_url_rule('/admin/projects/<int:project_id>', view_func=project_page, endpoint='admin_project_page')
    app.add_url_rule('/admin/projects/', view_func=default_project_page)
    app.add_url_rule('/admin/projects/', methods=['POST'], view_func=create_project)
    app.add_url_rule('/admin/projects/<int:project_id>/fonts/', methods=['POST'], view_func=add_font)

    app.add_url_rule('/admin/users', view_func=users_page, endpoint='admin_users')
    app.add_url_rule('/admin/users/<int:user_id>', methods=['PUT'], view_func=change_user)
    app.add_url_rule('/admin/users/<int:user_id>', methods=['DELETE'], view_func=remove_user)

    # editor
    app.add_url_rule('/editor/<int:history_image_id>', view_func=continue_edit)
    app.add_url_rule('/editor/history/<int:history_image_id>', methods=['GET', 'POST'], view_func=history_image)
    app.add_url_rule('/cutter/', view_func=cuts_background)
    app.add_url_rule('/editor/cut_saved/', methods=['GET', 'POST'], view_func=save_cuted)
    app.add_url_rule('/editor/local/', methods=['POST'], view_func=load_from_pc)
    app.add_url_rule('/editor/cut-choose/', view_func=load_all_cuts)

    # auth routes
    app.add_url_rule('/login', view_func=login_page)
    app.add_url_rule('/login/<social_network_name>', view_func=authorize)
    app.add_url_rule('/login/authorized/<social_network_name>/', view_func=oauth_callback)
    app.add_url_rule('/logout', methods=['POST'], view_func=log_out)

    app.add_url_rule('/review/', methods=['GET', 'POST'], view_func=review_tool)
    app.add_url_rule('/review_image/<int:img_id>', methods=['GET', 'POST'], view_func=review_image)
    app.add_url_rule('/review_action/', methods=['GET', 'POST'], view_func=review_action)

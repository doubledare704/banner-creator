from server.views.views import index, editor, image_delete, image_rename, background_images, review, continue_edit, \
    history_image
from server.views.auth import login_page, authorize, oauth_callback, log_out
from server.views.admin import admin, backgrounds, inactivate_image, image_delete_from_DB, activate_image, review_images
from server.utils.image import uploaded_file


def setup_routes(app):
    """Here we map routes to handlers."""
    app.add_url_rule('/', methods=['GET', 'POST'], view_func=index)
    app.add_url_rule('/uploads/<filename>', view_func=uploaded_file)
    app.add_url_rule('/delete/', methods=['POST'], view_func=image_delete)
    app.add_url_rule('/rename/', methods=['POST'], view_func=image_rename)
    app.add_url_rule('/editor/', view_func=editor)
    app.add_url_rule('/api/backgrounds/', view_func=background_images)
    app.add_url_rule('/api/backgrounds/<int:page>', view_func=background_images)

    # admin
    app.add_url_rule('/admin/', view_func=admin)
    app.add_url_rule('/admin/backgrounds/', view_func=backgrounds)
    app.add_url_rule('/admin/inactivate_image/<int:id>', methods=['POST'], view_func=inactivate_image)
    app.add_url_rule('/admin/delete_image/<int:id>', methods=['POST'], view_func=image_delete_from_DB)
    app.add_url_rule('/admin/activate_image/<int:id>', methods=['POST'], view_func=activate_image)
    app.add_url_rule('/admin/review_images/', view_func=review_images)

    # editor
    app.add_url_rule('/api/review/', methods=['POST'], view_func=review)
    app.add_url_rule('/editor/<int:history_image_id>', view_func=continue_edit)
    app.add_url_rule('/editor/history/<int:history_image_id>', methods=['GET', 'POST'], view_func=history_image)

    # auth routes
    app.add_url_rule('/login', view_func=login_page)
    app.add_url_rule('/login/<social_network_name>', view_func=authorize)
    app.add_url_rule('/login/authorized/<social_network_name>/', view_func=oauth_callback)
    app.add_url_rule('/logout', methods=['POST'], view_func=log_out)

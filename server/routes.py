from server.views.views import index,uploaded_file,image_delete,image_rename,editor
from server.views.admin import admin, backgrounds, inactiveImg

def setup_routes(app):
    """Here we map routes to handlers."""
    app.add_url_rule('/', methods=['GET', 'POST'], view_func=index)
    app.add_url_rule('/uploads/<filename>', view_func=uploaded_file)
    app.add_url_rule('/delete/<int:id>', methods=['GET', 'POST'], view_func=image_delete)
    app.add_url_rule('/rename/<int:id>', methods=['GET', 'POST'], view_func=image_rename)
    app.add_url_rule('/editor/', view_func=editor)
    app.add_url_rule('/admin/', view_func=admin)
    app.add_url_rule('/admin/backgrounds/', view_func=backgrounds)
    app.add_url_rule('/admin/inactiveImg/<int:id>', methods=['POST'], view_func=inactiveImg)
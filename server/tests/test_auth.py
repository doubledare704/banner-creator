import unittest

from flask import url_for, request

from server.main import create_app
from server.db import db
from server.utils import auth

# Create an instance of application
app = create_app()


def setUpModule():
    """
    Initializes a test environment
    """
    app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_TEST_DATABASE_URI']
    app.config['SERVER_NAME'] = 'localhost'
    app.config['TESTING'] = True
    app.config['DEBUG'] = False


class TestAuth(unittest.TestCase):
    def setUp(self):
        """
        Creates tables in test database
        """
        with app.app_context():
            db.create_all()

        self.client = app.test_client()

    def tearDown(self):
        """
        Deletes created tables and closes the session instance
        """
        db.session.remove()
        db.drop_all(app=app)

    def test_redirect_to_login(self):
        with app.app_context():
            request.path = '/test'
            response = auth._redirect_to_login()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers['location'], '/test')


    #
    # def test_index_page(self):
    #     with app.app_context():
    #         response = self.client.get(url_for('index'))
    #     self.assertEqual(response.status_code, 200)
    #
    # def test_can_upload_an_image(self):
    #     with app.app_context():
    #         self.client.post(url_for('index'), data={'file': (BytesIO(b'test_object'), 'img.png')})
    #         self.assertEqual(Image.query.count(), 1)
    #
    # def test_can_delete_an_image(self):
    #     with app.app_context():
    #         img = Image(name='test_image')
    #         db.session.add(img)
    #         db.session.commit()
    #
    #         img = Image.query.first()  # get created image object
    #         self.client.post(url_for('image_delete', id=img.id))
    #         self.assertEqual(Image.query.count(), 0)

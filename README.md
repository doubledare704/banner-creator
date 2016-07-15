# Banners
### *Web service for creating banners*

## Installing
- Clone the project `git clone http://gitlab.intern.uaprom/n.koropatnik/banner-creator.git`
- Setup requirements using your virtualenv `pip install -r requirements.txt` 
- Apply DB migrations `python manage.py db upgrade`
- Create `media/` folder in directory `server/`
- Create `instance/config.py` **in your repository root directory** and populate it with configs. Example:

    >SECRET_KEY = 'supersecretstring'
    
    >SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://user:password@host/database'
    
    >SQLALCHEMY_TEST_DATABASE_URI = 'postgresql+psycopg2://user:password@host/test_database'`
    
Now try to run dev server `python manage.py runserver`

## Database migrations
- Use `python manage.py db migrate` to create a new migrations file
- Use `python manage.py db upgrade` to apply changes to your database

## Tests
- Use `python manage.py test` to run all the tests
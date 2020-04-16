import os
from flask import Flask, render_template
from flask_cors import CORS

from .config import config
from .models import database
from .tools import create_table

cors = CORS()


def create_app(config_name='development'):
    ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
    os.chdir(ROOT_DIR)
    app = Flask(__name__, template_folder='../../frontend', static_folder='../../frontend/assets')

    CORS(app)
    app.config.from_object(config[config_name])

    try:
        #Próba załadowania ustawień z lokalnej konfiguracji
        from .local_config import config as loc_config
        app.config.from_object(loc_config.get(config_name, {}))
    except ImportError:
        pass

    database.init(
        app.config['DBNAME'], 
        host=app.config['DBHOST'],
        user=app.config['DBUSER'],
        password=app.config['DBPASS'],
        port=app.config['DBPORT']
        )
    create_table(database)

    app.database = database
    cors.init_app( app )

    @app.after_request
    def after(response):
        if not database.is_closed():
            database.close()
        return response

    @app.route('/')
    def index():
        return render_template('index.html')

    from .routes import mod_routes
    app.register_blueprint(mod_routes)

    return app
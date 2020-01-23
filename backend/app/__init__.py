from flask import Flask, render_template

from .models import database, Camps

def create_app(config_name):
    ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
    os.chdir(ROOT_DIR)

    app = Flask(__name__, template_folder='../../frontend', static_folder='../../frontend/assets')

    # CORS(app)
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

    @app.route('/suchodolski')
    def suchodolski_welcome():
        return render_template('index.html')
    return app



from flask import Flask, render_template

def create_app():
    app = Flask(__name__, template_folder='../../frontend', static_folder='../../frontend/assets')

    @app.route('/suchodolski')
    def suchodolski_welcome():
        return render_template('index.html')
    return app


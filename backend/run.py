from app import create_app


app = create_app('production')

if __name__ == '__main__':
    app = create_app()
    app.run(host=app.config['SERVER_ADDRESS'], port=app.config['SERVER_PORT'])
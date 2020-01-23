from app import create_app


zmienna = create_app()

if __name__ == '__main__':
    zmienna.run(debug = True)
class Config:
    SECRET_KEY = b'gcrX2Gj5AGsXGbSGf6UgYR-hakK-i-9cbPbTOIUEObg'

    DBNAME = 'rdos_db'
    DBUSER = 'postgres'
    DBPASS = 'admin'
    DBHOST = 'localhost'
    DBPORT = '5432'

    SERVER_ADDRESS = '0.0.0.0'
    SERVER_PORT = 5500


class TestingConfig(Config):
    TESTING = True
    DEBUG=True

class DevelopmentConfig(Config):
    """ Konfiguracja deweloperska """
    DEBUG = True

config = {
    'testing' : TestingConfig,
    'development' : DevelopmentConfig
    }
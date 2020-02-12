class Config:
    SECRET_KEY = b'gcrX2Gj5AGsXGbSGf6UgYR-hakK-i-9cbPbTOIUEObg'

    DBNAME = 'bazy_harcerskie'
    DBUSER = 'postgres'
    DBPASS = 'admin'
    DBHOST = 'localhost'
    DBPORT = '5432'

    SERVER_ADDRESS = '0.0.0.0'
    SERVER_PORT = 5000


class DevelopmentConfig(Config):
    """ Konfiguracja deweloperska """
    DEBUG = True

config = {
    'development' : DevelopmentConfig
    }
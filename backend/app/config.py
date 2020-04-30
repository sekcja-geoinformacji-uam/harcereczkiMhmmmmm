class Config:
    SECRET_KEY = b'gcrX2Gj5AGsXGbSGf6UgYR-hakK-i-9cbPbTOIUEObg'

    DBNAME = 'bazy'
    DBUSER = 'postgres'
    DBPASS = 'admin'
    DBHOST = 'localhost'
    DBPORT = '5432'

    UPASS = b'\x9c\xae&\xb0\xba\x0b1X\x9d\xb0"\xb0\\\x06\x17\x0b\xb8H\xa6\xc9\x9f\xd4\xa1\xebj\x0e>\xdc4Q\xe5\xe6'

    SERVER_ADDRESS = '0.0.0.0'
    SERVER_PORT = 80


class TestingConfig(Config):
    SERVER_PORT = 5000
    TESTING = True
    DEBUG=True

class DevelopmentConfig(Config):
    """ Konfiguracja deweloperska """
    DEBUG = True
    SERVER_PORT = 5000

config = {
    'testing' : TestingConfig,
    'development' : DevelopmentConfig,
    'production': Config
    }
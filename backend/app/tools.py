from .models import Camps

def create_table(db):
    """ Tworzenie tabeli jeśli nie istnieje """
    if not db.table_exists('camps'):
        db.create_tables([Camps])
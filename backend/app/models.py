from peewee import Model, Field, PrimaryKeyField, TextField
from playhouse.postgres_ext import PostgresqlExtDatabase


database = PostgresqlExtDatabase(
    None,
    register_hstore=False,
    autorollback = True,
    field_types={'geometry':'geometry'}
)


class BaseModel(Model):
    """ Bazowy model tabeli """
    class Meta:
        database = database

class GeometryField(Field):
    """ Pole do przechowywania geometrii """
    field_type = 'geometry'

class Camps(BaseModel):
    """ Tabela baz harcerskich """
    id = PrimaryKeyField()
    banner = TextField()
    name = TextField()
    province = TextField()
    address = TextField()
    email = TextField()
    phone = TextField()
    availability = TextField()
    activities = TextField()   
    location = TextField()
    terrain = TextField()
    accommodation = TextField()
    sanitary = TextField()
    base_features = TextField()
    possibilities = TextField()
    other = TextField()
    geom = GeometryField()
    
    class Meta:
        db_table = 'camps'

"""

# Chorągiew	
Nazwa bazy/ośrodka	
Województwo na terenie którego mieści się baza.	
Adres bazy	
Kontaktowy adres e-mail	
Kontaktowy numer telefonu	
Baza jest czynna:	
Formy, które można zorganizować na bazie:	
Położenie bazy:	
Charakterystyka terenu	
Dostępne formy zakwaterowania na bazie:	
Zaplecze sanitarne:	
Usługi bazy:	
Możliwości programowe bazy:	
Inne	
ostateczna_x	ostateczna_y

"""
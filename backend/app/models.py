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

'Chorągiew' : 'banner',
'Nazwa bazy/ośrodka' : name,
'Województwo na terenie którego mieści się baza.':'province',
'Adres bazy':'address',
'Kontaktowy adres e-mail' : 'email',
'Kontaktowy numer telefonu'	: 'phone',
'Baza jest czynna:' : 'availability',
'Formy, które można zorganizować na bazie:' : 'activities',
'Położenie bazy:' : 'location',
'Charakterystyka terenu':'terrain',
'Dostępne formy zakwaterowania na bazie:':'accomodation',
'Zaplecze sanitarne:':'sanitary',
'Usługi bazy:':'base_features',
'Możliwości programowe bazy:':'possibilities',
'Inne':'other'	

"""
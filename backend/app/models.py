from peewee import Model, Field, PrimaryKeyField, TextField, IntegerField
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
    banner = TextField(null=True)
    name = TextField(null=True)
    province = TextField(null=True)
    address = TextField(null=True)
    email = TextField(null=True)
    phone = TextField(null=True)
    availability = TextField(null=True)
    activities = TextField(null=True)   
    location = TextField(null=True)
    terrain = TextField(null=True)
    accommodation = TextField(null=True)
    sanitary = TextField(null=True)
    base_features = TextField(null=True)
    possibilities = TextField(null=True)
    other = TextField(null=True)
    geom = GeometryField(null=True)
    teryt = IntegerField(null=True)
    
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
import json

from shapely.geometry import asShape
from peewee import fn

from app import create_app
from app.models import Camps
from app.tools import create_table

if __name__ == '__main__':
    app = create_app()
    db = app.database
    create_table(db)
    with open('init_data.json') as f:
        data = json.load(f)
    rows = []
    for feat in data:
        row = {
            'geom': fn.ST_GeomFromEWKT(asShape(feat['geometry']).wkt),
            **feat['properties']
        }
        row.pop('id')
        rows.append(row)
    with db.atomic():
        Camps.insert_many(rows).execute()
    
    print('Pomyślnie wgrano dane')
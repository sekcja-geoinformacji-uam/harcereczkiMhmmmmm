import json

from app import create_app
from app.models import Camps
from peewee import fn

if __name__ == '__main__':
    app = create_app()
    
    rs = Camps.select(
        Camps,
        fn.ST_AsGeoJSON(Camps.geom).alias('geometry')
    ).dicts()
    features = []
    for row in rs:
        row.pop('geom')
        geom = row.pop('geometry')
        features.append({
            "type": "Feature",
            "id": row.get('id'),
            "geometry": json.loads(geom),
            "properties": row
        })

    with open('init_data.json', 'w') as f:
        json.dump(features, f)

    print('Pomyślnie wyeksportowano dane')
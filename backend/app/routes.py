import json
from flask import Blueprint, request, jsonify, current_app
from peewee import fn
from .models import Camps
from shapely.geometry import asShape


mod_routes = Blueprint('routes', __name__)

fields_map = {
    'Chorągiew': 'banner',
    'Nazwa bazy/ośrodka': 'name',
    'Województwo na terenie którego mieści się baza.': 'province',
    'Adres bazy': 'address',
    'Kontaktowy adres e-mail': 'email',
    'Kontaktowy numer telefonu'	: 'phone',
    'Baza jest czynna:': 'availability',
    'Formy, które można zorganizować na bazie:': 'activities',
    'Położenie bazy:': 'location',
    'Charakterystyka terenu': 'terrain',
    'Dostępne formy zakwaterowania na bazie:': 'accommodation',
    'Zaplecze sanitarne:': 'sanitary',
    'Usługi bazy:': 'base_features',
    'Możliwości programowe bazy:': 'possibilities',
    'Inne': 'other'
}


@mod_routes.route('/features')
def get_features():
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
    return jsonify({
        "type": 'FeatureCollection',
        "features": features
    })


@mod_routes.route('/features', methods=['POST'])
def post_features():
    data = request.get_json(force=True)
    features = data.get('features')
    if not features:
        return jsonify({"success": False}), 400
    feats_list = []
    for feature in features:
        row = {}
        replaced = replace_keys(feature.get('properties'))
        row = {**replaced}
        row['geom'] = fn.ST_GeomFromEWKT(asShape(feature['geometry']).wkt)
        feats_list.append(row)
    with current_app.database.atomic():
        Camps.insert_many(feats_list).execute()
    return jsonify({"resposne": True}), 401


def replace_keys(dict):
    new_dict = {}
    for key, value in dict.items():
        if fields_map.get(key):
            new_dict[fields_map.get(key)] = value
    return new_dict

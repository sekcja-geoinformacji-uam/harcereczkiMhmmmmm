import json, hashlib
from flask import Blueprint, request, jsonify, current_app
from peewee import fn, DataError
from .models import Camps
from shapely.geometry import asShape


mod_routes = Blueprint('routes', __name__)

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
def post_feature():
    data = request.get_json(force=True)
    if not data:
        return jsonify({'message': 'Nie przesłano danych'}), 400
    password = data.get('password')
    if not password:
        return jsonify({'message': 'Brak hasła'}), 403
    hash_pass = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), current_app.config['SECRET_KEY'], 100000)
    if hash_pass != current_app.config['UPASS']:
        return jsonify({'message': 'Podano błędne hasło'}), 401
    geometry = data.get('geometry')
    if not geometry: 
        return jsonify({'message': 'Nie przesłano geometrii'}), 400
    try:
        data['geom'] = fn.ST_GeomFromEWKT('SRID=%s;%s'%(4326, asShape(data.pop('geometry')).wkt))
        new_feature = Camps.create(**data)
    except DataError as e: 
         return jsonify({'message': f'{e}'}), 400
    return jsonify({'inserted': new_feature.id}), 200
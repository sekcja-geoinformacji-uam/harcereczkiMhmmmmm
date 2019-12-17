const punkty = {
  "type": "FeatureCollection",
  "name": "witam",
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:EPSG::3857"
    }
  },
  "features": [{
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [2339474.380505306180567, 6842912.12877878267318]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [1883801.391977019142359, 6874097.27519899979234]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [1884053.562972330721095, 6879560.98009742051363]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [1882372.423003586009145, 6867708.943317769095302]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [1875815.977125481003895, 6868465.456303704530001]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [1899099.765692597487941, 6868633.570300579071045]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [1861694.401388023979962, 6885697.140983339399099]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [1879514.485056719742715, 6864935.062369340099394]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [1894812.858772298088297, 6873592.933208376169205]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [1871445.013206744333729, 6879645.037095857784152]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [1867158.106286444701254, 6872584.249227129854262]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [1887415.842909820610657, 6868045.17131151817739]
      }
    }
  ]
}


  var style = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: 'black'
      }),
      stroke: new ol.style.Stroke({
        color: [255, 215, 151],
        width: 2
      })
    })
  });

  var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: new ol.Collection(punkty)
    }),
    style: style
  });
  

  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2FsaWFhYSIsImEiOiJjazJzd3cwNXowcGJmM2RudnNiaXYyOHU1In0.P2EP-Xewl1qp3onIMwTo7w'
        })
      }),
      vectorLayer
    ],
    target: 'map',
    view: new ol.View({
      center: [1884631.369399, 6874440.575856],
      zoom: 11
    })
  });




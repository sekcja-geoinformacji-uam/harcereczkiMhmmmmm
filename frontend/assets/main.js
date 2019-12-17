  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2FsaWFhYSIsImEiOiJjazJzd3cwNXowcGJmM2RudnNiaXYyOHU1In0.P2EP-Xewl1qp3onIMwTo7w'
        })
      })
    ],
    target: 'map',
    view: new ol.View({
      center: [1884631.369399, 6874440.575856],
      zoom: 11
    })
  });

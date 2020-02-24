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
    name: "features",
    source: new ol.source.Vector({
      url:
        "https://api.mapbox.com/datasets/v1/p4trykj/ck5d02qdn00so2vqokg4i6h95/features?access_token=pk.eyJ1IjoicDR0cnlraiIsImEiOiJjazExeWNyN3cwankzM2JwNmNtOHgzNXg5In0.StjLw-qURyTLbAZKWxZl2g",
      format: new ol.format.GeoJSON()
    })
    // style: style
  });
  
  var vectorLayer2 = new ol.layer.Vector({
    source: new ol.source.Vector({
      url:'https://api.mapbox.com/datasets/v1/p4trykj/ck5d02qdn00so2vqokg4i6h95/features?access_token=pk.eyJ1IjoicDR0cnlraiIsImEiOiJjazExeWNyN3cwankzM2JwNmNtOHgzNXg5In0.StjLw-qURyTLbAZKWxZl2g',
      format: new ol.format.GeoJSON(),
      features: new ol.Collection()
    }),
  });

  var container = document.getElementById('popup');
  var content = document.getElementById('popup-content');
  var closer = document.getElementById('popup-closer');

  var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
    duration: 250
    }
  });

  
  closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };
  

  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2FsaWFhYSIsImEiOiJjazJzd3cwNXowcGJmM2RudnNiaXYyOHU1In0.P2EP-Xewl1qp3onIMwTo7w'
        })
      }),
      vectorLayer,
      vectorLayer2
    ],
    overlays: [overlay],
    target: 'map',
    view: new ol.View({
      center: [1884631.369399, 6874440.575856],
      zoom: 11
    })
  });

  function getProp(feature) {
    return feature.getProperties()
  }


  function listEventHandler(e) {
   const {target} = e
   const [name, id] = target.id.split('@')
   if(name === 'list__btn--zoom' || name === 'map-icon') {
    zoomToFeatureByID(id)
   } else if(name === 'list__btn--info' || name === 'arrow-icon') {
     openInfo(id)
   }
  }

  function zoomToFeatureByID(id) {
    const feature = vectorLayer.getSource().getFeatures().find(function (feature) {
      return feature.get('JPT_NAZWA_') == id 
    })
    const geomExtent = feature.getGeometry().getExtent()
    map.getView().fit(geomExtent, {duration: 1000})
  }

  function newElem(feature) {
    // console.log(feature);
    const listEl = document.createElement("li");
    listEl.innerHTML = `<span>${feature.JPT_NAZWA_}</span> 
    <button  class="btn btn-light" id="list__btn--zoom@${feature.JPT_NAZWA_}"><i class="fa fa-map id="map-icon"></i></button>
    <button class="btn btn-light" id="list__btn--info@${feature.JPT_NAZWA_}"><i class="fa fa-chevron-circle-down" id="arrow-icon"></i></button>`
    // const listCont = document.createElement("span")
    // listEl.appendChild("span")
    document.getElementsByClassName("list-group-item list-group-item-action list-group-item-secondary")[0].appendChild(listEl);
  }

 let simpleFeatures
  map.once('rendercomplete', function(event) {
    const features = vectorLayer.getSource().getFeatures();
   simpleFeatures = features.map(getProp)
    simpleFeatures.forEach(newElem)
    document.getElementsByClassName("list-group-item list-group-item-action list-group-item-secondary")[0].addEventListener('click', e => {
      listEventHandler(e)
    })
  // console.log(features)
  // console.log(simpleFeatures)
});






  map.on('singleclick', function(evt) {
  
    // overlay.features(vectorLayer)
    var coordinate = evt.coordinate;
    const properties =  map.getFeaturesAtPixel(evt.pixel)[0].getProperties();
    content.innerHTML =`Nazwa: ${properties.JPT_NAZWA_} <br>
                        Organ: ${properties.JPT_ORGAN1} <br>
                        ` 
    overlay.setPosition(coordinate);
      // if (vectorLayer !== null) {
      // vectorLayer.view
      // evt.view
      // }

    });



function hideList() {
document.getElementsByClassName("list-group-item list-group-item-action list-group-item-secondary")[0].style.display = "none"
}



function openInfo(feature) {
// console.log(feature)
document.getElementsByClassName("feature__wrapper")[0].style.display = "inline"
document.getElementsByClassName("list-group-item list-group-item-action list-group-item-secondary")[0].style.display = "none"
  const baseName = simpleFeatures.find(function (simpleFeature) {
  return simpleFeature.JPT_NAZWA_  == feature
})
// console.log(baseName)
for (const property in baseName) {
  if (property != "geometry") {
    const baseElement = document.createElement("li")
  baseElement.innerHTML = `${property}: ${baseName[property]}` 
  document.getElementsByClassName("feature__info")[0].appendChild(baseElement)}
}}
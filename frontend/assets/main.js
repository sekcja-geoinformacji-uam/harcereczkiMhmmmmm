var style = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 7,
    fill: new ol.style.Fill({
      color: "black"
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
    url: "http://3.120.210.65:5000/features",
    format: new ol.format.GeoJSON()
  })
  // style: style
});

var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var closer = document.getElementById("popup-closer");

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
        url:
          "https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2FsaWFhYSIsImEiOiJjazJzd3cwNXowcGJmM2RudnNiaXYyOHU1In0.P2EP-Xewl1qp3onIMwTo7w"
      })
    }),
    vectorLayer
  ],
  overlays: [overlay],
  target: "map",
  view: new ol.View({
    center: [1884631.369399, 6874440.575856],
    zoom: 6
  })
});

function getProp(feature) {
  return feature.getProperties();
}

function listEventHandler(e) {
  const { target } = e;
  const [name, id] = target.id.split("@");
  if (name === "list__btn--zoom" || name === "map-icon") {
    zoomToFeatureByID(id);
  } else if (name === "list__btn--info" || name === "arrow-icon") {
    openInfo(id);
  }
}

function zoomToFeatureByID(id) {
  const feature = vectorLayer
    .getSource()
    .getFeatures()
    .find(function(feature) {
      return feature.get("name") == id;
    });
  const geomExtent = feature.getGeometry().getExtent();
  map.getView().fit(geomExtent, { duration: 1000, maxZoom: 12 });
}

function newElem(feature) {
  // console.log(feature);
  const listEl = document.createElement("li");
  listEl.innerHTML = `<span>${feature.name}</span> 
    <button  class="btn btn-light" id="list__btn--zoom@${feature.name}"><i class="fa fa-map id="map-icon"></i></button>
    <button class="btn btn-light" id="list__btn--info@${feature.name}"><i class="fa fa-chevron-circle-down" id="arrow-icon"></i></button>`;
  // const listCont = document.createElement("span")
  // listEl.appendChild("span")
  document
    .getElementsByClassName(
      "list-group-item list-group-item-action list-group-item-secondary"
    )[0]
    .appendChild(listEl);
}

let simpleFeatures;
map.once("rendercomplete", function(event) {
  const features = vectorLayer.getSource().getFeatures();
  simpleFeatures = features.map(getProp);
  simpleFeatures.forEach(newElem);
  document
    .getElementsByClassName(
      "list-group-item list-group-item-action list-group-item-secondary"
    )[0]
    .addEventListener("click", e => {
      listEventHandler(e);
    });
  // console.log(features)
  // console.log(simpleFeatures)
});

map.on("singleclick", function(evt) {
  // overlay.features(vectorLayer)
  var coordinate = evt.coordinate;
  const properties = map.getFeaturesAtPixel(evt.pixel)[0].getProperties();
  content.innerHTML = `<span class="popup_content_text"> Nazwa: ${properties.name} <br>
                        Adres: ${properties.address} <br> </span>`;
  overlay.setPosition(coordinate);
  // if (vectorLayer !== null) {
  // vectorLayer.view
  // evt.view
  // }
});

function hideList() {
  document.getElementsByClassName(
    "list-group-item list-group-item-action list-group-item-secondary"
  )[0].style.display = "none";
}

function openInfo(feature) {
  // console.log(feature)
  document.getElementsByClassName("feature__wrapper")[0].style.display =
    "inline";
  document.getElementsByClassName(
    "list-group-item list-group-item-action list-group-item-secondary"
  )[0].style.display = "none";
  const baseName = simpleFeatures.find(function(simpleFeature) {
    return simpleFeature.name == feature;
  });
  // console.log(baseName)
  for (const property in baseName) {
    if (property != "geometry") {
      const baseElement = document.createElement("li");
      baseElement.innerHTML = `${property}: ${baseName[property]}`;
      document
        .getElementsByClassName("feature__info")[0]
        .appendChild(baseElement);
    }
  }
}

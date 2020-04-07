var dict = {
  accommodation: "Dostępne formy zakwaterowania na bazie",
  activities: "Formy, które można zorganizować na bazie",
  address: "Adres bazy",
  availability: "Baza jest czynna",
  banner: "Chorągiew",
  base_features: "Usługi bazy",
  location: "Położenie bazy",
  name: "Nazwa bazy/ośrodka",
  other: "Inne",
  phone: "Kontaktowy numer telefonu",
  possibilities: "Możliwości programowe bazy",
  province: "Województwo",
  sanitary: "Zaplecze sanitarne",
  terrain: "Charakterystyka terenu",
  email: "Kontaktowy adres e-mail",
  id: "Id"
}


var style = new ol.style.Style({
  image: new ol.style.Icon({
    src: "./assets/icons/camping-tent1.svg",
    scale: 0.06,
    // radius: 7,
    // fill: new ol.style.Fill({
    //   color: "#588463"
    // }),
    // stroke: new ol.style.Stroke({
    //   color: "black",
    //   width: 1
    // })
  }),
});

var vectorLayer = new ol.layer.Vector({
  name: "features",
  source: new ol.source.Vector({
    url: "http://3.120.210.65:5000/features",
    format: new ol.format.GeoJSON(),
  }),
  style: style,
});

var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var closer = document.getElementById("popup-closer");

var overlay = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        url:
          "https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2FsaWFhYSIsImEiOiJjazJzd3cwNXowcGJmM2RudnNiaXYyOHU1In0.P2EP-Xewl1qp3onIMwTo7w",
      }),
    }),
    vectorLayer,
  ],
  overlays: [overlay],
  target: "map",
  view: new ol.View({
    center: [1884631.369399, 6874440.575856],
    zoom: 6,
  }),
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
    .find(function (feature) {
      return feature.get("id") == id;
    });
  const geomExtent = feature.getGeometry().getExtent();
  map.getView().fit(geomExtent, { duration: 1000, maxZoom: 12 });
}

function newElem(feature) {
  const listEl = document.createElement("li");
  listEl.innerHTML = `<span>${feature.name}</span> <div class="buttonzoom__wrapper">
    <button  class="btn btn-light btn__zoom" id="list__btn--zoom@${feature.id}"><i class="fas fa-map-marked-alt" id="map-icon@${feature.id}"></i></button></div>
    <div class="buttoninfo__wrapper"><button class="btn btn-light" class="btn__info" id="list__btn--info@${feature.id}"><i class="fa fa-chevron-circle-down" id="arrow-icon@${feature.id}"></i></button></div>`;
  // const listCont = document.createElement("span")
  // listEl.appendChild("span")
  listEl.id = `base-${feature.id}`;
  // console.log(feature);
  document
    .getElementsByClassName(
      "list-group-item list-group-item-action list-group-item-secondary"
    )[0]
    .appendChild(listEl);
}

let simpleFeatures;
map.once("rendercomplete", function (event) {
  const features = vectorLayer.getSource().getFeatures();
  simpleFeatures = features.map(getProp);
  simpleFeatures.forEach(newElem);
  document
    .getElementsByClassName(
      "list-group-item list-group-item-action list-group-item-secondary"
    )[0]
    .addEventListener("click", (e) => {
      listEventHandler(e);
    });
});

map.on("singleclick", function (evt) {
  var coordinate = evt.coordinate;
  const properties = map.getFeaturesAtPixel(evt.pixel)[0].getProperties();
  content.innerHTML = `<span class="popup_content_text"> Nazwa: ${properties.name} <br>
                        Adres: ${properties.address} <br> </span>`;
  overlay.setPosition(coordinate);
  var listEl = document.getElementById(`base-${properties.id}`)
  listEl.scrollIntoView({behavior: "smooth", block: "center"})
  const activeList = document.getElementsByClassName('active')
  const jsList = Array.from(activeList)
  jsList[0].classList.removeI('active')
  listEl.className.add = "active"
});

map.on("pointermove", function (e) {
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  map.getViewport().style.cursor = hit ? "pointer" : "";
});

function hideList() {
  document.getElementsByClassName("feature__wrapper")[0].style.display = "none";
  document.getElementsByClassName(
    "list-group-item list-group-item-action list-group-item-secondary"
  )[0].style.display = "block";
}

function openInfo(feature) {
  document.getElementsByClassName("feature__wrapper")[0].style.display =
    "inline";
  document.getElementsByClassName(
    "list-group-item list-group-item-action list-group-item-secondary"
  )[0].style.display = "none";
  const baseName = simpleFeatures.find(function (simpleFeature) {
    return simpleFeature.name == feature;
  });
  for (const property in baseName) {
    if (property != "geometry") {
      const baseElement = document.createElement("li");
      baseElement.innerHTML = `${dict[property]}: ${baseName[property]}`;
      document
        .getElementsByClassName("feature__info")[0]
        .appendChild(baseElement);
    }
  }
}

function hideAddBaseList() {
  document.getElementsByClassName("addBase__wrapper")[0].style.display = "none"
  document.getElementsByClassName("features__wrapper")[0].style.display = "block"
  }


function addBase(feature) {
  document.getElementsByClassName("addBase__wrapper")[0].style.display = "inline";
  document.getElementsByClassName(
    "features__wrapper"
  )[0].style.display = "none";
}



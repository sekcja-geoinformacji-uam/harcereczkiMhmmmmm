var dict = {
  accommodation: 'Dostępne formy zakwaterowania na bazie',
  activities: 'Formy, które można zorganizować na bazie',
  address: 'Adres bazy',
  availability: 'Baza jest czynna',
  banner: 'Chorągiew',
  base_features: 'Usługi bazy',
  location: 'Położenie bazy',
  name: 'Nazwa bazy/ośrodka',
  other: 'Inne',
  phone: 'Kontaktowy numer telefonu',
  possibilities: 'Możliwości programowe bazy',
  province: 'Województwo',
  sanitary: 'Zaplecze sanitarne',
  terrain: 'Charakterystyka terenu',
  email: 'Kontaktowy adres e-mail',
  id: 'Id',
};

const wojDict = {
  '02': 'dolnośląskie',
  '04': 'kujawsko-pomorskie',
  '06': 'lubelskie',
  '08': 'lubuskie',
  '10': 'łódzkie',
  '12': 'małopolskie',
  '14': 'mazowieckie',
  '16': 'opolskie',
  '18': 'podkarpackie',
  '20': 'podlaskie',
  '22': 'pomorskie',
  '24': 'śląskie',
  '26': 'świętokrzyskie',
  '28': 'warmińsko-mazurskie',
  '30': 'wielkopolskie',
  '32': 'zachodniopomorskie',
};

var style = new ol.style.Style({
  image: new ol.style.Icon({
    src: './assets/icons/tent.svg',
    scale: 0.06,
  }),
});

var style2 = new ol.style.Style({
  image: new ol.style.Icon({
    src: './assets/icons/red_tent.svg',
    scale: 0.06,
  }),
});

var inviStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(0,0,0,0)',
  }),
});

var vectorLayer = new ol.layer.Vector({
  name: 'features',
  source: new ol.source.Vector({
    url: 'http://54.93.192.181/features',
    format: new ol.format.GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    }),
  }),
  style: style,
});

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

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

var source = new ol.source.Vector({ wrapX: false });

var drawLayer = new ol.layer.Vector({
  source: source,
  style: style2,
});

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: 'https://c.tile.openstreetmap.pl/osmapa.pl/{z}/{x}/{y}.png',
      }),
    }),
    vectorLayer,
    drawLayer,
  ],
  overlays: [overlay],
  target: 'map',
  view: new ol.View({
    center: [1884631.369399, 6874440.575856],
    zoom: 6,
  }),
});

var draw;
function addInteraction() {
  draw = new ol.interaction.Draw({
    source: drawLayer.getSource(),
    type: 'Point',
    style: style2,
  });
  draw.on('drawend', () => {
    draw.setActive(false);
  });
  draw.setActive(false);
  map.addInteraction(draw);
}

addInteraction();

function getProp(feature) {
  return feature.getProperties();
}

function listEventHandler(e) {
  const { target } = e;
  const [name, id] = target.id.split('@');
  if (name === 'list__btn--zoom' || name === 'zoom-icon') {
    zoomToFeatureByID(id);
  } else if (name === 'list__btn--info' || name === 'info-icon') {
    openInfo(id);
  }
}

function zoomToFeatureByID(id) {
  const feature = vectorLayer
    .getSource()
    .getFeatures()
    .find(function (feature) {
      return feature.get('id') == id;
    });
  const geomExtent = feature.getGeometry().getExtent();
  map.getView().fit(geomExtent, { duration: 1000, maxZoom: 12 });
  content.innerHTML = `<span class="popup_content_text"> Nazwa: ${feature.get(
    'name'
  )} <br>
                        Adres: ${feature.get('address')} <br> </span>`;
  overlay.setPosition(feature.getGeometry().flatCoordinates);
}

function newElem(feature) {
  const listEl = document.createElement('li');
  listEl.innerHTML = `<span>${feature.name}</span> <div class="buttonzoom__wrapper">
    <button  class="btn btn-light btn__zoom" id="list__btn--zoom@${feature.id}"><i class="fas fa-search-plus" id="zoom-icon@${feature.id}"></i></button></div>
    <div class="buttoninfo__wrapper"><button class="btn btn-light" class="btn__info" id="list__btn--info@${feature.id}"><i class="fas fa-info-circle" id="info-icon@${feature.id}"></i></button></div>`;
  listEl.id = `base-${feature.id}`;
  document
    .getElementsByClassName(
      'list-group-item list-group-item-action list-group-item-secondary'
    )[0]
    .appendChild(listEl);
}

function createList(featuresList) {
  simpleFeatures = featuresList.map(getProp);
  document.getElementsByClassName(
    'list-group-item list-group-item-action list-group-item-secondary'
  )[0].innerHTML = '';
  simpleFeatures.forEach(newElem);
  document
    .getElementsByClassName(
      'list-group-item list-group-item-action list-group-item-secondary'
    )[0]
    .addEventListener('click', (e) => {
      listEventHandler(e);
    });
}
let simpleFeatures;

map.on('singleclick', function (evt) {
  var coordinate = evt.coordinate;
  const featuresAtPixel = map.getFeaturesAtPixel(evt.pixel, {
    layerFilter: (test) => test.get('name') === 'features',
  });
  if (!featuresAtPixel[0]) return;
  const properties = featuresAtPixel[0].getProperties();
  content.innerHTML = `<span class="popup_content_text"> Nazwa: ${properties.name} <br>
                        Adres: ${properties.address} <br> </span>`;
  overlay.setPosition(coordinate);
  var listEl = document.getElementById(`base-${properties.id}`);
  listEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const activeList = document.getElementsByClassName('active');
  const jsList = Array.from(activeList);
  if (jsList[0]) {
    jsList[0].classList.remove('active');
  }
  listEl.classList.add('active');
});

map.on('pointermove', function (e) {
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  map.getViewport().style.cursor = hit ? 'pointer' : '';
});

function hideList() {
  document.getElementsByClassName('feature__wrapper')[0].style.display = 'none';
  document.getElementsByClassName(
    'list-group-item list-group-item-action list-group-item-secondary'
  )[0].style.display = 'block';
}

function openInfo(id) {
  document.getElementsByClassName('feature__wrapper')[0].style.display =
    'inline';
  document.getElementsByClassName(
    'list-group-item list-group-item-action list-group-item-secondary'
  )[0].style.display = 'none';
  const infoList = document.getElementsByClassName('feature__info');
  infoList[0].innerHTML = '';
  const feature = simpleFeatures.find(function (simpleFeature) {
    return simpleFeature.id == id;
  });
  const documentFragment = document.createDocumentFragment();

  for (let property in feature) {
    console.log(`openInfo -> property`, property);
    if (property !== 'geometry' && property !== 'id' && property !== 'teryt') {
      const baseElement = document.createElement('li');
      const baseElementTitle = document.createElement('div');
      baseElementTitle.innerHTML = `${dict[property]}:`;
      baseElement.appendChild(baseElementTitle);
      const baseElementUL = document.createElement('ul');
      const value = feature[property];
      if (!value) {
        const baseElementLI = document.createElement('li');
        baseElementLI.innerHTML = 'brak danych';
        baseElementUL.appendChild(baseElementLI);
      } else {
        String(value)
          .split(';')
          .forEach((subVal) => {
            if (!subVal) return;
            const baseElementLI = document.createElement('li');
            baseElementLI.innerHTML = subVal;
            baseElementUL.appendChild(baseElementLI);
          });
      }

      baseElement.appendChild(baseElementUL);
      documentFragment.appendChild(baseElement);
    }
  }
  document
    .getElementsByClassName('feature__info')[0]
    .appendChild(documentFragment);
}
function reloadFeatures() {
  var req = new XMLHttpRequest();
  req.open(
    'GET',
    'http://54.93.192.181/features',
    true
  ); /* Argument trzeci, wartość true, określa, że żądanie ma być asynchroniczne */
  req.onload = function (aEvt) {
    if (req.status == 200) {
      vectorLayer.getSource().clear();
      const resObject = JSON.parse(req.responseText);
      const features = new ol.format.GeoJSON({
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }).readFeatures(resObject);
      vectorLayer.getSource().addFeatures(features);
      vectorLayer.setStyle(style);
      createList(vectorLayer.getSource().getFeatures());
    }
  };
  req.send(null);
}

function hideAddBaseList() {
  document.getElementsByClassName('addBase__wrapper')[0].style.display = 'none';
  document.getElementsByClassName('features__wrapper')[0].style.display =
    'block';
}

function showAddBaseList(id) {
  document.getElementsByClassName('addBase__wrapper')[0].style.display =
    'inline';
  document.getElementsByClassName('features__wrapper')[0].style.display =
    'none';
  const baseList = document.getElementsByClassName('addBase__form');
  baseList[0].innerHTML = '';
  const feature = simpleFeatures[0];
  const addBaseForm = document.getElementsByClassName('addBase__form')[0];
  const buttonDiv = document.createElement('div');
  const addBaseButton = document.createElement('input');
  addBaseButton.addEventListener('click', () => {
    draw.setActive(true);
    addBaseButton.disabled = true;
  });
  addBaseButton.type = 'button';
  addBaseButton.value = 'Dodaj bazę';
  addBaseButton.id = 'add__base';
  addBaseButton.className = 'btn btn-light';
  buttonDiv.appendChild(addBaseButton);

  const removeBaseButton = document.createElement('input');
  removeBaseButton.addEventListener('click', () => {
    drawLayer.getSource().clear();
    addBaseButton.disabled = false;
  });
  removeBaseButton.type = 'button';
  removeBaseButton.value = 'Usuń bazę';
  removeBaseButton.className = 'btn btn-light';
  removeBaseButton.id = 'remove_base';
  buttonDiv.appendChild(removeBaseButton);
  addBaseForm.appendChild(buttonDiv);

  for (property in feature) {
    if (property !== 'geometry' && property !== 'id' && property !== 'teryt') {
      const formLabel = document.createElement('label');
      formLabel.innerHTML = `${dict[property]}:`;
      formLabel.htmlFor = property;

      addBaseForm.appendChild(formLabel);
      if (property === 'province') {
        const formInput = document.createElement('select');
        formInput.className = 'form-control dropdown';
        formInput.name = property;
        formInput.id = formLabel.htmlFor;

        for (let i in wojDict) {
          const option = document.createElement('option');
          option.innerText = wojDict[i];
          formInput.appendChild(option);
        }
        addBaseForm.appendChild(formInput);
      } else {
        const formInput = document.createElement('input');
        formInput.type = 'text';
        formInput.id = formLabel.htmlFor;
        formInput.name = property;
        formInput.className = 'form-control';
        addBaseForm.appendChild(formInput);
      }
    }
  }

  const formLabel = document.createElement('label');
  formLabel.innerHTML = 'Kod dostępu';
  formLabel.htmlFor = 'password';
  addBaseForm.appendChild(formLabel);

  const formInput = document.createElement('input');
  formInput.type = 'text';
  formInput.id = formLabel.htmlFor;
  formInput.name = 'password';
  formInput.className = 'form-control';
  addBaseForm.appendChild(formInput);

  const submitButton = document.createElement('input');
  submitButton.type = 'submit';
  submitButton.value = 'Prześlij';
  submitButton.className = 'btn btn-light';
  submitButton.id = 'submit_button';
  submitButton.addEventListener('click', (e) => {
    const formData = new FormData(addBaseForm);

    const features = drawLayer.getSource().getFeatures();

    if (!features[0]) {
      alert('Podaj współrzędne bazy');
      e.preventDefault();
      return;
    }
    const coordinates = features[0].getGeometry().getCoordinates();
    const transformedCoordinates = ol.proj.transform(
      coordinates,
      'EPSG:3857',
      'EPSG:4326'
    );
    const geometry = {
      type: 'Point',
      coordinates: transformedCoordinates,
    };

    var object = {};
    formData.forEach(function (value, key) {
      object[key] = value;
    });

    var json = JSON.stringify({ ...object, geometry });

    var req = new XMLHttpRequest();
    req.open('POST', 'http://54.93.192.181/features', true);
    req.onload = function (oEvent) {
      if (req.status === 200) {
        drawLayer.getSource().clear();
        hideAddBaseList();
        alert('Poprawnie dodano bazę');
        // window.location.reload();
        reloadFeatures();
        // e.preventDefault();
      } else {
        drawLayer.getSource().clear();
        reloadFeatures();
        hideAddBaseList();
        alert(
          `Podczas dodawania bazy wystąpił błąd - ${
            JSON.parse(req.responseText)['message']
          }`
        );
        // oOutput.innerHTML =
        // "Error " +
        // oReq.status +
        // " occurred when trying to upload your file.<br />";
      }
    };
    req.send(json);
    e.preventDefault();
  });
  addBaseForm.appendChild(submitButton);
}

map.on('rendercomplete', () => {
  setTimeout(() => {
    document.getElementsByClassName('loader__wrapper')[0].style.display =
      'none';
  }, 100);
  document.getElementsByClassName('sidebar__content')[0].style.display =
    'block';
});

map.once('rendercomplete', () => {
  createList(vectorLayer.getSource().getFeatures());
});

const dropdownFragment = document.createDocumentFragment();

for (let i in wojDict) {
  const option = document.createElement('option');
  option.innerText = wojDict[i];
  dropdownFragment.appendChild(option);
}

document.getElementById('wojSelect').appendChild(dropdownFragment);

$('#wojSelect').on('click', function () {
  const val = $(this).val();
  const features = vectorLayer.getSource().getFeatures();
  if (val) {
    const filtered = features.filter((f) => f.get('province') === val);
    const inviFeatures = features.filter((f) => f.get('province') !== val);
    filtered.forEach((f) => {
      f.setStyle(style);
    });
    inviFeatures.forEach((f) => {
      f.setStyle(inviStyle);
    });
    createList(filtered);
  } else {
    features.forEach((f) => {
      f.setStyle(style);
    });
    createList(features);
  }
});

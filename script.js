

var x = document.getElementById("feedback");

getLocation();

function loadMap(){
	
var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([userLongitude, userLatitude]),
    zoom: 4
  })
});

var layer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [
        new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([userLongitude,userLatitude]))
        })
    ]
  })
 });
 map.addLayer(layer);
console.log(userLatitude);
console.log(userLongitude);
}




function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  userLatitude = position.coords.latitude;
  userLongitude = position.coords.longitude;

  loadMap();
}


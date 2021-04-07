

var x = document.getElementById("");

getLocation();


function loadMap(){

var marker = new ol.Overlay({
	element: document.getElementById('location'),
	position: ol.proj.fromLonLat([userLongitude,userLatitude]),
	positioning: 'bottom-left',
	stopEvent: false
	});
	
var view = new ol.View({
    center: ol.proj.fromLonLat([userLongitude, userLatitude]),
    zoom: 15
  
})
	
var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: view
});

// var layer = new ol.layer.Vector({
  // source: new ol.source.Vector({
    // features: [
        // new ol.Feature({
            // geometry: new ol.geom.Point(ol.proj.fromLonLat([userLongitude,userLatitude]))

        // })
    // ]
  // })
 // });
 //map.addLayer(layer);
 console.log(userLongitude);
  console.log(userLatitude);
  
 map.addOverlay(marker);


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


 

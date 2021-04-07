

var x = document.getElementById("launc");
var CurLocation = document.getElementById('exampleInputPassword1');
getLocation();


function loadMap(){

var marker = new ol.Overlay({
	element: document.getElementById('location'),
	position: ol.proj.fromLonLat([userLongitude,userLatitude]),
	positioning: 'bottom-left',
	stopEvent: false
	});
	
var view = new ol.View({
    center: ol.proj.fromLonLat([userLongitude+0.001, userLatitude-0.003]),
    zoom: 15
  
})
	
var map = new ol.Map({
  target: 'map',
  controls: [],
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: view
});



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
  
  userLatitude = toFixedIfNecessary( userLatitude, 6 );
  userLongitude = toFixedIfNecessary( userLongitude, 6 );
  userLatitude = parseFloat(userLatitude);
  userLongitude = parseFloat(userLongitude);
  // console.log(userLatitude),
  // console.log(userLongitude);
  
  loadMap();
  simpleReverseGeocoding();
  
   
}
function toFixedIfNecessary( value, dp ){
  return +parseFloat(value).toFixed( dp );
}

function simpleReverseGeocoding() {

	fetch('https://nominatim.openstreetmap.org/reverse?format=json&lon=' + userLongitude + '&lat=' + userLatitude).then(function(response) {
	  return response.json();
	}).then(function(json) {
		console.log(json.error);
	  CurLocation.value = json.address.road +" " + json.address.house_number+ ", "+json.address.municipality +", " +json.address.county;
	  console.log(json);
	})
}




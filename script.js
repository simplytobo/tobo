
 var lengthMemory = 0;
var x = document.getElementById("launc");
var CurLocation = document.getElementById('InputLocation');
var AutocompleteDest = document.getElementById('AutocompleteDatalist')
var inputDestination = document.getElementById('inputDestination')
var addDestmark = false;
getLocation();

inputDestination.addEventListener('input', AutoComplete);
AutocompleteDest.addEventListener('change', function() {inputDestination.value= this.value;});
AutocompleteDest.addEventListener('mouseover', function(e) {
  console.log("works hovering")
  AutocompleteDest.selectedIndex = e;
  var configurationvalue = e.target.value;
  
  inputDestination.value = configurationvalue;

});


inputDestination.addEventListener('keydown', function(e) {
  if(e.key === "ArrowDown") {  //down arrow
    AutocompleteDest.selectedIndex = Math.min(AutocompleteDest.selectedIndex+1, AutocompleteDest.options.length-1);
    this.value= AutocompleteDest.value;
  }
  else if(e.key === "ArrowUp") { //up arrow
    AutocompleteDest.selectedIndex = Math.max(AutocompleteDest.selectedIndex-1, 0);
    this.value= AutocompleteDest.value;
  }
});
function loadMap(){
    

locationMarker = new ol.Overlay({
	element: document.getElementById('location'),
	position: ol.proj.fromLonLat([userLongitude,userLatitude]),
	positioning: 'bottom-center',
	stopEvent: false
});

var view = new ol.View({
    center: ol.proj.fromLonLat([userLongitude+0.001, userLatitude-0.003]),
    zoom: 15
  
})
	
map = new ol.Map({
  target: 'map',
  controls: [],
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

map.addOverlay(locationMarker);


 





//  map.on('click', function(e) {
// 	var coordinate = ol.proj.toLonLat(e.coordinate).map(function(val) {
// 	  return val.toFixed(6);
// 	});
// 	var lon = userLongitude;
// 	var lat = userLatitude ;
// 	simpleReverseGeocoding2(lon, lat);
//   });

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

	fetch('http://nominatim.openstreetmap.org/reverse?format=json&lon=' + userLongitude + '&lat=' + userLatitude).then(function(response) {
	  return response.json();
	}).then(function(json) {
		if(json.error){
      console.log(json.error);
    }
	  CurLocation.value = json.address.road +" " + json.address.house_number+ ", "+json.address.municipality +", " +json.address.county;
	
	})
}
//Adds locations to dropdown menu
function change(apiAddresses) {
  
  var options= [],
  words= inputDestination.value.toLowerCase().trim().split(' '),
  match,
  s= '';
  
  for (i = 0; i<  apiAddresses.length;i++){ 
    options.push(apiAddresses[i].name);
    console.log(options);

  }

  if((apiAddresses.length > 0)== false){
    optionsMemory = options ; 
  }

  options.forEach(function(o) {
    match= true;
    
    words.forEach(function(w) {
      
      if(w > '' && 
         o.toLowerCase().indexOf(w) !== 0 && 
         o.toLowerCase().indexOf(' '+w) === -1) {
        match= false;
      }
    });

    if(match) {
      s+= '<option>' +o;
      //console.log(s);
    }
  });

  AutocompleteDest.innerHTML= s;
  AutocompleteDest.size= AutocompleteDest.options.length;
}

function AutoComplete() {

  var length = inputDestination.value.length;
  var lengthMemory;
  if((length == 3 || length== 5 || length > 6) && length != lengthMemory){
    lengthMemory =length;
    //used to check for duplicates; only name!
    var optionsArray = [];

    //used to get user inputed destination; 
    var aCompleteObjectInfo = [];
    
    AutocompleteDest.innerHTML= "";
    
    //Users inputted destination
    userInputDest = inputDestination.value;

    fetch('https://app.geocodeapi.io/api/v1/autocomplete?&apikey=fb14e9a0-983b-11eb-9986-676912355ab5&text=' + userInputDest +'&size=5').then(function(response) {
      return response.json();
    }).then(function(json) {
      if(json.error){
        console.log(json.error);
      }
      console.log(json.features[0].geometry.coordinates[1]);
      console.log(json.features[0].geometry.coordinates[0]);
      console.log(json.features);
     
      //loops through json addresses and adds them to html select 
      for (i = 0; i<  json.features.length;i++){
        addressName = json.features[i].properties.name.replace(/\s+/g, '').toLowerCase();
        //check for duplicates
        if(optionsArray.includes(addressName) === false){
          console.log(optionsArray);
          console.log(addressName);
          optionsArray.push(addressName);
          //if no duplicates push 
          aCompleteObjectInfo.push({
            name: json.features[i].properties.name,
            longitude: json.features[i].geometry.coordinates[0],
            latitude: json.features[i].geometry.coordinates[1],
            label: json.features[i].properties.label,
            id: json.features[i].properties.id,
          })
        } 
        
      }
      //Gets the addresses from JSON and shows them for the user in select(dropbox) element
      change(aCompleteObjectInfo);

      //check if user clicked option in datalist; input destination
      var val = inputDestination.value;
      var opts = AutocompleteDest.childNodes;
      for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === val) {
          // An item was selected from the list!
          // yourCallbackHere()
          console.log("user clicked datalist + name "+ aCompleteObjectInfo[i].name);
          console.log("user clicked datalist "+ opts[i].value);
          addDestmark = true;
          var destLat = aCompleteObjectInfo[i].latitude;
          var destLong = aCompleteObjectInfo[i].longitude;
          loadMap();
          //loadMap().addDestinationMarker(aCompleteObjectInfo[i].latitude, aCompleteObjectInfo[i].longitude);
          var destinationMarker = new ol.Overlay({
            element: document.getElementById('location'),
            position: ol.proj.fromLonLat([destLong,destLat]),
            positioning: 'bottom-center',
            stopEvent: false
            });
          map.addOverlay(locationMarker);
        
        }
      }
  
    })
    
  }
}






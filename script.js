
var lengthMemory = 0;
var timeMemory = 0;
var userClickedDropdown = false;  //bool
var stopLoop = false; //bool
//autocomplete dropbox input speed
var autoCompleteSpeed = 2000;
var launchScreen = document.getElementById("launch-screen");
var taxiScreen = document.getElementById("taxi-screen");
var CurLocation = document.getElementById('InputLocation');
var CurLocation2 = document.getElementById('InputLocation2');
var AutocompleteDest = document.getElementById('AutocompleteDatalist');
var inputDestination = document.getElementById('inputDestination');
var inputDestination2 = document.getElementById('inputDestination2')
var routeDistance = document.getElementById('routeDistance')
var routeTime = document.getElementById('routeTime')
var searchBtn = document.getElementById('searchBtn')
var addDestmark = false;
getLocation();
//taxis

var boltBasic = document.getElementById('boltBasic');
var bolt = document.getElementById('bolt');
var uber = document.getElementById('uber');

//inputDestination.addEventListener('input', AutoComplete);
//AutocompleteDest.addEventListener('input', function() {inputDestination.value= this.value;});
AutocompleteDest.addEventListener('click', changeBoolValue);

inputDestination.addEventListener('input', AutoComplete);

inputDestination.addEventListener('focus', function(){
 
  if(AutocompleteDest.innerHTML.trim().length > 0 && lengthMemory != inputDestination.value.length){
    AutocompleteDest.style.display = "flex";
  }
});

// inputDestination.addEventListener('blur', function(){
// AutocompleteDest.style.display = "none";
// });


function changeBoolValue(e){
  
  AutocompleteDest.selectedIndex = e;
  var configurationvalue = e.target.innerHTML;
  lengthMemory = inputDestination.value.length;
  AutocompleteDest.style.display = "none";
  inputDestination.value = configurationvalue;
  userClickedDropdown = true;
  //console.log(userClickedDropdown);

}


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
		if(json.error){
      console.log(json.error);
    }
	  CurLocation.value = json.address.road +" " + json.address.house_number+ ", "+json.address.municipality +", " +json.address.county;
	
	})
}
//Adds locations to dropdown menu with id so that when user later clicks i know which one he/she clicked
function change(apiAddresses) {

 
  var options= [],
  
  words= inputDestination.value.toLowerCase().trim().split(' '),
  match,
  s= '';
  
  for (i = 0; i<  apiAddresses.length;i++){ 
    options.push(apiAddresses[i].name)

    //console.log(options);

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
      s+= '<div>' +o+'</div>';
      //console.log(s);
    }
  });

  AutocompleteDest.innerHTML= s;
  //AutocompleteDest.size= AutocompleteDest.options.length;
  if(AutocompleteDest.innerHTML != ""){
    AutocompleteDest.style.display = "flex";
  }
}

//call function Autocomplete after some time
function callFunction(){
    // do whatever you like here
    AutoComplete();
    if(userClickedDropdown == true){
      userClickedDropdown = false;
      lengthMemory = inputDestination.value.length;
    };

    setTimeout(callFunction, 3000);

    

}
callFunction();


function AutoComplete() {
  
  var length = inputDestination.value.length;
  
  var curDate = new Date();
  var curTime = curDate.getTime();

  // console.log(curTime > timeMemory + autoCompleteSpeed);
  // console.log(length != lengthMemory);
  //console.log("loop: "+stopLoop);
  if(curTime > timeMemory + autoCompleteSpeed
   && length != lengthMemory && length > 2 && userClickedDropdown == false){
    
    console.log("autocomplete executed");
    lengthMemory =length;
    timeMemory = curTime;
    //used to check for duplicates; only name!
    var optionsArray = [];

    //used to get user inputed destination; 
    aCompleteObjectInfo = [];
    
    AutocompleteDest.innerHTML= "";
    
    //Users inputted destination
    userInputDest = inputDestination.value;

    fetch('https://app.geocodeapi.io/api/v1/autocomplete?&apikey=fb14e9a0-983b-11eb-9986-676912355ab5&text=' + userInputDest +'&size=5').then(function(response) {
      return response.json();
    }).then(function(json) {
      if(json.error){
        console.log(json.error);
      }
      //console.log(json.features[0].geometry.coordinates[1]);
      //console.log(json.features[0].geometry.coordinates[0]);
      //console.log(json.features);
     
      //loops through json addresses and adds them to html select 
      for (i = 0; i<  json.features.length;i++){
        addressName = json.features[i].properties.name.replace(/\s+/g, '').toLowerCase();
        //check for duplicates
        if(optionsArray.includes(addressName) === false){
          //console.log(optionsArray);
          //console.log(addressName);
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
          //console.log("user clicked datalist + name "+ aCompleteObjectInfo[i].name);
          //console.log("user clicked datalist "+ opts[i].value);
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

function showTaxiScreen(){
  taxiScreen.style.display = "flex";
  launchScreen.style.display = "none";
  CurLocation2.value = CurLocation.value;
  inputDestination2.value = inputDestination.value;
  direction();

   
}
function showLaunchScreen(){
  taxiScreen.style.display = "none";
  launchScreen.style.display = "flex";
}

//calculates distance between two points
function direction(){
  var destination = inputDestination.value;
  var match = false;
  for (i = 0; i<  aCompleteObjectInfo.length;i++){
    //console.log("object "+ aCompleteObjectInfo[i].name);
    //console.log("destination "+ destination);
    if(aCompleteObjectInfo[i].name == destination && match == false){
      //console.log("longitude " + aCompleteObjectInfo[i].longitude);
      //console.log("latidude " + aCompleteObjectInfo[i].latitude);
      DestinationLongitude = aCompleteObjectInfo[i].longitude;
      DestinationLatidude = aCompleteObjectInfo[i].latitude;

      match = true
    }
    //console.log("didnt match"); 
  }
  fetch("https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248bafc4bdb37d4482c8604ac2d495e8cbc&start="+userLongitude +","+
   userLatitude+"&end="+DestinationLongitude+","+DestinationLatidude).then(function(response) {
      return response.json();
    }).then(function(json) {
      // if(json.error){
      //   console.log(json.error);
      // }
     // console.log(json);
      //console.log("Distance " +Math.round((json.features[0].properties.summary.distance)/ 100)/10);
      //console.log("Time: "+ Math.round((json.features[0].properties.summary.duration)/ 60));

      routeDistance.innerHTML = "";
      var routeInKm = Math.round((json.features[0].properties.summary.distance)/ 100)/10
      var distanceDiv = document.createElement("h6");
      distanceDiv.innerHTML = routeInKm + " km";
      
      routeDistance.appendChild(distanceDiv);

      routeTime.innerHTML = "";
      var routeInMinute = Math.round((json.features[0].properties.summary.duration)/ 60);
      var timeDiv = document.createElement("h6");
      timeDiv.innerHTML = routeInMinute +" min";
      routeTime.appendChild(timeDiv);

      boltBasic.innerHTML = "estimated price: " + (1+calcFare(0.10,0.35,routeInKm, routeInMinute)) + "€";

      uber.innerHTML = "estimated price: " + (1.2+calcFare(0.11,0.40,routeInKm, routeInMinute)) + "€";

      bolt.innerHTML = "estimated price: " + (1.2+calcFare(0.14,0.39,routeInKm, routeInMinute)) + "€";

      




  })
}
function calcFare(minuteFare, distanceFare, routeInKm,routeInMinute){
  price = Math.round((minuteFare*routeInMinute*10)/10 + (distanceFare*routeInKm*10)/10);
  return price;
}


var map, infoWindow;
var distance = null;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 16
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var target = {
                lat: 37.424315,
                lng: -122.170150
            }

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);

            distance = measure(pos.lat, pos.lng, target.lat, target.lng);

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        console.log('location error')
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function getLocation(){
  
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function measure(lat1, lon1, lat2, lon2) {
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000; // meters
}

var timer = new Timer();
timer.start({countdown: true, startValues: {seconds: 300}});
timer.pause();

$('#distance').html(Math.floor(distance) + ' meters');

$('#countdownExample .values').html(timer.getTimeValues().toString());

$('#button').on('vmousedown', function () {
  
  initMap();
  $('#distance').html(Math.floor(distance) + ' meters');

  if(distance > 50 || !distance){
    $('#status').html('Out of range')
    timer.pause();    
  }else{
    $('#status').html('Connecting')
    timer.start();
  }

  setTimeout(function () {
    initMap();
    $('#distance').html(Math.floor(distance) + ' meters');
    if(distance > 50 || !distance){
      $('#status').html('Out of range')
      timer.pause();    
    }else{
      $('#status').html('Connecting')
      timer.start();
    }
  }, 5000);

}).on('vmouseup', function () {
  $('#status').html('Signal lost')
  timer.pause();
});

timer.addEventListener('secondsUpdated', function(e) {
  $('#countdownExample .values').html(timer.getTimeValues().toString());
});

timer.addEventListener('targetAchieved', function(e) {
  $('#status').html('Uplink Completed')
  $('#countdownExample .values').html('Code: 312');
});


NUM_SOUNDS = 3

var id = "dev" + (new Date()).getTime();


var gpsSettings = { 'origin': {'lon':  -71.264367, 'lat': 42.293178},
                    'lon_max': -71.263536,
                    'lat_max': 42.293801};


function setVolume(vol){
    // var bingSound = document.getElementById('bing');
    // console.log('set bingSound.volume to ', vol);
    // bingSound.volume = vol;

    try{ volumes = JSON.parse(vol); }
    catch(err) { console.log("could not decode", vol); }

    console.log("Received volumes:");

    for(var i=0; i<volumes.volumes.length; i++){
      console.log(i, volumes.volumes[i].vol)
    }
    return 1;
}

function playBing(){
  var bingSound = document.getElementById('bing');
  console.log("playing bingSound");
  bingSound.play();
}

function toggleLoop(){
  var bingSound = document.getElementById('bing');
  console.log('toggling bingSound loop to ', !bingSound.loop);
  bingSound.loop = !bingSound.loop;
}


function sendPosition(){
  var gpsPos = {};
  var xyPos = {};

  xyPos.lat = document.getElementById('latPosSlide').value;
  xyPos.lon = document.getElementById('lonPosSlide').value;

  gpsPos.lat = ((xyPos.lat/1000) * (gpsSettings.lat_max - gpsSettings.origin.lat) + gpsSettings.origin.lat).toFixed(9);
  gpsPos.lon = ((xyPos.lon/1000) * (gpsSettings.lon_max - gpsSettings.origin.lon) + gpsSettings.origin.lon).toFixed(9);

  document.getElementById('latVal').innerHTML = String(xyPos.lat + "\t" + gpsPos.lat);
  document.getElementById('lonVal').innerHTML = String(xyPos.lon + "\t" + gpsPos.lon);

  var position = {"lat": Number(gpsPos.lat), "lon": Number(gpsPos.lon), 'id':id};


  jsonLocation = JSON.stringify(position);
  socket.emit('position', jsonLocation);
  // console.log('sent position', position.x, position.y);
}

function populateSounds() {
  var soundsList = document.getElementById("sounds-list");
  console.log(soundsList);

  var i = 0;
  for(i=0; i<NUM_SOUNDS; i++){
    var li = document.createElement("li");
    var audio = document.createElement("audio");
    audio.src = "/webapp/static/assets/" + i + ".ogg";
    // audio.type = "audio/ogg";

    li.appendChild(audio);
    soundsList.appendChild(li);
  }
}


var socket = io();
socket.emit('connection', '');
socket.on('volumes', setVolume);


document.onload = function(){
  // sendPosition();
  populateSounds();
};

// setInterval(sendPosition, 1000);

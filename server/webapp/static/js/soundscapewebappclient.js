NUM_SOUNDS = 9;
var using_gps = true;

var xyPos = {},
    gpsPos = {},
    position_packet = {},
    num_volume_packets = 0,
    watchID;

var id = "dev" + (new Date()).getTime();


var gpsSettings = { 'origin': {'lon':  -71.264367, 'lat': 42.293178},
                    'lon_max': -71.263536,
                    'lat_max': 42.293801};


function toggleGPS() {
  using_gps = !using_gps;
  document.getElementById("using_gps").innerHTML = "Using GPS: " + using_gps;

  if(using_gps){
    watchID = navigator.geolocation.watchPosition(sendPosition, errorPosition, geo_options);
  } else{
    navigator.geolocation.clearWatch(watchID);
  }

}

function playAllSounds(){
  var soundsList = document.getElementById("sounds-list").children;
  var cur_sound;
  for(var i=0; i<soundsList.length; i++){
    cur_sound = document.getElementById("sound"+i);
    cur_sound.play();
  }
}

function setVolume(vol){
  num_volume_packets++;
  document.getElementById('num_volume_packets').innerHTML = num_volume_packets;

  try{ volumes = JSON.parse(vol); }
  catch(err) { console.log("could not decode", vol); }
  //
  // console.log("Received volumes:");

  var soundsList = document.getElementById("sounds-list").children;

  var num_sounds = Math.min(volumes.volumes.length, soundsList.length);

  // console.log("num_sounds " + num_sounds);
  for(var i=0; i<num_sounds; i++){
    // console.log("sound"+i+"\t" + volumes.volumes[i].vol);

    var cur_sound = document.getElementById("sound"+i);

    if(volumes.volumes[i].vol === 0){
      cur_sound.pause();
    }
    else{
      cur_sound.volume = volumes.volumes[i].vol;
      cur_sound.play();
    }
  }
  return 1;
}

function updatePosition() {
    if (using_gps) {
      // // alert("using_gps")
      // if(navigator.geolocation){
      //   // alert("navigator.geolocation")
      //   navigator.geolocation.getCurrentPosition(sendPosition, errorPosition);
      //   document.getElementById('gps_coordinates').innerHTML = position_packet.lat + " " + position_packet.lon;
      // }
      // else{
      //   alert("GPS not supported");
      // }

    } else {
      gpsPos.coords = {};

      xyPos.lat = document.getElementById('latPosSlide').value;
      xyPos.lon = document.getElementById('lonPosSlide').value;

      gpsPos.coords.latitude = ((xyPos.lat/1000) * (gpsSettings.lat_max - gpsSettings.origin.lat) + gpsSettings.origin.lat).toFixed(9);
      gpsPos.coords.longitude = ((xyPos.lon/1000) * (gpsSettings.lon_max - gpsSettings.origin.lon) + gpsSettings.origin.lon).toFixed(9);

      document.getElementById('latVal').innerHTML = String(xyPos.lat + "\t" + gpsPos.coords.latitude);
      document.getElementById('lonVal').innerHTML = String(xyPos.lon + "\t" + gpsPos.coords.longitude);
      sendPosition(gpsPos);
    }
}

function sendPosition(gpsPos){
  // alert("start sendPosition");
  position_packet = {"lat": Number(gpsPos.coords.latitude), "lon": Number(gpsPos.coords.longitude), 'id':id};


  jsonLocation = JSON.stringify(position_packet);
  socket.emit('position', jsonLocation);

  // alert('sent position', position_packet);
}

function errorPosition(err) {
  alert("Pos failed" + err)
  console.log(err);
}

function populateSounds() {
  var soundsList = document.getElementById("sounds-list");
  // console.log(soundsList);

  var i = 0;
  for(i=0; i < NUM_SOUNDS; i++){
    var li = document.createElement("li");
    var audio = document.createElement("audio");
    audio.src = "/webapp/static/assets/" + i + ".ogg";
    audio.autoplay = true;
    audio.volume = 0;
    audio.controls = true;
    audio.loop = true;
    audio.id = "sound" + i;
    // audio.type = "audio/ogg";

    li.appendChild(audio);
    soundsList.appendChild(li);
  }

  // console.log(soundsList.childElementCount);
}


var socket = io();
socket.emit('connection', '');
socket.on('volumes', setVolume);


window.onload = function(){
  updatePosition();
  populateSounds();
};

var geo_options = {
  enableHighAccuracy: true
};

// setInterval(updatePosition, 1000);
watchID = navigator.geolocation.watchPosition(sendPosition, errorPosition, geo_options);

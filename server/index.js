const opener = require('opener');
const path = require('path');


// A little bit of magic requires
const express = require('express');
const app = express();

// Start http server
const http = require('http').Server(app);
http.listen(8080);

const io = require('socket.io')(http);


// opener('http://localhost:8080');


// SETUP: Put Locations of Sounds HERE:
var soundLocations = {'soundLocations': [
  {"x":  0, "y":  0, "radius": 100},
  {"x": 500, "y": 500, "radius": 700},
  {"x": 100, "y": 100, "radius": 100},
  {"x": 600, "y": 200, "radius": 300}
]};

var areaSize = {"x": 1000, "y": 1000};

var gpsSettings = { 'origin': {'lon':  -71.264367, 'lat': 42.293178},
                    'lon_max': -71.263536,
                    'lat_max': 42.293801};


// Serve map.html on root
app.get('/', function(req, res){
  res.sendFile(__dirname + '/map.html');
});

app.get('/debug', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


// Serve all files from static
app.use('/static', express.static(path.join(__dirname, '/static')));


// Start socket
io.on('connection', function(socket){
  console.log("user connected");
  socket.emit('soundLocations', soundLocations);

  socket.on('position', function (msg) {
    // Decodes the position, then calculates volumes from position
    position = decodePosition(msg);
    volumes = calcVolumes(position);

    // Send the volumes
    socket.emit('volumes', JSON.stringify(volumes));
    io.emit('vizPositions', position)
    console.log("sent volumes", volumes);
  });
});




// Functions



function calcVolumes(position) {
  var soundVolumes = {'volumes':[]};

  // Iterates through soundLocations and set a volume for each
  for(var i=0; i<soundLocations.soundLocations.length; i++){
    // console.log("Sound", i);
    // console.log(lengthFromPoints(position, soundLocations[i]));
    distance = lengthFromPoints(position, soundLocations.soundLocations[i]);
    volume = volumeFromDist(distance, soundLocations.soundLocations[i].radius);
    i_str = i.toString();

    console.log("Sound", i, "vol", volume, "dist", distance);
    soundVolumes.volumes.push({'vol': volume});
  }

  return soundVolumes;
}



function lengthFromPoints(p1, p2){
  a = p2.x - p1.x;
  b = p2.y - p1.y;
  // console.log(p1, p2);
  // console.log(a, b);
  // console.log(a*a + b*b);
  return Math.sqrt(a*a + b*b);
}


function volumeFromDist(dist, radius) {
  var vol = 1 - (dist/radius);

  if(vol > 1){ return 1; }
  if(vol < 0){ return 0; }
  return vol;
}


function decodePosition(jsonPosition) {
  try{ gpsCoord = JSON.parse(jsonPosition); }
  catch(err) { console.log("could not decode ", jsonPosition); }

  // console.log('gpsCoord', gpsCoord);

  position = xyPosFromGPS(gpsCoord);

  console.log('gpsCoord', gpsCoord, "position", position);

  return position;
}


function xyPosFromGPS(gpsCoord){
  var position = {'x':0.33, 'y':0.33, 'id':gpsCoord.id};

  if(!isFinite(gpsCoord.lon) || !isFinite(gpsCoord.lat)){
    console.log("Incorrect gps coord", gpsCoord);
    return NaN;
  }

  // console.log(gpsCoord.lon, gpsSettings.origin.lon);
  // console.log("gpsCoord", Number(gpsCoord.lon) - gpsSettings.origin.lon);
  // console.log("gpsMax", (gpsSettings.lon_max - gpsSettings.origin.lon));

  position.y = areaSize.y * ((Number(gpsCoord.lon) - gpsSettings.origin.lon) / (gpsSettings.lon_max - gpsSettings.origin.lon));
  position.x = areaSize.x * ((Number(gpsCoord.lat) - gpsSettings.origin.lat) / (gpsSettings.lat_max - gpsSettings.origin.lat));

  console.log(position);

  return position;
}

console.log("started server on port 8080");

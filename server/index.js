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
var soundLocations = [
  {"x":  0, "y":  0},
  {"x": 50, "y": 50},
  {"x": 25, "y": 10}
];

var areaSize = {"x": 1000, "y": 1000};



// Serve index.html on load
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Serve all files from static
app.use('/static', express.static(path.join(__dirname, '/static')));


// Start socket
io.on('connection', function(socket){
  console.log("user connected");
  socket.on('position', function(msg){
    // Decodes the position, then calculates volumes from position
    position = decodePosition(msg);
    volumes = calcVolumes(position);


    // Send the volumes
    socket.emit('volumes', JSON.stringify(volumes));
    console.log("sent volumes", volumes);
  });
});


// Functions

function calcVolumes(position) {
  var soundVolumes = {'volumes':[]};

  // Iterates through soundLocations and set a volume for each
  for(var i=0; i<soundLocations.length; i++){
    console.log("Sound", i);
    // console.log(lengthFromPoints(position, soundLocations[i]));
    distance = lengthFromPoints(position, soundLocations[i]);
    volume = volumeFromDist(distance);
    i_str = i.toString();

    console.log(volume, distance);
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


function volumeFromDist(dist) {
  // Needs to be set correctly
  return Math.max(1 - (dist/100), 0);
}


function decodePosition(jsonPosition) {
  try{ position = JSON.parse(jsonPosition); }
  catch(err) { console.log("could not decode", jsonPosition); }

  position.x = Number(position.x);
  position.y = Number(position.y);

  console.log("position:", position);

  return position;
}

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
  var xPos = document.getElementById('xPosSlide').value;
  var yPos = document.getElementById('yPosSlide').value;

  var position = {"x": Number(xPos), "y": Number(yPos)};

  jsonLocation = JSON.stringify(position);
  socket.emit('position', jsonLocation);
  // console.log('sent position', position.x, position.y);
}


var socket = io();
socket.emit('connection', '');

socket.on('volumes', setVolume);

// sendPosition();
setInterval(sendPosition, 2000);

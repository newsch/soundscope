function Person(person_id, location, sound){
  this.is = person_id;

  this.set_location = function (x, y){
    this.x = x;
    this.y = y;
  };

  this.get_location = function (){
    var location = []
    location.push(this.x);
    location.push(this.y);
    return location
  }
  this.move = function(dx, dy){
    this.x += dx;
    this.y += dy;
  }
  this.sound = sound; // sound object
}

function Beacon(){

}
function Sound(){

}


var r = new Rune({
  container: "body",
  width: 600,
  height: 600,
  frameRate : 20,
  debug: true
});

var people = []

var rectangle = r.rect(0, 0, 100, 50);

r.on('update', function() {
  rectangle.move(Rune.random(-10, 10), 0, true)
});

r.play()

function Thing(location){
  this.id = location.id;
  this.music = null;
  this.x = location.x;
  this.y = location.y;
  this.get_location = function (){
    var tmp = []
    tmp.push(this.x);
    tmp.push(this.y);
    return tmp
  }
  this.set_location = function (x,y){
    this.x = x;
    this.y = y;
  }
  this.update_color = function(color){
    this.color = color;
    this.shape.fill(this.color)
  }
  this.moveTo = function(x, y){
    this.x = x;
    this.y = y;
    this.shape.move(this.x, this.y)
  }
  return this;
}

function Person(location, stage){
  Thing.call(this, location)

  this.width = 50;
  this.height = 50;
  this.shape = new Rune.Ellipse(this.x, this.y,
    this.width, this.height)
    .fill(this.color).addTo(stage);

  this.move = function(dx, dy){
    this.x = this.x + dx;
    this.y = this.y + dy;
    this.shape.move(dx, dy, true)
  }
  this.update_size = function(width, height){
    this.width = width;
    this.height = height;
    this.shape.state.width = width;
    this.shape.state.height= height;
  }
  return this;

}

function Beacon(location, stage){
  Thing.call(this, location)
  this.color = new Rune.Color('hsv', 10, 100, 70)
  this.shape = new Rune.Triangle(0, 0, 100, 0, 50, 50)
    .fill(this.color).addTo(stage);
  return this;
}

var r = new Rune({
  container: "body",
  width: 600,
  height: 600,
  frameRate : 60,
  debug: true
});
var my_group = r.group(0, 0)

my_location = {
  id: 1,
  type: "person",
  x: 300,
  y: 300
}

me = new Person(my_location, my_group)
me_color = new Rune.Color('hsv', 0, 50, 50, 0.3)
me.update_color(me_color)


me2 = new Person(my_location, my_group)
me2.update_size(100, 100)
me2.moveTo(400, 400)

me3 = new Beacon(my_location, my_group)
me3.moveTo(250, 0)

console.log(my_group)
r.on('update', function() {
  me.move(Rune.random(-5,5), Rune.random(-5,5))
  me3.update_color(new Rune.Color('hsv', 10,
  Rune.random(10, 100), Rune.random(10, 100)))
});

r.play()

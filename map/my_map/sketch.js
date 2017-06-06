function Thing(location){
  this.id = location.id;
  this.shape = null;
  this.music = null;
  this.color = null;
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
  return this;
}

function Person(location){
  Thing.call(this, location)
  this.move = function(dx, dy){
    this.x = this.x + dx;
    this.y = this.y + dy;
    this.shape.move(this.x, this.y, 0, true)
  }

  this.width = 50;
  this.height = 50;
  this.shape = new Rune.Ellipse(this.x, this.y,
    this.width, this.height)
    .fill(this.color).addTo(myGroup);

  this.update_size = function(width, height){
    this.width = width;
    this.height = height;
    this.shape.state.width = width;
    this.shape.state.height= height;
  }
  return this;

}

function Beacon(location){
  Thing.call(this, location)
  this.shape = new Rune.triangle(0, 0, 100, 50, r);
  return this;
}

// function getSampleLocations(rawJsonData) {
//   jsonData = JSON.parse();
//   for (let location in rawJsonData) {
//     console.log(location);
//   }
// }

var sampleInput = {
  "locations": [
    {
      "id": "1",
      "type": "person",
      "x": 0,
      "y": 0
    },
    {
      "id": "2",
      "type": "person",
      "x": 10,
      "y": 20
    }
  ]
};

var people = [];
for (let location in sampleInput.locations) {
  people.push(new Person(sampleInput.locations[location]));
}

function updateLocations(locations) {
  for (var location in locations) {
    if (foundPerson = people.find(function(person) {return person.is == location.id})) {
      foundPerson.move(location.x, location.y);
      console.log('moved person ', foundPerson.id);
    } else {
      console.log('No matching person found for id ', location.id);
    }
  }
}

var r = new Rune({
  container: "body",
  width: 600,
  height: 600,
  frameRate : 60,
  debug: true
});

var myGroup = r.group(0, 0)


my_location = {
  id: 1,
  type: "person",
  x: 300,
  y: 300
}

me = new Person(my_location)
me_color = new Rune.Color('hsv', 0, 50, 50, 0.3)
me.update_color(me_color)
console.log(me)

me2 = new Person(my_location)
me2.update_size(100, 100)


r.on('update', function() {
  me.move(Rune.random(-5,5), Rune.random(-5,5))
  me2.move(Rune.random(-5,5), Rune.random(-5,5))
});

r.play()

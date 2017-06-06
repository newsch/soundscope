function Thing(location){
  this.id = location.id;
  this.shape = null;
  this.x = location.x;
  this.y = location.y;
  this.get_location = function (){
    var tmp = []
    tmp.push(this.x);
    tmp.push(this.y);
    return tmp
  }
  return this;
}

function Person(location){
  Thing.call(this, location)

  this.shape = r.ellipse(this.x, this.y, 30, 30);
  this.move = function(dx, dy){
    this.x = this.x + dx;
    this.y = this.y + dy;
    this.shape.move(this.x, this.y, 0, true)
  }
  return this;
}

function Beacon(location){
  Thing.call(this, location)
  this.shape = r.triangle(0, 0, 100, 50);
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

my_location = {
  id: 1,
  type: "person",
  x: 300,
  y: 300
}

me = new Person(my_location)
console.log(me)
r.on('update', function() {
  me.move(Rune.random(-10,10), Rune.random(-10,10))
});

r.play()

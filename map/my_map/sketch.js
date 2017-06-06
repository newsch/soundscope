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
  this.moveTo = function(x, y){
    this.x = this.x;
    this.y = this.y;
    this.shape.move(this.x, this.y, 0, false);
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

var r = new Rune({
  container: "body",
  width: 600,
  height: 600,
  frameRate : 60,
  debug: true
});

var myGroup = r.group(0, 0)


my_location = {
  id: '0',
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


// r.on('update', function() {
//   me.move(Rune.random(-5,5), Rune.random(-5,5))
//   me2.move(Rune.random(-5,5), Rune.random(-5,5))
// });

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

var sampleInput2 = {
  "locations": [
    {
      "id": "1",
      "type": "person",
      "x": 10,
      "y": 10
    },
    {
      "id": "3",
      "type": "person",
      "x": 20,
      "y": 30
    },
  ]
};

var people = [];
for (let location of sampleInput.locations) {  // initial list of people
  thisPerson = new Person(location)
  people.push(thisPerson);
  console.log('created person', thisPerson.id, '@', thisPerson.x, thisPerson.y);
}

function updateLocations(locations) {
  for (let location of locations) {
    foundPerson = people.find(function(person) {return person.id == location.id});
    if (foundPerson !== undefined) {
      foundPerson.moveTo(location.x, location.y);
      console.log('moved person', foundPerson.id, 'to', location.x, location.y);
    } else {
      console.log('No matching person found for id', location.id);
    }
  }
}

r.play()

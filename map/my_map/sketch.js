var r = new Rune({
  container: "body",
  width: 600,
  height: 600,
  frameRate : 60,
  debug: true
});

var my_group = r.group(0, 0);

var people = [];
var beacons = [];
var sampleInitialInput = {
  "locations": [
    {
      "id": "3",
      "type": "person",
      "x": 0,
      "y": 0
    },
    {
      "id": "4",
      "type": "person",
      "x": 100,
      "y": 100
    }
  ]
};

var initialBeacons = [
  {
    "id": "0",
    "type": "beacon",
    "x": r.width / 2,
    "y": 0,
    "color": new Rune.Color(255, 0, 0),
    "points": [-50, 0, 50, 0, 0, 100],
  },
  {
    "id": "1",
    "type": "beacon",
    "x": r.width,
    "y": r.height,
    "color": new Rune.Color(0, 255, 0),
    "points": [0, 0, 0, -100, -100, 0],
  },
  {
    "id": "2",
    "type": "beacon",
    "x": 0,
    "y": r.height,
    "color": new Rune.Color(0, 0, 255),
    "points": [0, 0, 0, -100, 100, 0],
  }
]

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
  this.update_color = function(color){
    this.color = color;
    this.shape.fill(this.color)
  }
  this.move = function(dx, dy){
    this.x = this.x + dx;
    this.y = this.y + dy;
    this.shape.move(dx, dy, true)
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
  this.stage = stage;
  this.width = 50;
  this.height = 50;
  this.shape = new Rune.Ellipse(this.x, this.y,
    this.width, this.height)
    .fill(this.color).addTo(this.stage);


  this.update_size = function(width, height){
    this.width = width;
    this.height = height;
    this.shape.state.width = width;
    this.shape.state.height= height;
  }

  this.get_dist_to_things = function(things){
    var distances = [];
    for (var i = 0; i < things.length; i++) {
      var distance = [];
      var thing_id = things[i].id;
      distance.push(thing_id);

      var thing_x = things[i].x;
      var thing_y = things[i].y;
      var dist = Math.sqrt((this.x - thing_x)^2 + (this.y - thing_y)^2);
      distance.push(dist);

      distances.push(distance);
    }
    return distances;
  }
  // this.draw_lines_to_people = function(ppl_array){
  //   var distances = this.get_dist_to_things(ppl_array);
  //   this.lines = []
  //   for (var i = 0; i < ppl_array.length; i++) {
  //     line = new Rune.Line(this.x, this.y, ppl_array[i].x, ppl_array[i].y)
  //     line.addTo(this.stage)
  //     this.lines.push()
  //   }
  // }
  return this;

}

function Beacon(location, stage){
  Thing.call(this, location)
  if (location.hasOwnProperty('color')) this.color = location.color;
  else this.color = new Rune.Color('hsv', 10, 100, 70);

  if (location.hasOwnProperty('points')) {
    this.shape = new Rune.Triangle(  // TODO: use apply() for this
      this.x + location.points[0],
      this.y + location.points[1],
      this.x + location.points[2],
      this.y + location.points[3],
      this.x + location.points[4],
      this.y + location.points[5],
    );
  } else {
    this.shape = new Rune.Triangle(
    this.x, this.y,
    this.x + 100, this.y + 0,
    this.x + 50, this.y - 50,
  );
  }
  this.shape.fill(this.color).addTo(stage);
  this.stage = stage;
  return this;
}

// function getSampleLocations(rawJsonData) {
//   jsonData = JSON.parse();
//   for (let location in rawJsonData) {
//     console.log(location);
//   }
// }
var sampleInput2 = {
  "locations": [
    {
      "id": "1",
      "type": "person",
      "x": 20,
      "y": 20
    },
    {
      "id": "3",
      "type": "person",
      "x": 20,
      "y": 30
    },
  ]
};

for (let location of sampleInitialInput.locations) {  // initial list of people
  thisPerson = new Person(location, my_group)
  people.push(thisPerson);
  console.log('created person', thisPerson.id, '@', thisPerson.x, thisPerson.y);
}

for (let beaconOptions of initialBeacons) {
  newBeacon = new Beacon(beaconOptions, my_group);
  beacons.push(newBeacon);
  console.log('created beacon', newBeacon.id, '@', newBeacon.x, newBeacon.y);
}

r.on('update', function() {
  for (person of people) {  // move people randomly
    person.move(Rune.random(-5,5), Rune.random(-5,5))
  }

});

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

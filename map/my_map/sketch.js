var r = new Rune({
  container: "body",
  width: 600,
  height: 600,
  frameRate : 60,
  debug: true
});

var my_group_under = r.group(0, 0);
var my_group = r.group(0, 0);
var my_groups = [my_group_under, my_group];
// var noise = new Rune.Noise().noiseDetail(0.2); // https://github.com/runemadsen/rune.noise.js

var people = [];
var beacons = [];
var sampleInput1 = {
  "locations": [
    {
      "id": "3",
      "type": "person",
      "x": 400,
      "y": 300,
    },
    {
      "id": "4",
      "type": "person",
      "x": 200,
      "y": 300
    },
    {
      "id": "5",
      "type": "person",
      "x": 300,
      "y": 300,
    }
  ]
};

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
  this.stage = stage[1];
  this.width = 50;
  this.height = 50;
  this.shape = new Rune.Ellipse(this.x, this.y,
    this.width, this.height)
    .fill(this.color).stroke(false).addTo(this.stage);
  this.lines = [];

  this.move = function(dx, dy){
    this.x = this.x + dx;
    this.y = this.y + dy;
    this.shape.move(dx, dy, true)
  }
  this.update_my_color = function(beacons){
    var dist = this.get_dist_to_things(beacons);
    var rgb = []
    for (var i = 0; i < dist.length; i++) {
      max_dist = Math.sqrt(r.width**2 + r.height**2);
      rgb.push(Rune.map(dist[i][1], max_dist, 0, 0, 255));
    }
    var new_color = new Rune.Color(rgb[0], rgb[1], rgb[2], 1)
    this.color = new_color;
    this.shape.fill(this.color);
  }
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
      var dist = Math.sqrt((this.x - thing_x)**2 + (this.y - thing_y)**2);
      distance.push(dist);

      distances.push(distance);
    }
    return distances;
  }

  this.draw_lines_to_people = function(ppl_array){
    if (this.lines != []) {  // delete lines
      console.log(this.lines)
      for (line of this.lines) line.removeParent();
    }
    this.lines = [];
    for (person of ppl_array) {
      newLine = new Rune.Line(this.x, this.y, person.x, person.y)
      var max_dist = Math.sqrt(r.width**2 + r.height**2);
      var dist = Math.sqrt((this.x - person.x)**2 + (this.y - person.y)**2);
      var stroke_color = Rune.map(dist, 0, max_dist/3, 0, 255)
      var stroke_width = Rune.map(dist, 0, max_dist/2, 5, 0)
      newLine.addTo(stage[0]).stroke(stroke_color).strokeWidth(stroke_width);
      this.lines.push(newLine);
    }

    // remove duplicate lines, this is not the most efficeint wawy to do this...
    for (var i = this.lines.length-1; i > this.lines.length/2; i--){
      this.lines[i].removeParent();
    }
  }
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

  this.circs = []
  max_dist = Math.sqrt(r.width**2 + r.height**2);
  this.range = max_dist * 0.5;

  this.draw_pulse = function(){
    var h = this.color.hsv().h;
    var s = this.color.hsv().s;
    var l = this.color.hsv().l;
    if(r.frameCount % 40 == 0){
      var circ = r.circle(this.x, this.y, 1)
        .stroke(false)
        .fill("hsv", h, Rune.random(50, 100), Rune.random(70,90), 0.03)
      this.circs.push(circ)
    }
    if(r.frameCount % 5 == 0){
      this.shape.fill("hsv", h, Rune.random(50, 100), Rune.random(70,90));
    }
    for (var i = 0; i < this.circs.length; i++) {
      this.circs[i].radius(0.5, true)
    }

    for (var i = this.circs.length-1; i >= 0; i--){
      if(this.circs[i].state.radius > this.range){
        this.circs[i].removeParent();
        this.circs.splice(i, 1);
      }
    }
    this.update_color = function(){}
  }
  this.stage = stage[1];
  this.shape.fill(this.color).addTo(stage[1]).stroke(false);
  return this;
}

for (let beaconOptions of initialBeacons) {
  newBeacon = new Beacon(beaconOptions, my_groups);
  beacons.push(newBeacon);
  console.log('created beacon', newBeacon.id, '@', newBeacon.x, newBeacon.y);
}

for (let location of sampleInput1.locations) {  // initial list of people
  thisPerson = new Person(location, my_groups)
  people.push(thisPerson);
  console.log('created person', thisPerson.id, '@', thisPerson.x, thisPerson.y);
}

r.on('update', function() {
  var boundary = 40;
  var maxStep = 10;
  for (beacon of beacons){
    beacon.draw_pulse();
  }
  for (person of people) {  // move people randomly

    var xLower = -maxStep, xUpper = maxStep;
    var yLower = -maxStep, yUpper = maxStep;
    if (person.x <= boundary) {
      xLower = 0;
    } else if (person.x >= r.width - boundary) {
      xUpper = 0;
    };
    if (person.y <= boundary) {
      yLower = 0;
    } else if (person.y >= r.height - boundary) {
      yUpper = 0;
    };
    person.move(Rune.random(xLower, xUpper), Rune.random(yLower, yUpper))
    person.update_my_color(beacons);
    person.draw_lines_to_people(people);
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

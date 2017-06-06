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

  this.get_dist_to_things = function(things_array){
    var distances = [];
    for (var i = 0; i < things.length; i++) {
      var distance = [];
      var thing_id = things[i].id;
      distance.push(beacon_id);

      var thing_x = things[i].x;
      var thing_y = things[i].y;
      var dist = sqrt((this.x - thing_x)^2 + (this.y - thing_y)^2);
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
  this.stage = stage;
  this.color = new Rune.Color('hsv', 10, 100, 70)
  this.shape = new Rune.Triangle(0, 0, 100, 0, 50, 50)
    .fill(this.color).addTo(this.stage);
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

var my_group = r.group(0, 0)

my_location = {
  id: '0',
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

r.on('update', function() {
  me.move(Rune.random(-5,5), Rune.random(-5,5))
  me2.move(Rune.random(-5,5), Rune.random(-5,5))
});

var sampleInitialInput = {
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
      "x": 100,
      "y": 100
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

var people = [];
for (let location of sampleInitialInput.locations) {  // initial list of people
  thisPerson = new Person(location, my_group)
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

console.log(my_group)

r.on('update', function() {
  me.move(Rune.random(-5,5), Rune.random(-5,5))
  me3.update_color(new Rune.Color('hsv', 10,
  Rune.random(10, 100), Rune.random(10, 100)))
});

r.play()

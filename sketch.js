/////////// Forniture
class Forniture {
  constructor(x, y, w, h, rotation, name) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.rotation = rotation;
    this.over = false;
    this.name = name;
  }
  
  display() {
    push()
    
    translate(this.x, this.y);
    rotate(this.rotation);
    this.containsPoint();
    if(this.over) {
      fill(55);
    } else {
      fill(255);
    }
    rect(0, 0, this.width, this.height);
    
    pop()
  }
  
  sign(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)
  }
  
  pointInTriangle(p1, triangle) {
    let d1, d2, d3, hasNeg, hasPos
    
    d1 = this.sign(p1, triangle.A, triangle.B)
    d2 = this.sign(p1, triangle.B, triangle.C)
    d3 = this.sign(p1, triangle.C, triangle.A)
    
    hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0)
    hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0)
    
    return !(hasNeg && hasPos)
  }
  
  getPoints() {
    var interX = this.x - Math.sin(this.rotation * Math.PI / 180) * this.height;
    var interY = this.y + Math.cos(this.rotation * Math.PI / 180) * this.height;
    this.rectanglePoints = {
      A: {x: this.x,
          y: this.y},
      B: {x: this.x + Math.sin((90 - this.rotation) * Math.PI / 180) * this.width,
          y: this.y + Math.cos((90 - this.rotation) * Math.PI / 180) * this.width},
      C: {x: interX,
          y: interY},
      D: {x: interX + Math.cos(this.rotation * Math.PI / 180) * this.width,
          y: interY + Math.sin(this.rotation * Math.PI / 180) * this.width}
    };
  }
  
  containsPoint() {
    this.getPoints()
    let mousePoint = {x: mouseX, y: mouseY}
    
    let triangle1 = {
      A: this.rectanglePoints.A,
      B: this.rectanglePoints.B,
      C: this.rectanglePoints.C
    }
    
    let triangle2 = {
      A: this.rectanglePoints.B,
      B: this.rectanglePoints.C,
      C: this.rectanglePoints.D
    }
    
    this.over = this.pointInTriangle(mousePoint, triangle1) || this.pointInTriangle(mousePoint, triangle2)
  }
}


/////////// set objects
let fan = new Forniture(556, 328, 52, 46, 79, "fan")
let tv = new Forniture(462, 108, 85, 61, 39, "tv")
let wind = new Forniture(292, 18, 84, 49, 0, "wind")
let sofa = new Forniture(230, 210, 222, 91, 37, "sofa")

/////////// Start state
class StartButton {
  display() {
    push()
    let btn = createButton('Start')
    btn.mousePressed(function() {
      console.log(state)
      state = States.main
      getAudioContext().resume()
      streetSound.loop()
    })
    btn.position(300, 475/2-50)
    pop()
  }
}

let startButtonRef = new StartButton()

/////////// Preload assets
let streetSound

function preload() {
  streetSound = loadSound('assets/audioRuaInicial.mp3')
  streetSound.setVolume(0.1)
}

/////////// UI State
const States = {
  start: 0,
  main: 1,
  sofa: 2,
}

let state = States.start
let uiItems = []


/////////// Canvas
function setup() {
  createCanvas(800, 457)
  background(230)
  frameRate(60)
  angleMode(DEGREES)
  outputVolume(0.8)
}

function draw() {
  removeElements()
  uiItems = []
  
  switch (state) {
    case States.start:
      uiItems.push(startButtonRef)
      break
    case States.main:
      uiItems.push(fan, tv, wind, sofa)
      break
  }

  uiItems.forEach(function(ele) {
    ele.display()
  })
}

function mousePressed() {
  // noLoop();
}
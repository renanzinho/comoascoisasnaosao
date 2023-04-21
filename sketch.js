/////////// Forniture
class Forniture {
  constructor(x, y, w, h, rotation, img, name) {
    this.img = img
    this.x = x
    this.y = y
    this.width = w
    this.height = h
    this.rotation = rotation
    this.over = false
    this.name = name
    this.p
  }

  display() {
    push()
    
    translate(this.x, this.y);
    rotate(this.rotation);
    this.containsPoint();

    image(this.img, 0, 0, this.width, this.height, 0, 0, this.img.width, this.img.height, COVER, CENTER)

    pop()

    if (this.over) {
      push()

      textSize(18)
      fill('#8A9085')
      rectMode(CENTER)
      text(this.name, this.x + this.width/2, this.y - 5, 60, 30)

      pop()
    }
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

  pressed() {
    if(this.over) {
      state = this.name
    }
  }
}

/////////// Start state
class StartButton {
  display() {
    push()
    let btn = createButton('Start')
    btn.mousePressed(function() {
      state = States.main
      getAudioContext().resume()
      streetSound.loop()
    })
    btn.position(300, 457/2-50)
    pop()
  }
}

let startButtonRef = new StartButton()

/////////// Sofa state
class Sofa {
  display() {
    push()

    let wrapper = select('#player-size')
    let player = select('#player-wrapper')
    let iframe = createElement('iframe')
    iframe.id('player')
    iframe.attribute('src', 'https://www.youtube.com/embed/eJP9MRr2YWM?&vq=hd1080ptheme=dark&autoplay=1&autohide=2&modestbranding=1&fs=0&showinfo=0&rel=0&iv_load_policy=3')
    iframe.attribute('width', '400')
    iframe.attribute('height', '235')
    iframe.attribute('frameborder', '0')
    iframe.attribute('allow', 'autoplay')
    player.child(iframe)
    wrapper.position(canvasWidth/2-760/2, canvasHeight/2 - 428/2 - 5)
    wrapper.removeAttribute('hidden')

    pop()
  }
}

/////////// Preload assets
let streetSound, sofaImg, windowImg, fanImg, tvImg, frameImg
let canvasWidth = 800
let canvasHeight = 457

function preload() {
  streetSound = loadSound('assets/audioRuaInicial.mp3')
  streetSound.setVolume(0.1)
  sofaImg = loadImage('assets/sofa.png')
  windowImg = loadImage('assets/janela.png')
  fanImg = loadImage('assets/ventilador.png')
  tvImg = loadImage('assets/tv.png')
  frameImg = loadImage('assets/frame.png')
}

/////////// UI State
const States = {
  start: 'start',
  main: 'main',
  sofa: 'sofa',
}

let state = States.main
let uiItems = []

let fan, tv, wind, sofa, sofaState

/////////// Canvas
function setup() {
  fan = new Forniture(524, 228, 52, 118, -2, fanImg, "ventilador")
  tv = new Forniture(442, 108, 95, 83, -3, tvImg, "tv")
  wind = new Forniture(252, 28, 99, 93, 0, windowImg, "janela")
  sofa = new Forniture(230, 230, 243, 116, 8, sofaImg, "sofa")
  sofaState = new Sofa()

  createCanvas(800, 457)
  frameRate(60)
  angleMode(DEGREES)
  outputVolume(0.8)
}

function draw() {
  background(255)
  image(frameImg, 0, 0, 800, 457, 0, 0, frameImg.width, frameImg.height, CONTAIN, CENTER)
  removeElements()
  uiItems = []
  
  switch (state) {
    case States.start:
      uiItems.push(startButtonRef)
      break
    case States.main:
      uiItems.push(fan, tv, wind, sofa)
      break
    case States.sofa:
      uiItems.push(sofaState)
      break
  }

  uiItems.forEach(function(ele) {
    ele.display()
  })
  if (state==States.sofa) {
    noLoop()
  }
}

function mousePressed() {
  uiItems.forEach(function(ele) {
    ele.pressed()
  })
}
let myModel;
let objects = [];

function preload() {
  myModel = loadModel('untitled.obj', true);
}

function setup() {
  createCanvas(800, 800, WEBGL);

  for (let i = 0; i < 5; i++) {
    objects.push({
      angle: random(TWO_PI),
      radius: random(150, 250),
      speed: random(0.01, 0.03),
      y: random(-100, 100),
      type: i
    });
  }
}

function draw() {
  background(30);

  orbitControl();

  ambientLight(150);
  directionalLight(255, 255, 255, 1, 1, -1);

  // center model
  push();
  rotateY(frameCount * 0.01);
  normalMaterial();
  scale(1);
  model(myModel);
  pop();

  // objects
  for (let obj of objects) {
    push();

    obj.angle += obj.speed;

    let x = cos(obj.angle) * obj.radius;
    let z = sin(obj.angle) * obj.radius;

    translate(x, obj.y, z);

    rotateX(frameCount * 0.02);
    rotateY(frameCount * 0.02);

    normalMaterial();

    if (obj.type === 0) box(50);
    if (obj.type === 1) sphere(30);
    if (obj.type === 2) cone(30, 60);
    if (obj.type === 3) cylinder(30, 60);
    if (obj.type === 4) torus(30, 10);

    pop();
  }

  // text
  push();
  resetMatrix();
  fill(255);
  textSize(20);
  textAlign(CENTER);
  text("spinning house", width / 2, 30);
  text("by Dan Upton", width / 2, 60);
  pop();
}

function mousePressed() {
  for (let i = 0; i < 2; i++) {
    let index = floor(random(objects.length));
    objects[index].radius = random(100, 300);
    objects[index].y = random(-150, 150);
  }
}
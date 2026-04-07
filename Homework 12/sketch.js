function setup() {
  createCanvas(800, 600, WEBGL);
}

function draw() {
  background(30, 40, 70);

  // Lighting
  ambientLight(100, 100, 120);
  directionalLight(255, 255, 255, -0.4, 0.6, -0.8);
  pointLight(255, 220, 150, 300, -200, 400);

  orbitControl(1, 1, 0.1);

  let rotY = frameCount * 0.008;

  // 1. Main Car Body 
  push();
  rotateY(rotY);
  specularMaterial(190, 40, 40);
  shininess(30);
  box(180, 55, 80);
  pop();

  // 2. Cabin / Windows
  push();
  translate(0, -22, 0);
  rotateY(rotY);
  ambientMaterial(25, 35, 55);
  box(95, 38, 68);
  pop();

  // 3. Front hood
  push();
  translate(-52, -8, 0);
  rotateY(rotY);
  specularMaterial(180, 30, 30);
  box(72, 22, 74);
  pop();

  // 4. Rear Spoiler (extra janky wobble)
  push();
  translate(68, -42, 0);
  rotateY(rotY);
  rotateZ(sin(frameCount * 0.08) * 0.28);
  specularMaterial(25, 25, 30);
  box(18, 6, 72);
  pop();

  // 5. Wheels
  drawWheel(-52, 32,  42, rotY, frameCount * 0.16);
  drawWheel(-52, 32, -42, rotY, frameCount * 0.16);
  drawWheel( 52, 32,  42, rotY, frameCount * 0.19);
  drawWheel( 52, 32, -42, rotY, frameCount * 0.19);

  // 6. Headlights
  push();
  translate(88, 4, 29);
  rotateY(rotY);
  ambientMaterial(255, 245, 120);
  sphere(11);
  pop();

  push();
  translate(88, 4, -29);
  rotateY(rotY);
  ambientMaterial(255, 245, 120);
  sphere(11);
  pop();

  // 7. Taillights
  push();
  translate(-88, 8, 29);
  rotateY(rotY);
  ambientMaterial(220, 30, 30);
  sphere(9);
  pop();

  push();
  translate(-88, 8, -29);
  rotateY(rotY);
  ambientMaterial(220, 30, 30);
  sphere(9);
  pop();

  // 8. Hood cone
  push();
  translate(-35, -32, 0);
  rotateY(rotY);
  rotateX(HALF_PI);
  normalMaterial();
  cone(14, 22);
  pop();

  //2D Text
  push();
  camera();
  ortho(-width/2, width/2, -height/2, height/2, -1000, 1000);

  fill(255);
  noStroke();

  // Title: "Janky Car" - big and centered at top
  textSize(52);
  textAlign(CENTER, CENTER);
  text("Janky Car", 0, -height/2 + 60);

  // Credit: "by Dan Upton" - lower left corner
  textSize(24);
  textAlign(LEFT, BOTTOM);
  text("by Dan Upton", -width/2 + 40, height/2 - 30);

  pop();
}

// Helper to draw spinning wheels
function drawWheel(x, y, z, bodyRot, spinSpeed) {
  push();
  translate(x, y, z);
  rotateY(bodyRot);
  rotateZ(spinSpeed);

  // Tire
  specularMaterial(20, 20, 25);
  cylinder(17, 24);

  // Rim
  rotateZ(PI / 2);
  specularMaterial(210, 190, 60);
  torus(11, 4.5);

  pop();
}
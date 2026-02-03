let sunX = 0;
let wheelAngle = 0;
let spinWheels = false;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220); 
   //car body
  
   // wheels
  fill(0);
  ellipse(125, 250, 50, 50);
  ellipse(275, 250, 50, 50);

  fill(100,100,100);
  rect(100,175,200,75);

   //inside wheels
  fill(255);
  ellipse(125, 250, 20, 20);
  ellipse(275, 250, 20, 20);

  if (spinWheels) {
    wheelAngle += 0.1;
  }

  drawSpokes(125, 250);
  drawSpokes(275, 250);

  fill(255, 200, 0);
  ellipse(sunX, 80, 60, 60);
  sunX += 1;
  if (sunX > width + 30) {
    sunX = -30;
  }
  
  //Window
  fill(255);
  rect(125,180,60,50);
  rect(225,180,60,50);
  
  // Title 
  fill(0);
  textSize(32);
  textStyle(BOLD);
  text("Dan's Car", 25, 45);
  
  // Name 
  textSize(18);
  textStyle(NORMAL);
  textAlign(RIGHT);
  text("Dan Upton", width - 25, height - 25);
  textAlign(LEFT);
}

function drawSpokes(x, y) {
  push();
  translate(x, y);
  rotate(wheelAngle);
  stroke(255);
  line(-25, 0, 25, 0);
  line(0, -25, 0, 25);
  noStroke();
  pop();
}

function mousePressed() {
  let d1 = dist(mouseX, mouseY, 125, 250);
  let d2 = dist(mouseX, mouseY, 275, 250);

  if (d1 < 25 || d2 < 25) {
    spinWheels = !spinWheels;
  }
}
let carColor;
let jumpOffset = 0;
let isJumping = false;
let clouds = [];

function setup() {
  createCanvas(720, 480);
  
  // Starting car color
  carColor = color(180, 100, 220);
  
  // Create several clouds
  for (let i = 0; i < 6; i++) {
    clouds.push({
      x: random(60, width - 60),
      y: random(60, 200),
      size: random(70, 130)
    });
  }
}

function draw() {
  background(120, 180, 240);  // nice sky
  
  // Sun
  fill(255, 230, 100);
  noStroke();
  circle(width - 120, 100, 110);
  
  // Grass / ground
  fill(50, 160, 70);
  rect(0, height - 90, width, 90);
  
  // Road
  fill(40);
  rect(0, height - 150, width, 60);
  
  // Road lines
  fill(255, 240, 100);
  for (let x = 50; x < width; x += 110) {
    rect(x, height - 120, 55, 10);
  }
  
  // Clouds that sometimes jump to new positions
  fill(255);
  noStroke();
  for (let cloud of clouds) {
    drawCloud(cloud.x, cloud.y, cloud.size);
    
    // Random relocation (about once every ~3–5 seconds)
    if (random() < 0.008) {
      cloud.x = random(60, width - 60);
      cloud.y = random(60, 200);
    }
  }
  
  // Car
  push();
  translate(width / 2, height - 170 + jumpOffset);
  
  // Main body
  fill(carColor);
  noStroke();
  rect(-120, -55, 240, 65, 15);
  rect(-75, -100, 150, 55, 15, 15, 0, 0);  // cabin
  
  // Windows
  fill(210, 240, 255, 170);
  rect(-65, -95, 55, 45, 8);
  rect(10, -95, 55, 45, 8);
  
  // Wheels
  fill(25);
  stroke(0);
  strokeWeight(5);
  ellipse(-65, 35, 80, 80);
  ellipse(65, 35, 80, 80);
  
  fill(90);
  noStroke();
  ellipse(-65, 35, 35, 35);
  ellipse(65, 35, 35, 35);
  
  pop();
  
  // Title – upper left
  fill(0);
  textSize(36);
  textStyle(BOLD);
  text("Grok's Car", 35, 60);
  
  // Name – lower right
  textSize(20);
  textStyle(NORMAL);
  textAlign(RIGHT);
  text("Grok by xAI", width - 35, height - 30);
  textAlign(LEFT);
  
  // Jump logic
  if (isJumping) {
    jumpOffset -= 5;
    if (jumpOffset <= -70) {
      isJumping = false;
    }
  } else if (jumpOffset < 0) {
    jumpOffset += 6;
    if (jumpOffset > 0) jumpOffset = 0;
  }
}

function drawCloud(x, y, s) {
  ellipse(x, y, s, s * 0.7);
  ellipse(x - s * 0.38, y - s * 0.15, s * 0.75, s * 0.6);
  ellipse(x + s * 0.38, y - s * 0.1, s * 0.9, s * 0.75);
  ellipse(x - s * 0.15, y + s * 0.12, s * 0.65, s * 0.55);
}

// ─────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────

function mousePressed() {
  // Random car color on click
  carColor = color(
    random(110, 255),
    random(70, 190),
    random(80, 240)
  );
}

function keyPressed() {
  if (key === ' ' && !isJumping && jumpOffset === 0) {
    isJumping = true;
  }
}
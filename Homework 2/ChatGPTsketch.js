function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(135, 206, 235); // sky

  // ground
  fill(60);
  rect(0, 300, 600, 100);

  // car body
  fill(200, 0, 0);
  rect(150, 240, 300, 50);

  // car top
  rect(220, 200, 160, 50);

  // windows
  fill(180, 220, 255);
  rect(235, 210, 50, 30);
  rect(315, 210, 50, 30);

  // wheels
  fill(0);
  ellipse(220, 290, 50, 50);
  ellipse(380, 290, 50, 50);
}
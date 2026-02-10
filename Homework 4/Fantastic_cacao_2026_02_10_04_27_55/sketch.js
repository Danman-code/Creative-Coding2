
let titleFont;
let pastaImg, steakImg, iceCreamImg;   
// Variables for the moving image (ice cream that jumps every few seconds)
let iceX = 400;
let iceY = 320;
let iceTargetX = 400;
let iceTargetY = 320;
let moveTimer = 0;
let MOVE_INTERVAL = 3200; // milliseconds (~3.2 seconds)

// For smooth movement between timer jumps
let lerpAmount = 0;

function preload() {
  // Load custom font 
  titleFont = loadFont('assets/Cursive-sans/CursiveSans-Book.ttf');

  // 1. Pasta 
  pastaImg = loadImage('assets/Pasta.webp');

  // 2. Steak 
  steakImg = loadImage('assets/Steak.jpeg');

  // 3. Ice cream 
  iceCreamImg = loadImage('assets/ai-ice-cream.jpeg');
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(250, 245, 235); // background

  // Title with custom font
  fill(180, 40, 60); 
  textFont(titleFont);
  textSize(62);
  text("Pasta, Steak & Ice Cream", width/2, 85);

  fill(90, 50, 30);
  textSize(32);
  text("by Dan Upton", width/2, 145);

  // Large pasta on left side
  tint(255, 235); // slightly softened
  imageMode(CORNER);
  image(pastaImg, 30, 190, 380, 380 * 0.75);

  // Medium steak on right-middle
  noTint();
  image(steakImg, width - 380, 220, 320, 240);

  // Timer logic
  if (millis() - moveTimer > MOVE_INTERVAL) {
    // Choose new random target position
    iceTargetX = random(160, width - 160);
    iceTargetY = random(200, height - 160);
    
    lerpAmount = 0;           // reset progress
    moveTimer = millis();     // reset timer
  }

  // Smoothly interpolate toward target
  lerpAmount += 0.022; // movement speed (lower = slower)
  lerpAmount = constrain(lerpAmount, 0, 1);

  let currentX = lerp(iceX, iceTargetX, lerpAmount);
  let currentY = lerp(iceY, iceTargetY, lerpAmount);

  // Draw moving ice cream
  noTint();
  imageMode(CENTER);
  image(iceCreamImg, currentX, currentY, 160, 160);

  // Cute label following the ice cream
  fill(40, 80, 140);
  textFont('Georgia');
  textSize(20);
  text("Yummy! 🍦", currentX, currentY - 100);

  // When close to target, snap and prepare for next jump
  if (lerpAmount >= 0.99) {
    iceX = iceTargetX;
    iceY = iceTargetY;
  }
}
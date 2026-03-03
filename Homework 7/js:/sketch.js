// Global variables
let character;
let foods = [];
let idleFrames = [];
let walkFrames = [];
let currentAnimation;
let frameIndex = 0;
let animationTimer = 0;
let animationSpeed = 8;
let score = 0;
let startTime;
let gameOver = false;

// Character animation images
let idle000, idle004, running002;

// Food images
let alienBottom, alienTop, cherry, coconut, orangeImg;

function preload() {
  // Character animations
  idle000 = loadImage('0_Forest_Ranger_Idle_000.png');
  idle004 = loadImage('0_Forest_Ranger_Idle_004.png');
  running002 = loadImage('0_Forest_Ranger_Running_002.png');
  
  idleFrames = [idle000, idle004];
  walkFrames = [idle000, running002];
  
  // Food images 
  alienBottom = loadImage('Alienfruit_01_half_bottom_Outline_BigWander_TheBanquet.png');
  alienTop = loadImage('Alienfruit_01_half_top_Outline_BigWander_TheBanquet.png');
  cherry = loadImage('Cherry_Individual_Outline_BigWander_TheBanquet.png');
  coconut = loadImage('Coconut_Individual_Outline_BigWander_TheBanquet.png');
  orangeImg = loadImage('Orange_Individual_Outline_BigWander_TheBanquet.png');
  
  currentAnimation = idleFrames;
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
 
  // Start time for timer
  startTime = millis();
 
  // Character object
  character = {
    x: width / 2,
    y: height - 120,
    w: 60,
    h: 100,
    speed: 4,
    facingRight: true,
    isMoving: false
  };
 
  // 5 Food objects 
  foods.push(new Food(120, 180, 70, alienBottom));
  foods.push(new Food(280, 320, 65, alienTop));
  foods.push(new Food(450, 140, 50, cherry));
  foods.push(new Food(620, 400, 75, coconut));
  foods.push(new Food(180, 480, 60, orangeImg));
}

function draw() {
  // Calculate time left
  let elapsed = (millis() - startTime) / 1000;
  let timeLeft = max(0, 60 - elapsed);
  
  if (timeLeft <= 0 && !gameOver) {
    gameOver = true;
  }
 
  background(220, 240, 255);
 
  // Game logic only if not over
  if (!gameOver) {
    // Movement input 
    character.isMoving = false;
 
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { 
      character.x += character.speed;
      character.facingRight = true;
      character.isMoving = true;
    }
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { 
      character.x -= character.speed;
      character.facingRight = false;
      character.isMoving = true;
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) { 
      character.y -= character.speed;
      character.isMoving = true;
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { 
      character.y += character.speed;
      character.isMoving = true;
    }
 
    // Switch animation
    currentAnimation = character.isMoving ? walkFrames : idleFrames;
 
    // Animation timing
    animationTimer++;
    if (animationTimer >= animationSpeed) {
      animationTimer = 0;
      frameIndex = (frameIndex + 1) % currentAnimation.length;
    }
 
    // Keep character on screen 
    character.x = constrain(character.x, 0, width - character.w);
    character.y = constrain(character.y, 0, height - character.h);
 
    // Update foods (random wandering)
    for (let food of foods) {
      food.update();
    }
 
    // Collision detection and collection
    let cx = character.x + character.w / 2;
    let cy = character.y + character.h / 2;
    for (let food of foods) {
      let dx = cx - food.x;
      let dy = cy - food.y;
      let dist = sqrt(dx * dx + dy * dy);
      if (dist < (character.w / 2 + food.size / 2)) {
        score++;
        food.pickRandomTarget(cx, cy);  // Respawn away from character
      }
    }
  }
 
  // Always draw character
  push();
  let cx = character.x + character.w / 2;
  let cy = character.y + character.h / 2;
  translate(cx, cy);
  if (!character.facingRight) {
    scale(-1, 1); // flip to face left
  }
 
  let currentFrame = currentAnimation[frameIndex];
  image(currentFrame, 0, 0, character.w, character.h);
  pop();
 
  // Always draw foods
  for (let food of foods) {
    food.display();
  }
 
  // Score and Timer
  fill(40);
  textSize(32);
  textAlign(LEFT);
  text(`Score: ${score}`, 20, 40);
  
  textAlign(RIGHT);
  text(`Time: ${floor(timeLeft)}`, width - 20, 40);
 
  // Instructions 
  if (!gameOver) {
    textAlign(CENTER);
    textSize(16);
    text("WASD or arrows to move & collect foods before time runs out!", width / 2, height - 20);
  }
 
  // Game Over screen
  if (gameOver) {
    textAlign(CENTER);
    textSize(64);
    fill(255, 100, 100);
    text("GAME OVER", width / 2, height / 2);
    
    textSize(36);
    fill(40);
    text(`Final Score: ${score}`, width / 2, height / 2 + 70);
    
    textSize(20);
    fill(100);
    text("Refresh to play again", width / 2, height / 2 + 120);
  }
}

// Food Class with random wandering behavior
class Food {
  constructor(x, y, size, img) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.img = img;
    this.targetX = x;
    this.targetY = y;
    this.changeTimer = 0;
    this.nextChangeTime = 60;
    this.pickRandomTarget(x, y);  // Start wandering immediately
  }
 
  update() {
    // Smoothly lerp to target (unpredictable but smooth movement)
    this.x = lerp(this.x, this.targetX, 0.03);
    this.y = lerp(this.y, this.targetY, 0.03);
 
    // Change target at random intervals
    this.changeTimer++;
    if (this.changeTimer >= this.nextChangeTime) {
      this.pickRandomTarget();
    }
  }
 
  pickRandomTarget(avoidCX = -999, avoidCY = -999) {
    // Generate new target 
    do {
      this.targetX = random(50, width - 50);
      this.targetY = random(50, height - 140);
    } while (avoidCX > 0 && dist(this.targetX, this.targetY, avoidCX, avoidCY) < 120);
 
    this.nextChangeTime = floor(random(120, 360));  // 2-6 seconds
    this.changeTimer = 0;
  }
 
  display() {
    image(this.img, this.x, this.y, this.size, this.size);
  }
}
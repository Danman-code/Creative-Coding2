// Global variables 
let character;
let foods = [];
let badObjects = [];
let particles = [];

let idleFrames = [];
let walkFrames = [];
let currentAnimation;
let frameIndex = 0;
let animationTimer = 0;
let animationSpeed = 8;

let score = 0;
let startTime;
let gameOver = false;
let gameWon = false;

// Images
let idle000, idle004, running002;
let alienBottom, alienTop, cherry, coconut, orangeImg;
let badImg;

// preload
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

  badImg = alienTop;   // reuse for enemies
  currentAnimation = idleFrames;
}

// setup
function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
  startTime = millis();

  // Character
  character = {
    x: width / 2,
    y: height - 120,
    w: 60,
    h: 100,
    speed: 4,
    facingRight: true,
    isMoving: false
  };

  // 5 Good Foods
  foods.push(new Food(120, 180, 70, alienBottom));
  foods.push(new Food(280, 320, 65, alienTop));
  foods.push(new Food(450, 140, 50, cherry));
  foods.push(new Food(620, 400, 75, coconut));
  foods.push(new Food(180, 480, 60, orangeImg));

  // 5 Bad Objects (Enemies)
  badObjects.push(new BadObject(650, 150, 55));
  badObjects.push(new BadObject(100, 250, 60));
  badObjects.push(new BadObject(500, 450, 50));
  badObjects.push(new BadObject(300, 100, 65));
  badObjects.push(new BadObject(720, 380, 58));
}

// Particle 
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-4, 4);
    this.vy = random(-5, 2);
    this.lifespan = 40;
    this.size = random(7, 13);
    this.alpha = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.18;           // gravity
    this.lifespan--;
    this.size *= 0.96;
    this.alpha = map(this.lifespan, 0, 40, 0, 255);
  }

  display() {
    noStroke();
    fill(255, 200, 60, this.alpha);
    ellipse(this.x, this.y, this.size, this.size);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

// Bad object class
class BadObject {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.health = 3;
    this.targetX = x;
    this.targetY = y;
    this.changeTimer = 0;
    this.nextChangeTime = 90;
    this.pickRandomTarget();
  }

  update() {
    this.x = lerp(this.x, this.targetX, 0.028);
    this.y = lerp(this.y, this.targetY, 0.028);

    this.changeTimer++;
    if (this.changeTimer >= this.nextChangeTime) {
      this.pickRandomTarget();
    }
  }

  pickRandomTarget() {
    this.targetX = random(60, width - 60);
    this.targetY = random(60, height - 160);
    this.nextChangeTime = floor(random(100, 300));
    this.changeTimer = 0;
  }

  display() {
    push();
    tint(255, 90, 90);   // red tint
    image(badImg, this.x, this.y, this.size, this.size);
    pop();

    // Health bar
    let barW = this.size * 0.85;
    let healthPct = this.health / 3;
    fill(40);
    rect(this.x - barW/2, this.y - this.size/2 - 15, barW, 7);
    fill(220, 50, 50);
    rect(this.x - barW/2, this.y - this.size/2 - 15, barW * healthPct, 7);
  }

  hit(hitX, hitY) {
    this.health--;
    for (let i = 0; i < 20; i++) {
      particles.push(new Particle(hitX, hitY));
    }
  }
}

// Food class
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
    this.pickRandomTarget(x, y);
  }

  update() {
    this.x = lerp(this.x, this.targetX, 0.03);
    this.y = lerp(this.y, this.targetY, 0.03);

    this.changeTimer++;
    if (this.changeTimer >= this.nextChangeTime) {
      this.pickRandomTarget();
    }
  }

  pickRandomTarget(avoidX = -999, avoidY = -999) {
    do {
      this.targetX = random(50, width - 50);
      this.targetY = random(50, height - 140);
    } while (avoidX > 0 && dist(this.targetX, this.targetY, avoidX, avoidY) < 130);

    this.nextChangeTime = floor(random(120, 360));
    this.changeTimer = 0;
  }

  display() {
    image(this.img, this.x, this.y, this.size, this.size);
  }
}

// Draw
function draw() {
  let elapsed = (millis() - startTime) / 1000;
  let timeLeft = max(0, 60 - elapsed);

  background(220, 240, 255);

  if (!gameOver && !gameWon) {
    // Movement
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

    currentAnimation = character.isMoving ? walkFrames : idleFrames;

    animationTimer++;
    if (animationTimer >= animationSpeed) {
      animationTimer = 0;
      frameIndex = (frameIndex + 1) % currentAnimation.length;
    }

    character.x = constrain(character.x, 0, width - character.w);
    character.y = constrain(character.y, 0, height - character.h);

    // Updates
    for (let food of foods) food.update();
    for (let bad of badObjects) bad.update();

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      if (particles[i].isDead()) {
        particles.splice(i, 1);
      }
    }

    // Collisions
    let cx = character.x + character.w / 2;
    let cy = character.y + character.h / 2;

    // Collect good food
    for (let i = foods.length - 1; i >= 0; i--) {
      let f = foods[i];
      if (dist(cx, cy, f.x, f.y) < character.w/2 + f.size/2) {
        score += 2;
        f.pickRandomTarget(cx, cy);
      }
    }

    // Attack bad objects (SPACE)
    if (keyIsDown(32)) {
      for (let i = badObjects.length - 1; i >= 0; i--) {
        let b = badObjects[i];
        if (dist(cx, cy, b.x, b.y) < character.w/2 + b.size/2 + 25) {
          b.hit(cx, cy);
          if (b.health <= 0) {
            badObjects.splice(i, 1);
          }
          break;
        }
      }
    }

    // Check win
    if (badObjects.length === 0) {
      gameWon = true;
    }
  }

  // Drawing
  push();
  translate(character.x + character.w/2, character.y + character.h/2);
  if (!character.facingRight) scale(-1, 1);
  image(currentAnimation[frameIndex], 0, 0, character.w, character.h);
  pop();

  for (let food of foods) food.display();
  for (let bad of badObjects) bad.display();
  for (let p of particles) p.display();

  // UI
  fill(40);
  textSize(32);
  textAlign(LEFT);
  text(`Score: ${score}`, 20, 40);
  
  textAlign(RIGHT);
  text(`Time: ${floor(timeLeft)}`, width - 20, 40);

  if (!gameOver && !gameWon) {
    textAlign(CENTER);
    textSize(16);
    text("WASD/Arrows = Move    SPACE = Attack enemies    Collect good food!", width/2, height - 25);
  }

  // Win Screen
  if (gameWon) {
    fill(80, 220, 100);
    textAlign(CENTER);
    textSize(70);
    text("YOU WIN!", width/2, height/2 - 20);
    textSize(36);
    fill(30);
    text(`Final Score: ${score}`, width/2, height/2 + 60);
    textSize(24);
    fill(70);
    text("All enemies defeated!", width/2, height/2 + 110);
  }

  // Time Out Game Over
  if (timeLeft <= 0 && !gameWon) {
    gameOver = true;
    fill(220, 60, 60);
    textAlign(CENTER);
    textSize(65);
    text("TIME'S UP", width/2, height/2);
    textSize(36);
    fill(30);
    text(`Final Score: ${score}`, width/2, height/2 + 70);
  }
}
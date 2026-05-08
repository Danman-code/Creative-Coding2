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

// Health system
let playerHealth = 3;
let maxHealth = 3;
let invincible = false;
let invincibleTimer = 0;

// Attack system
let attackCooldown = 0;
let attackCooldownMax = 15;
let isAttacking = false;

// Sounds
let goodFoodSound;
let damageSound;
let gameOverSound;
let gameOverSoundPlayed = false;

// Images
let idle000, idle004, running002;
let alienBottom, alienTop, cherry, coconut, orangeImg;
let badImg;

function preload() {
  idle000 = loadImage('0_Forest_Ranger_Idle_000.png');
  idle004 = loadImage('0_Forest_Ranger_Idle_004.png');
  running002 = loadImage('0_Forest_Ranger_Running_002.png');
  
  idleFrames = [idle000, idle004];
  walkFrames = [idle000, running002];
  
  alienBottom = loadImage('Alienfruit_01_half_bottom_Outline_BigWander_TheBanquet.png');
  alienTop = loadImage('Alienfruit_01_half_top_Outline_BigWander_TheBanquet.png');
  cherry = loadImage('Cherry_Individual_Outline_BigWander_TheBanquet.png');
  coconut = loadImage('Coconut_Individual_Outline_BigWander_TheBanquet.png');
  orangeImg = loadImage('Orange_Individual_Outline_BigWander_TheBanquet.png');
  
  badImg = alienTop;

  goodFoodSound = loadSound('arcade-game-achievement-bling-epic-stock-media-1-00-01.mp3');
  damageSound = loadSound('arcade-game-negative-blip-om-fx-2-2-00-01.mp3');
  gameOverSound = loadSound('game-over-music-royal-fail-gfx-sounds-1-00-08.mp3');
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
  startTime = millis();
  
  character = {
    x: width / 2,
    y: height - 120,
    w: 60,
    h: 100,
    speed: 4,
    facingRight: true,
    isMoving: false
  };

  foods.push(new Food(120, 180, 70, alienBottom));
  foods.push(new Food(280, 320, 65, alienTop));
  foods.push(new Food(450, 140, 50, cherry));
  foods.push(new Food(620, 400, 75, coconut));
  foods.push(new Food(180, 480, 60, orangeImg));

  badObjects.push(new BadObject(650, 150, 55));
  badObjects.push(new BadObject(100, 250, 60));
  badObjects.push(new BadObject(500, 450, 50));
  badObjects.push(new BadObject(300, 100, 65));
  badObjects.push(new BadObject(720, 380, 58));

  goodFoodSound.setVolume(0.75);
  damageSound.setVolume(0.8);
  gameOverSound.setVolume(0.65);
}

function mousePressed() {
  userStartAudio();
}

// Classes 
class Particle {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.vx = random(-4, 4);
    this.vy = random(-5, 2);
    this.lifespan = 40;
    this.size = random(7, 13);
    this.alpha = 255;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vy += 0.18;
    this.lifespan--;
    this.size *= 0.96;
    this.alpha = map(this.lifespan, 0, 40, 0, 255);
  }
  display() {
    noStroke();
    fill(255, 200, 60, this.alpha);
    ellipse(this.x, this.y, this.size, this.size);
  }
  isDead() { return this.lifespan <= 0; }
}

class BadObject {
  constructor(x, y, size) {
    this.x = x; this.y = y; this.size = size;
    this.health = 1;           // ← One hit kill
    this.dead = false;
    this.respawnTimer = 0;
    this.targetX = x; this.targetY = y;
    this.changeTimer = 0; this.nextChangeTime = 90;
    this.pickRandomTarget();
  }
  update() {
    if (this.dead) {
      this.respawnTimer--;
      if (this.respawnTimer <= 0) this.respawn();
      return;
    }
    this.x = lerp(this.x, this.targetX, 0.028);
    this.y = lerp(this.y, this.targetY, 0.028);
    this.changeTimer++;
    if (this.changeTimer >= this.nextChangeTime) this.pickRandomTarget();
  }
  pickRandomTarget() {
    this.targetX = random(60, width - 60);
    this.targetY = random(60, height - 160);
    this.nextChangeTime = floor(random(100, 300));
    this.changeTimer = 0;
  }
  display() {
    if (this.dead) return;
    push();
    tint(255, 90, 90);
    image(badImg, this.x, this.y, this.size, this.size);
    pop();

    // enemy health Bar
    let barW = this.size * 0.85;
    let pct = this.health / 1;
    fill(40);
    rect(this.x - barW/2, this.y - this.size/2 - 15, barW, 7);
    fill(220, 50, 50);
    rect(this.x - barW/2, this.y - this.size/2 - 15, barW * pct, 7);
  }
  hit(hitX, hitY) {
    this.health--;
    for (let i = 0; i < 30; i++) particles.push(new Particle(hitX, hitY));
    if (this.health <= 0) {
      this.dead = true;
      this.respawnTimer = 180;
    }
  }
  respawn() {
    this.x = random(60, width - 60);
    this.y = random(60, height - 160);
    this.health = 1;
    this.dead = false;
    this.pickRandomTarget();
  }
}

class Food {
  constructor(x, y, size, img) {
    this.x = x; this.y = y; this.size = size; this.img = img;
    this.targetX = x; this.targetY = y;
    this.changeTimer = 0; this.nextChangeTime = 60;
    this.pickRandomTarget(x, y);
  }
  update() {
    this.x = lerp(this.x, this.targetX, 0.03);
    this.y = lerp(this.y, this.targetY, 0.03);
    this.changeTimer++;
    if (this.changeTimer >= this.nextChangeTime) this.pickRandomTarget();
  }
  pickRandomTarget(avoidX = -999, avoidY = -999) {
    this.targetX = random(50, width - 50);
    this.targetY = random(50, height - 140);
    if (avoidX > 0 && dist(this.targetX, this.targetY, avoidX, avoidY) < 130) {
      this.pickRandomTarget(avoidX, avoidY);
      return;
    }
    this.nextChangeTime = floor(random(120, 360));
    this.changeTimer = 0;
  }
  display() {
    image(this.img, this.x, this.y, this.size, this.size);
  }
}

function drawHealthBar(x, y) {
  let w = 60, h = 8;
  let pct = playerHealth / maxHealth;
  fill(60); rect(x - w/2, y, w, h);
  fill(50, 220, 80); rect(x - w/2, y, w * pct, h);
  noFill(); stroke(0); rect(x - w/2, y, w, h); noStroke();
  fill(0); textSize(12); textAlign(CENTER);
  text(`${playerHealth}/${maxHealth}`, x, y - 2);
}

function draw() {
  let elapsed = (millis() - startTime) / 1000;
  let timeLeft = max(0, 60 - elapsed);
  background(220, 240, 255);

  if (!gameOver && !gameWon) {
    character.isMoving = false;
    isAttacking = keyIsDown(32);

    // Movement
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { character.x += character.speed; character.facingRight = true; character.isMoving = true; }
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { character.x -= character.speed; character.facingRight = false; character.isMoving = true; }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) { character.y -= character.speed; character.isMoving = true; }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { character.y += character.speed; character.isMoving = true; }

    currentAnimation = character.isMoving ? walkFrames : idleFrames;
    animationTimer++;
    if (animationTimer >= animationSpeed) {
      animationTimer = 0;
      frameIndex = (frameIndex + 1) % currentAnimation.length;
    }

    character.x = constrain(character.x, 0, width - character.w);
    character.y = constrain(character.y, 0, height - character.h);

    for (let food of foods) food.update();
    for (let bad of badObjects) bad.update();

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      if (particles[i].isDead()) particles.splice(i, 1);
    }

    let cx = character.x + character.w / 2;
    let cy = character.y + character.h / 2;

    // Good Food
    for (let f of foods) {
      if (dist(cx, cy, f.x, f.y) < character.w / 2 + f.size / 2) {
        score += 2;
        goodFoodSound.play();
        f.pickRandomTarget(cx, cy);
      }
    }

    if (invincible) {
      invincibleTimer--;
      if (invincibleTimer <= 0) invincible = false;
    }

    // Damage only when not attacking and not invincible
    if (!invincible && !isAttacking) {
      for (let b of badObjects) {
        if (!b.dead && dist(cx, cy, b.x, b.y) < character.w / 2 + b.size / 2 + 5) {
          playerHealth--;
          damageSound.play();
          invincible = true;
          invincibleTimer = 100;
          for (let k = 0; k < 25; k++) particles.push(new Particle(cx, cy));
          if (playerHealth <= 0) gameOver = true;
          break;
        }
      }
    }

    // Attacking 
    if (attackCooldown > 0) attackCooldown--;

    if (isAttacking && attackCooldown <= 0) {
      for (let b of badObjects) {
        if (!b.dead && dist(cx, cy, b.x, b.y) < character.w / 2 + b.size / 2 + 35) {
          b.hit(cx, cy);
          attackCooldown = attackCooldownMax;
          break;
        }
      }
    }

    if (badObjects.length === 0) gameWon = true;
    if (timeLeft <= 0) gameOver = true;
  }

  // Drawing
  push();
  let tintColor = isAttacking ? color(255, 220, 100) : (invincible && frameCount % 8 < 4) ? color(255, 120) : 255;
  tint(tintColor);
  translate(character.x + character.w / 2, character.y + character.h / 2);
  if (!character.facingRight) scale(-1, 1);
  image(currentAnimation[frameIndex], 0, 0, character.w, character.h);
  pop();

  drawHealthBar(character.x + character.w / 2, character.y + character.h + 10);

  for (let f of foods) f.display();
  for (let b of badObjects) b.display();
  for (let p of particles) p.display();

  fill(40);
  textSize(32);
  textAlign(LEFT); text("Score: " + score, 20, 40);
  textAlign(RIGHT); text("Time: " + floor(timeLeft), width - 20, 40);

  textAlign(CENTER); textSize(14); fill(30);
  text("WASD / Arrows: Move | Collect good food | SPACE: Attack bad food!", width / 2, height - 20);

  if (gameOver && !gameWon) {
    if (!gameOverSoundPlayed) {
      gameOverSound.play();
      gameOverSoundPlayed = true;
    }
    textAlign(CENTER);
    textSize(50);
    fill(200, 0, 0);
    text("GAME OVER", width / 2, height / 2);
  }

  if (gameWon) {
    textAlign(CENTER);
    textSize(50);
    fill(0, 180, 0);
    text("YOU WIN!", width / 2, height / 2);
  }
}
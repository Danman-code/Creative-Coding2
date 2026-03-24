let player;
let foods;
let badItems;
let obstacles;

let score = 0;
let health = 5;
let gameState = "play";

// Images
let idleImg, runImg, foodImg, badImg, obstacleImg;

function preload() {
  // Use your images if you have them
  idleImg = loadImage('0_Forest_Ranger_Idle_000.png');
  runImg = loadImage('0_Forest_Ranger_Running_002.png');

  foodImg = loadImage('Cherry_Individual_Outline_BigWander_TheBanquet.png');
  badImg = loadImage('Coconut_Individual_Outline_BigWander_TheBanquet.png');
  obstacleImg = loadImage('Orange_Individual_Outline_BigWander_TheBanquet.png');
}

function setup() {
  createCanvas(800, 600);

  // player
  player = createSprite(width/2, height/2, 50, 80);
  player.addAnimation("idle", idleImg);
  player.addAnimation("run", runImg);
  player.scale = 0.6;

  // groups
  foods = new Group();
  badItems = new Group();
  obstacles = new Group();

  // spawn objects
  for (let i = 0; i < 5; i++) spawnFood();
  for (let i = 0; i < 3; i++) spawnBad();
  for (let i = 0; i < 3; i++) spawnObstacle();
}

function draw() {
  background(220, 240, 255);

  if (gameState === "play") {

    // MOVEMENT
    let moving = false;

    if (keyDown("RIGHT_ARROW") || keyDown("d")) {
      player.position.x += 5;
      moving = true;
    }
    if (keyDown("LEFT_ARROW") || keyDown("a")) {
      player.position.x -= 5;
      moving = true;
    }
    if (keyDown("UP_ARROW") || keyDown("w")) {
      player.position.y -= 5;
      moving = true;
    }
    if (keyDown("DOWN_ARROW") || keyDown("s")) {
      player.position.y += 5;
      moving = true;
    }

    // animation
    if (moving) {
      player.changeAnimation("run");
    } else {
      player.changeAnimation("idle");
    }

    // keep player in bounds
    player.position.x = constrain(player.position.x, 25, width-25);
    player.position.y = constrain(player.position.y, 40, height-40);

    // collisions
    player.collide(obstacles);

    player.overlap(foods, collectFood);
    player.overlap(badItems, hitBad);

    // win lose
    if (score >= 10) gameState = "win";
    if (health <= 0) gameState = "lose";
  }

  drawSprites();

  // UI
  fill(0);
  textSize(24);
  text("Score: " + score, 20, 30);
  text("Health: " + health, 20, 60);

  // end screens 
  textAlign(CENTER);

  if (gameState === "win") {
    textSize(50);
    fill(0, 200, 0);
    text("YOU WIN!", width/2, height/2);
    noLoop();
  }

  if (gameState === "lose") {
    textSize(50);
    fill(200, 0, 0);
    text("YOU LOSE!", width/2, height/2);
    noLoop();
  }
}


// food
function spawnFood() {
  let f = createSprite(random(50,750), random(50,550), 40, 40);
  f.addImage(foodImg);
  f.scale = 0.4;
  foods.add(f);
}

// bad item
function spawnBad() {
  let b = createSprite(random(50,750), random(50,550), 40, 40);
  b.addImage(badImg);
  b.scale = 0.4;
  badItems.add(b);
}

// obstacle
function spawnObstacle() {
  let o = createSprite(random(100,700), random(100,500), 80, 80);
  o.addImage(obstacleImg);
  o.scale = 0.6;
  o.immovable = true;
  obstacles.add(o);
}

// collect
function collectFood(player, food) {
  score++;
  food.remove();
  spawnFood();
}

// damage
function hitBad(player, bad) {
  health--;
  bad.remove();
  spawnBad();
}
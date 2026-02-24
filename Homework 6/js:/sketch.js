// Global variables
let character;
let foods = [];
let idleFrames = [];
let walkFrames = [];
let currentAnimation;
let frameIndex = 0;
let animationTimer = 0;
let animationSpeed = 8;    

function preload() {
   
  // Each frame is just a simple object with color 
  idleFrames = [
    {type: 'rect', color: [100, 150, 255]},
    {type: 'rect', color: [120, 170, 255]},
    {type: 'rect', color: [140, 190, 255]},
    {type: 'rect', color: [120, 170, 255]}
  ];

  walkFrames = [
    {type: 'rect', color: [255, 100, 100]},
    {type: 'rect', color: [255, 140, 120]},
    {type: 'rect', color: [255, 180, 140]},
    {type: 'rect', color: [255, 140, 120]}
  ];

  currentAnimation = idleFrames;
}

function setup() {
  createCanvas(800, 600);
  
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
  
  // 5 different Food objects
  foods.push(new Food(120,  180, 45, color(220, 50, 50),  55));   // red
  foods.push(new Food(280,  320, 38, color(255, 180, 60), 48));   // orange
  foods.push(new Food(450,  140, 52, color(80, 200, 60),  65));   // green
  foods.push(new Food(620,  400, 42, color(180, 60, 220), 50));   // purple
  foods.push(new Food(180,  480, 48, color(255, 220, 80), 60));   // yellow
}

function draw() {
  background(220, 240, 255);
  
  //Movement input
  character.isMoving = false;
  
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {   // → or D
    character.x += character.speed;
    character.facingRight = true;
    character.isMoving = true;
  }
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {    // ← or A
    character.x -= character.speed;
    character.facingRight = false;
    character.isMoving = true;
  }
  
  // Switch animation
  currentAnimation = character.isMoving ? walkFrames : idleFrames;
  
  //Animation timing
  animationTimer++;
  if (animationTimer >= animationSpeed) {
    animationTimer = 0;
    frameIndex = (frameIndex + 1) % currentAnimation.length;
  }
  
  // Keep character on screen
  character.x = constrain(character.x, 0, width - character.w);
  
  // Draw character 
  push();
  translate(character.x + character.w/2, character.y + character.h/2);
  if (!character.facingRight) {
    scale(-1, 1);   // flip to face left
  }
  
  let frame = currentAnimation[frameIndex];
  fill(frame.color);
  noStroke();
  rectMode(CENTER);
  rect(0, 0, character.w, character.h, 12);
  
  // eyes
  fill(255);
  ellipse(-14, -20, 20, 24);
  ellipse( 14, -20, 20, 24);
  fill(0);
  ellipse(-14, -18, 9, 11);
  ellipse( 14, -18, 9, 11);
  pop();
  
  // Draw all food items
  for (let food of foods) {
    food.display();
  }
  
  // text
  fill(40);
  textSize(16);
  textAlign(CENTER);
  text("Use left and right arrows to move", width/2, 40);
  text(" animation cycles blue when idle, and orange while walking", width/2, 60);
}

// Food Class 
class Food {
  constructor(x, y, size, col, highlightSize) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = col;
    this.highlightSize = highlightSize;
  }
  
  display() {
    // Main fruit body
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size * 2);

    
    //  leaf/stem
    fill(40, 140, 40);
    ellipse(this.x + this.size * 0.1, this.y - this.size * 1.1, 14, 24);
  }
}
let foods = [];

function setup() {
  createCanvas(700, 500);
  
  // Create multiple food items
  for (let i = 0; i < 12; i++) {
    foods.push({
      x: random(40, width - 40),
      y: random(40, height - 40),
      size: random(20, 48),
      r: random(180, 255),
      g: random(100, 220),
      b: random(80, 200)
    });
  }
}

function draw() {
  background(245, 248, 235);   // light creamy background
  
  // One loop to draw ALL food items
  for (let food of foods) {
    // Simple solid circle
    noStroke();
    fill(food.r, food.g, food.b);
    ellipse(food.x, food.y, food.size);
  }


}
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
  fill(100,100,100)
  rect(100,175,200,75)
   //inside wheels
    fill(255);
  ellipse(125, 250, 20, 20);
  ellipse(275, 250, 20, 20);

  //Window
  
  fill(255);
  rect(125,180,60,50)
  rect(225,180,60,50)
  
}
class Ball {
  constructor(x, y, r, c) {
    this.position = new p5.Vector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(1.2);
    this.r = r;
	  this.r_mult = 1;
    this.m = r * 0.1;
	  this.c = c;
  }
  update() {
    this.position.add(this.velocity);
  }

  checkBoundaryCollision() {
    if (this.position.x > width - this.r) {
      this.position.x = width - this.r;
      this.velocity.x *= -1;
    } else if (this.position.x < this.r) {
      this.position.x = this.r;
      this.velocity.x *= -1;
    } else if (this.position.y > height - this.r) {
      this.position.y = height - this.r;
      this.velocity.y *= -1;
    } else if (this.position.y < this.r) {
      this.position.y = this.r;
      this.velocity.y *= -1;
    }
  }

  checkCollision(other) {
    // Get distances between the balls components
    let distanceVect = p5.Vector.sub(other.position, this.position);

    // Calculate magnitude of the vector separating the balls
    let distanceVectMag = distanceVect.mag();

    // Minimum distance before they are touching
    let minDistance = this.r + other.r;

    if (distanceVectMag < minDistance) {
      let distanceCorrection = (minDistance - distanceVectMag) / 2.0;
      let d = distanceVect.copy();
      let correctionVector = d.normalize().mult(distanceCorrection);
      other.position.add(correctionVector);
      this.position.sub(correctionVector);

      // get angle of distanceVect
      let theta = distanceVect.heading();
      // precalculate trig values
      let sine = sin(theta);
      let cosine = cos(theta);

      /* bTemp will hold rotated ball this.positions. You 
       just need to worry about bTemp[1] this.position*/
      let bTemp = [new p5.Vector(), new p5.Vector()];

      /* this ball's this.position is relative to the other
       so you can use the vector between them (bVect) as the 
       reference point in the rotation expressions.
       bTemp[0].this.position.x and bTemp[0].this.position.y will initialize
       automatically to 0.0, which is what you want
       since b[1] will rotate around b[0] */
      bTemp[1].x = cosine * distanceVect.x + sine * distanceVect.y;
      bTemp[1].y = cosine * distanceVect.y - sine * distanceVect.x;

      // rotate Temporary velocities
      let vTemp = [new p5.Vector(), new p5.Vector()];

      vTemp[0].x = cosine * this.velocity.x + sine * this.velocity.y;
      vTemp[0].y = cosine * this.velocity.y - sine * this.velocity.x;
      vTemp[1].x = cosine * other.velocity.x + sine * other.velocity.y;
      vTemp[1].y = cosine * other.velocity.y - sine * other.velocity.x;

      /* Now that velocities are rotated, you can use 1D
       conservation of momentum equations to calculate 
       the final this.velocity along the x-axis. */
      let vFinal = [new p5.Vector(), new p5.Vector()];

      // final rotated this.velocity for b[0]
      vFinal[0].x =
        ((this.m - other.m) * vTemp[0].x + 2 * other.m * vTemp[1].x) /
        (this.m + other.m);
      vFinal[0].y = vTemp[0].y;

      // final rotated this.velocity for b[0]
      vFinal[1].x =
        ((other.m - this.m) * vTemp[1].x + 2 * this.m * vTemp[0].x) /
        (this.m + other.m);
      vFinal[1].y = vTemp[1].y;

      // hack to avoid clumping
      bTemp[0].x += vFinal[0].x;
      bTemp[1].x += vFinal[1].x;

      /* Rotate ball this.positions and velocities back
       Reverse signs in trig expressions to rotate 
       in the opposite direction */
      // rotate balls
      let bFinal = [new p5.Vector(), new p5.Vector()];

      bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
      bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
      bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
      bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

      // update balls to screen this.position
      other.position.x = this.position.x + bFinal[1].x;
      other.position.y = this.position.y + bFinal[1].y;

      this.position.add(bFinal[0]);

      // update velocities
      this.velocity.x = cosine * vFinal[0].x - sine * vFinal[0].y;
      this.velocity.y = cosine * vFinal[0].y + sine * vFinal[0].x;
      other.velocity.x = cosine * vFinal[1].x - sine * vFinal[1].y;
      other.velocity.y = cosine * vFinal[1].y + sine * vFinal[1].x;
    }
  }

  display() {
    fill(this.c);
    ellipse(this.position.x, this.position.y, this.r * 2, this.r * 2);
	strokeWeight(2);
	stroke("white");
  }
 lines(other){
	  line(this.position.x, this.position.y, other.position.x , other.position.y)
}
 mk_button(){fill(this.c); 
   //noStroke();
	 period += 0.05; 
	 var amp = 10;
	 var new_r = amp*sin(period)+85

ellipse(this.position.x, this.position.y, new_r, new_r);
if (this.c === 0){
fill(255);
noStroke();	
}else{
fill(0);
}
text("bio",this.position.x, this.position.y);
}
}

let r = 15;
let c = 0;
let c_alt = 255;
let period =50 

function chg_opc(opc){
const team = document.getElementById("cont");
team.style.opacity = opc
}


let balls = [new Ball(100, 400, 40, c_alt), 
	new Ball(300, 200, r, c),
	new Ball(700, 400, r, c)
];
console.log(balls);
console.log(balls[0].r);
console.log(balls[0])

function setup() {
	var cnv = createCanvas(windowWidth, windowHeight);
	cnv.style('display', 'block');
	cnv.id("sketch");
	textSize(20);
	textAlign(CENTER, CENTER);
	textFont('monospace');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
} 

function mouseClicked() {
if (balls[0].c === c_alt &&
	mouseX >= balls[0].position.x - balls[0].r &&
	mouseX <= balls[0].position.x + balls[0].r &&
	mouseY >= balls[0].position.y - balls[0].r &&
	mouseY <= balls[0].position.y + balls[0].r
){
balls[0].c = 0;
chg_opc("100%");
}else if (balls[0].c == 0 &&
	mouseX >= balls[0].position.x - balls[0].r &&
	mouseX <= balls[0].position.x + balls[0].r &&
	mouseY >= balls[0].position.y - balls[0].r &&
	mouseY <= balls[0].position.y + balls[0].r
){
balls[0].c = c_alt;
	chg_opc("0%");
}else if (balls[1].c == 0 &&
	mouseX >= balls[1].position.x - balls[1].r &&
	mouseX <= balls[1].position.x + balls[1].r &&
	mouseY >= balls[1].position.y - balls[1].r &&
	mouseY <= balls[1].position.y + balls[1].r
){
balls[1].c = c_alt;
	window.open("https://nexo-inconstante.github.io/");
}else if (balls[1].c == c_alt &&
	mouseX >= balls[1].position.x - balls[1].r &&
	mouseX <= balls[1].position.x + balls[1].r &&
	mouseY >= balls[1].position.y - balls[1].r &&
	mouseY <= balls[1].position.y + balls[1].r
){
balls[1].c = 0;
	window.open("https://nexo-inconstante.github.io/");
}
}

function draw() {

  background(0,20);
    balls[0].lines(balls[1]);
    balls[1].lines(balls[2]);
    balls[2].lines(balls[0]);
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];
    b.update();
    b.display();
    b.checkBoundaryCollision();
    balls[0].checkCollision(balls[1]);
    balls[1].checkCollision(balls[2]);
    balls[2].checkCollision(balls[0]);
  }
  balls[0].mk_button();
}


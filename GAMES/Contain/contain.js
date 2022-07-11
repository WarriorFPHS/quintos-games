// screen width is 256, height is 192

let imgBall = spriteArt(`
..ygyg..
.yg..gy.
yg....gy
y......g
g......y
yg....gy
.yg..gy.
..ygyg..`);

// the \n means new line
let imgPaddle = spriteArt('.wwwwww.\nwwwwwwww\n' + 'ww....ww\n'.repeat(42) + 'wwwwwwww\n.wwwwww.');

/* PART A1: Make image for the wall */
let imgWall = spriteArt('u'.repeat(128) + '\n' + 'r'.repeat(128) + 'u'.repeat(128), 2);
let wallT = new Sprite(imgWall, 0, 15, 'static');

let imgWall2 = spriteArt('u'.repeat(128) + '\n' + 'r'.repeat(128) + 'u'.repeat(128), 2);
let wallB = new Sprite(imgWall2, 0, height - 15, 'static');

// places a ball in center of the screen
let ball = new Sprite(imgBall);
ball.x = width / 2;
ball.y = height / 2;
ball.velocity.x = -1;
ball.velocity.y = 1;
ball.bounciness = 1;
ball.friction = 0;
ball.rotationLocked = true;

/* PART A0: create two paddles, place on each end of the screen */
let paddleL = new Sprite(imgPaddle);
paddleL.x = 16;
paddleL.y = height / 2;
paddleL.static = true;

let paddleR = new Sprite(imgPaddle);
paddleR.x = width - 16 - paddleR.w;
paddleR.y = height / 2;
paddleR.static = true;

let increment = 0.1;
let scoreL = 0;
let scoreR = 0;

function displayScore() {
	text(scoreL, 3, 13);
	text(scoreR, 3, 19);
}

displayScore();

function draw() {
	background(0);

	/* PART A1: draw the ball and paddles inside the p5 main draw function */
	// the `width` and `height` variables are the width and height of the screen

	// check if the ball goes off screen
	if (ball.x + ball.w <= 0) {
		ball.x = width / 2;
		ball.y = height / 2;
		ball.velocity.x = 1;
		ball.velocity.y = -1;
		scoreR = scoreR + 1;
		displayScore();
	}
	if (ball.x >= width) {
		ball.x = width / 2;
		ball.y = height / 2;
		ball.velocity.x = -1;
		ball.velocity.y = 1;
		scoreL = scoreL + 1;
		displayScore();
	}

	if (keyIsDown('ArrowUp')) {
		paddleR.y -= 2;
		paddleR.rotation -= 2;
		if (paddleR.rotation > -1) {
			paddleR.x += 1;
		} else if (paddleR.rotation < 1) {
			paddleR.x -= 1;
		}
	} else if (keyIsDown('ArrowDown')) {
		paddleR.y += 2;
		paddleR.rotation += 2;
		if (paddleR.rotation > -1) {
			paddleR.x -= 1;
		} else if (paddleR.rotation < 1) {
			paddleR.x += 1;
		}
	}
	log(paddleR.x);

	if (keyIsDown('w')) {
		paddleL.y -= 2;
		paddleL.rotation += 2;
		if (paddleL.rotation > 0) {
			paddleL.x += 1;
		} else if (paddleL.rotation < 0) {
			paddleL.x -= 1;
		}
	} else if (keyIsDown('s')) {
		paddleL.y += 2;
		paddleL.rotation -= 2;
		if (paddleL.rotation > 0) {
			paddleL.x -= 1;
		} else if (paddleL.rotation < 0) {
			paddleL.x += 1;
		}
	}
}

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
let wallT = createSprite(imgWall);
wallT.x = 0;
wallT.y = 15;

let imgWall2 = spriteArt('u'.repeat(128) + '\n' + 'r'.repeat(128) + 'u'.repeat(128), 2);
let wallB = createSprite(imgWall2);
wallB.x = 0;
wallB.y = height - 15;

// places a ball in center of the screen
let ball = createSprite(imgBall);
ball.x = width / 2;
ball.y = height / 2;
ball.velocity.x = -1;
ball.velocity.y = 1;

/* PART A0: create two paddles, place on each end of the screen */
let paddleL = createSprite(imgPaddle);
paddleL.x = 16;
paddleL.y = height / 2 - paddleL.h / 2;
paddleL.immovable = true;

let paddleR = createSprite(imgPaddle);
paddleR.x = width - 16 - paddleR.w;
paddleR.y = height / 2 - paddleR.h / 2;
paddleR.immovable = true;

let increment = 0.1;
let scoreL = 0;
let scoreR = 0;

function displayScore() {
	txt(scoreL, 3, 13);
	txt(scoreR, 3, 19);
}

displayScore();

function draw() {
	background(0);
	/* PART A1: draw the ball and paddles inside the p5 main draw function */
	// the `width` and `height` variables are the width and height of the screen

	// check if the ball hits the walls
	if (ball.y <= wallT.y + wallT.h) {
		ball.velocity.y = -ball.velocity.y + increment;
	}
	if (ball.y + ball.h >= wallB.y) {
		ball.velocity.y = -ball.velocity.y - increment;
	}
	if (ball.y <= wallT.y + wallT.h || ball.y + ball.h >= wallB.y) {
		if (ball.velocity.x > 0) {
			ball.velocity.x = ball.velocity.x + increment;
		} else {
			ball.velocity.x = ball.velocity.x - increment;
		}
	}

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

	if (keyIsDown(UP_ARROW)) {
		paddleR.y = paddleR.y - 2;
	} else if (keyIsDown(DOWN_ARROW)) {
		paddleR.y = paddleR.y + 2;
	}
	if (keyIsDown(87)) {
		paddleL.y = paddleL.y - 2;
	} else if (keyIsDown(83)) {
		paddleL.y = paddleL.y + 2;
	}

	ball.bounce(paddleL);
	ball.bounce(paddleR);

	drawSprites();
}

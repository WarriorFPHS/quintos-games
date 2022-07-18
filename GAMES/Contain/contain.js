// screen width is 256, height is 192

let imgBall = spriteArt(`
..ygys.
.yg.gy
yg...gy
.yg.gy
..ygy.`);

// the \n means new line
let imgPaddle = '.wwwwww.\nwwwwwwww\n' + 'ww....ww\n'.repeat(42) + 'wwwwwwww\n.wwwwww.';
let ballsOffScreen = 0;
let balls = new Group();

// places a ball in center of the screen
async function serve() {
	for (let i = 0; i < 4; i++) {
		log('3');
		await delay(1000);
		log('2');
		await delay(1000);
		log('1');
		await delay(1000);
		if (i == 0) {
			text(' '.repeat(30), 0);
		}
		let ball = new Sprite(imgBall);
		ball.x = width / 2;
		ball.y = height / 2;
		let rand = Math.random() * 0.5 + 0.25;
		let rand2 = Math.random() * 0.5 + 0.25;

		if (Math.random() > 0.5) {
			rand = -rand;
		}
		if (Math.random() > 0.5) {
			rand2 = -rand2;
		}

		ball.velocity.x = rand;
		ball.velocity.y = rand2;
		ball.bounciness = 1;
		ball.friction = 0;
		ball.rotationLocked = true;
		ball.active = true;
		balls.push(ball);
	}
}
serve();

/* PART A0: create two paddles, place on each end of the screen */
let paddles = new Group();
let paddleL = new Sprite(spriteArt(imgPaddle.replaceAll('w', 'u')));
paddleL.static = true;
paddles.push(paddleL);

let paddleR = new Sprite(spriteArt(imgPaddle.replaceAll('w', 'g')));
paddleR.static = true;
paddles.push(paddleR);

let paddleBL = new Sprite(spriteArt(imgPaddle.replaceAll('w', 'm')));
paddleBL.static = true;
paddles.push(paddleBL);

let paddleBR = new Sprite(spriteArt(imgPaddle.replaceAll('w', 'y')));
paddleBR.static = true;
paddles.push(paddleBR);

let time = 0;

async function timer() {
	paddleL.rotation = -180;
	paddleR.rotation = 0;
	paddleBL.rotation = 90;
	paddleBR.rotation = -90;
	while (ballsOffScreen < 3) {
		await delay(1000);
		time++;
		text(time, 3, 16);
	}
	await alert('Game Over! You must contain at least two balls.\n\nScore:' + time + '\n\nPress enter to restart.', 2, 0);
	ballsOffScreen = 0;
	time = 0;
	balls.removeSprites();
	serve();
	timer();
}
timer();

function draw() {
	background(0);

	/* PART A1: draw the ball and paddles inside the p5 main draw function */
	// the `width` and `height` variables are the width and height of the screen

	if (keyIsDown('ArrowUp') && paddleR.rotation > -90) {
		paddleR.rotation -= 2;
	} else if (keyIsDown('ArrowDown') && paddleR.rotation < 90) {
		paddleR.rotation += 2;
	}
	if (keyIsDown('ArrowLeft')) {
		paddleBR.rotation -= 2;
	} else if (keyIsDown('ArrowRight')) {
		paddleBR.rotation += 2;
	}

	log(paddleL.rotation);
	if (keyIsDown('w') && (paddleL.rotation < -92 || paddleL.rotation > 90)) {
		paddleL.rotation += 2;
	} else if (keyIsDown('s') && (paddleL.rotation > 92 || paddleL.rotation < -90)) {
		paddleL.rotation -= 2;
	}
	if (keyIsDown('a')) {
		paddleBL.rotation += 2;
	} else if (keyIsDown('d')) {
		paddleBL.rotation -= 2;
	}

	for (let paddle of paddles) {
		paddle.x = 88 * cos(paddle.rotation) + width / 2;
		paddle.y = 88 * sin(paddle.rotation) + height / 2;
	}

	for (let ball of balls) {
		if (ball.active && (ball.x > width || ball.y > height || ball.x < 0 || ball.y < 0)) {
			ball.active = false;
			ballsOffScreen++;
		}
	}
}

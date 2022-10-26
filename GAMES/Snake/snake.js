function preload() {
	eatSound = loadSound(QuintOS.dir + '/sounds/retro_collect_pickup_item_20.wav');
	eatSound.setVolume(0.3);

	crashSound = loadSound(QuintOS.dir + '/sounds/retro_crash_damage_01.wav');
	crashSound.setVolume(0.3);

	moveSounds = [];
	score = 0;
	for (let i = 1; i < 10; i++) {
		sound = loadSound(QuintOS.dir + '/sounds/Footstep1__00' + i + '.wav');
		sound.setVolume(0.3);
		moveSounds[i] = sound;
	}

	world.offset.y = 16;

	allSprites.tileSize = 8;
	allSprites.spriteSheet = loadImage(QuintOS.dir + '/img/world.png');

	pipes = new Group();
	pipes.layer = 1;
	pipes.addAnis({
		'+': [0, 2],
		'├': [1, 2],
		'-': [2, 2],
		'┤': [3, 2],
		'┬': { pos: [1, 2], rotation: 90 },
		'|': { pos: [2, 2], rotation: 90 },
		'┴': { pos: [3, 2], rotation: 90 },
		'┌': [4, 2],
		'┐': [5, 2],
		'└': [6, 2],
		'┘': [7, 2]
	});

	grass = new Group();
	grass.layer = 0;
	grass.collider = 'none';
	for (let i = 0; i < 10; i++) {
		grass.addAni('grass' + i, [i, 1]);
	}

	mode = new Group();
	mode.spriteSheet = loadImage(QuintOS.dir + '/img/icons.png');
	mode.tileSize = 16;
	mode.addImgs({
		normal: [0, 0],
		reverse: [1, 0]
	});

	snake = new Group();
	snake.layer = 2;
	snake.collider = 'none';
	snake.spriteSheet = loadImage(QuintOS.dir + '/img/snakes.png');
	snake.addAnis({
		headUp: [0, 0],
		bodyUp: { pos: [2, 0], frames: 2 },
		tailUp: { pos: [4, 0], frames: 2 },
		headLeft: [6, 0],
		bodyLeft: { pos: [8, 0], frames: 2 },
		tailLeft: { pos: [10, 0], frames: 2 },
		eatUp: { pos: [0, 1], frames: 5 },
		eatLeft: { pos: [5, 1], frames: 5 }
	});
	board = new Group();
	board.layer = 1;
	board.collider = 'none';
	board.spriteSheet = loadImage(QuintOS.dir + '/img/world.png');

	board.addAnis({
		egg: [0, 0]
	});
}

let inputDirection = 'up';
let ateEgg = false;
let snakeSpeed = 0.05;
let reverseMode = false;
let swapHeadings = true;

function setup() {
	/* Part A: create the grass field */

	createTiles([
		'┌├----------------┤┐',
		'┬                  ┬',
		'|                  |',
		'|                  |',
		'|                  |',
		'|                  |',
		'|                  |',
		'|                  |',
		'|                  |',
		'|                  |',
		'|                  |',
		'|                  |',
		'|                  |',
		'┴                  ┴',
		'└├----------------┤┘'
	]);

	for (let x = 0; x < 20; x++) {
		for (let y = 0; y < 15; y++) {
			let rand = round(Math.random() * 9);
			new grass.Sprite('grass' + rand, x, y);
		}
	}

	selectMode();
}

function selectMode() {
	new mode.Sprite('normal', 1, 1);
	new mode.Sprite('reverse', 1, 2);

	button('Normal Mode', 4, 4, startNewGame);
	button('Reverse Mode', 6, 4, () => {
		reverseMode = true;
		startNewGame();
	});
}

function startNewGame() {
	erase();
	mode.remove();

	new snake.Sprite('headUp', 3, 10);
	new snake.Sprite('bodyUp', 3, 11);
	new snake.Sprite('tailUp', 3, 12);
	egg = new board.Sprite('egg', 9, 6);

	for (let i = 0; i < snake.length; i++) {
		snake[i].heading = 'up';
	}

	moveSnake();
}
function spawnEgg() {
	insideSnake = true;
	while (insideSnake) {
		randX = round(random(1, 18));
		randY = round(random(1, 13));
		insideSnake = false;
		for (let s of snake) {
			if (s.x == randX && s.y == randY) {
				insideSnake = true;
			}
		}
	}

	egg = new board.Sprite('egg', randX, randY);
}

function reverseSnake() {
	let tailX = snake[snake.length - 1].x;
	let tailY = snake[snake.length - 1].y;
	snake[snake.length - 1].x = snake[0].x;
	snake[snake.length - 1].y = snake[0].y;
	snake[0].x = tailX;
	snake[0].y = tailY;

	for (let i = 1; i < floor(snake.length / 2); i++) {
		let temp = snake[i];
		snake[i] = snake[snake.length - 1 - i];
		snake[snake.length - 1 - i] = temp;
	}

	for (let s of snake) {
		if (s.heading == 'up') s.heading = 'down';
		else if (s.heading == 'down') s.heading = 'up';
		else if (s.heading == 'left') s.heading = 'right';
		else if (s.heading == 'right') s.heading = 'left';
	}
	let temp = snake[0].heading;
	inputDirection = snake[snake.length - 1].heading;
	snake[0].heading = inputDirection;
	snake[snake.length - 1].heading = temp;
}

function snakeChangeAni(part, type) {
	if (part.heading == 'up') {
		part.ani = type + 'Up';
		part.mirror.y = false;
	} else if (part.heading == 'down') {
		part.ani = type + 'Up';
		part.mirror.y = true;
	} else if (part.heading == 'left') {
		part.ani = type + 'Left';
		part.mirror.x = false;
		part.mirror.y = false;
	} else if (part.heading == 'right') {
		part.ani = type + 'Left';
		part.mirror.x = true;
		part.mirror.y = false;
	}
}

async function gameOver() {
	await alert('Game Over! Try Again?');
	snake.remove();
	egg.remove();
	snakeSpeed = 0.05;
	score = 0;
	inputDirection = 'up';
	startNewGame();
}

async function moveSnake() {
	let head = snake[0];
	// if the snake head will hit a pipe
	if (
		(head.x >= 18 && inputDirection == 'right') ||
		(head.x <= 1 && inputDirection == 'left') ||
		(head.y >= 13 && inputDirection == 'down') ||
		(head.y <= 1 && inputDirection == 'up')
	) {
		head.heading = inputDirection;
		snakeChangeAni(head, 'head');
		gameOver();
		return;
	}
	// if the snake head hits itself
	for (let i = 3; i < snake.length; i++) {
		if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
			gameOver();
			return;
		}
	}
	let movements = [];
	if (snake[0].x == egg.x && snake[0].y == egg.y) {
		egg.remove();
		score++;
		spawnEgg();
		if (reverseMode) {
			reverseSnake();
		}
		ateEgg = true;

		if (snakeSpeed < 0.1) {
			snakeSpeed += 0.01;
		} else if (snakeSpeed < 0.12) {
			snakeSpeed += 0.005;
		} else {
			snakeSpeed += 0.0025;
		}
		log(snakeSpeed);

		let newBody = new snake.Sprite('bodyUp', snake[0].x, snake[0].y);
		for (let i = snake.length - 1; i > 1; i--) {
			snake[i] = snake[i - 1];
		}
		snake[1] = newBody;
		snake[1].heading = snake[0].heading;
		snakeChangeAni(snake[1], 'body');
	}
	for (let i = snake.length - 1; i >= 0; i--) {
		let type = 'body';
		// if snake head
		if (ateEgg) {
			i = 0;
		}
		if (i == 0) {
			snake[0].heading = inputDirection;
			type = 'head';
			if (
				(snake[0].x - 1 == egg.x && inputDirection == 'left' && snake[0].y == egg.y) ||
				(snake[0].x + 1 == egg.x && inputDirection == 'right' && snake[0].y == egg.y) ||
				(snake[0].y - 1 == egg.y && inputDirection == 'up' && snake[0].x == egg.x) ||
				(snake[0].y + 1 == egg.y && inputDirection == 'down' && snake[0].x == egg.x)
			) {
				type = 'eat';
			}
		} else {
			if (swapHeadings) {
				snake[i].heading = snake[i - 1].heading;
			}
		}
		if (i == snake.length - 1) {
			type = 'tail';
		}

		snakeChangeAni(snake[i], type);

		log(i, snake[i].heading);

		movements.push(snake[i].move(snake[i].heading, snakeSpeed));
	}

	await Promise.all(movements);
	text(score, 17, 0);

	if (!swapHeadings) {
		swapHeadings = true;
	}
	if (ateEgg) {
		ateEgg = false;
		if (reverseMode) swapHeadings = false;
	}

	moveSnake();
}

function draw() {
	background(2);
	if (kb.presses('ArrowUp') && snake[0].heading != 'down') {
		inputDirection = 'up';
	} else if (kb.presses('ArrowDown') && snake[0].heading != 'up') {
		inputDirection = 'down';
	} else if (kb.presses('ArrowLeft') && snake[0].heading != 'right') {
		inputDirection = 'left';
	} else if (kb.presses('ArrowRight') && snake[0].heading != 'left') {
		inputDirection = 'right';
	}
}

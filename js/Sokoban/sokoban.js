/**
 * @type Sprite
 */
let player;

/**
 * @type Group
 */
let floors;

/**
 * @type Group
 */
let walls;

/**
 * @type Group
 */
let chests;

/**
 * @type Group
 */
let goals;

function preload() {
	// translates the origin (0, 0)
	world.offset.x = 104;
	world.offset.y = 48;

	allSprites.tileSize = 16;
	allSprites.pixelPerfect = true;
	allSprites.rotationLock = true;
	allSprites.spriteSheet = loadImage('/img/questKid/world.png');
	allSprites.resetAnimationsOnChange = true;

	floors = new Group();
	floors.collider = 'n';
	floors.addAnis({
		smooth: [1, 0],
		cobble: [2, 0]
	});

	walls = new Group();
	walls.addAnis({
		bricks: [2, 0],
		s_bricks: [3, 0],
		slateBottom: [2, 1],
		slateRight: [2, 2],
		cornerBottomRight: [2, 3],
		blank: [2, 4],
		slateSides: [2, 5],
		cornersBottom: [2, 6],
		slateTopRight: [2, 7]
	});

	chests = new Group();
	chests.addAnis({
		yellow_chest: [10, 0],
		open_yellow_chest: [10, 1],
		red_chest: [10, 2],
		open_red_chest: [10, 3],
		blue_chest: [10, 4],
		open_blue_chest: [10, 5],
		giant_chest: [10, 6],
		open_giant_chest: [10, 7]
	});

	/* PART A: Choose a tile to represent the box goal positions on the floor */
	goals = new Group();
	goals.collider = 'n';
	goals.addAnis({
		redRug: [7, 12],
		blueRug: [7, 13]
	});

	/* PLAYER */

	player = new Sprite(0, 0);
	player.layer = 1;
	player.spriteSheet = loadImage('/img/questKid/questKid.png');
	player.anis.offset.x = 2;
	player.anis.offset.y = 2;
	player.anis.frameDelay = 8;
	player.tileSize = 32;

	player.addAnis({
		run: { row: 0, frames: 8, frameDelay: 3 },
		jump: { row: 1, frames: 6 },
		roll: { row: 2, frames: 5, frameDelay: 14 },
		turn: { row: 3, frames: 7, frameDelay: 2 },
		stand: { row: 3, frames: 1 },
		walkUp: { row: 4, frames: 8 },
		pushUp: { row: 5, frames: 4 },
		pushRight: { row: 6, frames: 8 },
		pushDown: { row: 7, frames: 8 },
		idle0: { row: 1, frames: 1 },
		idle1: { row: 8, frames: 5 },
		idle2: { row: 9, frames: 6 }
	});
	player.changeAni('idle0');

	player.overlaps(goals);
	player.overlaps(floors);
	player.layer = 100;
	floors.layer = 0;
	goals.layer = 1;
}

function setup() {
	new goals.Sprite('redRug', 2, 2);

	for (let x = 0; x < 8; x++) {
		for (let y = 0; y < 8; y++) {
			new floors.Sprite('smooth', x, y);
		}
	}
}

let inputBuffer = [];

function draw() {
	background('b');

	// detect and save user input in an array (input buffer)
	if (kb.presses('up')) inputBuffer.push('up');
	if (kb.presses('down')) inputBuffer.push('down');
	if (kb.presses('left')) inputBuffer.push('left');
	if (kb.presses('right')) inputBuffer.push('right');

	// then if the input buffer contains inputs to be processed, process them
	// (actually make the player move)
	// ['down']
	if (inputBuffer.length > 0 && !player.isMoving) {
		let inp = inputBuffer[0];

		if (inp == 'down') {
			player.move(0.5, 'down', 0.025);
			player.changeAni('run');
		} else if (inp == 'up') {
			player.move(0.5, 'up', 0.025);
			if (player.ani.name != 'walkUp') {
				player.changeAni(['turn', 'walkUp']);
			}
		} else if (inp == 'right') {
			player.mirror.x = false;
			player.changeAni('run');
			player.move(0.5, 'right', 0.025);
		} else if (inp == 'left') {
			player.mirror.x = true;
			player.changeAni('run');
			player.move(0.5, 'left', 0.025);
		}
		inputBuffer.shift();
	}

	if (inputBuffer.length == 0 && player.speed == 0 && (player.ani.name == 'run' || player.ani.name == 'walkUp')) {
		if (player.ani.name == 'walkUp') {
			log('turn');
			player.changeAni(['!turn', 'idle0']);
		} else {
			log('idle0');
			player.changeAni('idle0');
		}
	}
}

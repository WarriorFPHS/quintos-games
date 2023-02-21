let player, platforms;

function setup() {
	world.gravity.y = 10;

	player = new Sprite(160, 200, 20, 'static');
	player.color = 'yellow';

	platforms = new Group();
	platforms.w = 30;
	platforms.h = 10;
	platforms.color = 'green';
	platforms.collider = 'none';

	// new platforms.Sprite(160, 300);
	// new platforms.Sprite(20, 200);
	// new platforms.Sprite(80, 250);
	for (let i = 0; i < 3; i++) {
		let x = 110 * i;
		let y = 300;
		for (let j = 0; j < 50; j++) {
			new platforms.Sprite(x, y);
			x += random(-50, 50);
			if (x < 0) {
				x = 0;
			}
			if (x > 320) {
				x = 320;
			}
			y -= 80;
		}
	}
}

function draw() {
	clear();

	if (mouse.presses()) {
		player.collider = 'dynamic';
	}
	player.x = mouse.x;

	for (let platform of platforms) {
		if (player.y < platform.y) {
			platform.collider = 'static';
		}
		if (player.y > platform.y) {
			platform.collider = 'none';
		}
	}

	log(player.vel.y);

	// player collides with platform and is falling
	if (player.collided(platforms) && player.vel.y >= -0.5) {
		player.vel.y = -6; // then jump
	}

	if (player.y < camera.y) {
		camera.y = player.y;
	}
}

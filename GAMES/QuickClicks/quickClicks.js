const target = `
 .d88b. 
.8P  Y8.
88    88
88    88
 8b  d8 
 'Y88P' `.slice(1);
// slice removes the first character from the String
// in this case I remove the new line at the beginning
// so the first line of the button will be at the proper
// row value

let times = [];

let btn;
async function clickResponse() {
	if (btn) {
		btn.erase();
		await drawBackground();
	}
	times.push(Date.now());

	if (times.length == 10) {
		log(times);
		let speeds = [];

		for (let i = 0; i < 9; i++) {
			speeds[i] = times[i + 1] - times[i];
		}
		log(speeds);
		let sum = 0;
		for (let i = 0; i < 9; i++) {
			sum = speeds[i] + sum;
		}
		let avg = Math.round(sum / 9);

		let fastest = speeds[0];
		let slowest = speeds[0];
		for (let i = 0; i < 9; i++) {
			if (fastest > speeds[i]) {
				fastest = speeds[i];
			}
			if (slowest < speeds[i]) {
				slowest = speeds[i];
			}
		}

		log(fastest);
		log(slowest);
		await alert(
			'Your average speed was: ' +
				avg +
				'ms\n' +
				'Your fastest time was: ' +
				fastest +
				'ms\n' +
				'Your slowest time was: ' +
				slowest +
				'ms'
		);
	} else {
		/* PART A0: change the values of row and col to be random */
		// screen size is 80 cols x 30 rows
		// target is 8w x 6h
		// drawing starts from top left corner
		// we want to draw the target within the bounds of the frame
		// 30 rows - 6 target height - 1 frame line = 23
		// 80 columns - 8 target width - 1 frame line = 71
		let row = Math.random() * 23;
		let col = Math.random() * 71;
		row = Math.floor(row) + 1;
		col = Math.floor(col) + 1;
		btn = button(target, row, col, clickResponse);
	}
}

async function drawBackground() {
	for (let row = 1; row < 29; row++) {
		if (row % 2 == 0) {
			await text('v^'.repeat(39), row, 1);
		} else {
			await text('^v'.repeat(39), row, 1);
		}
	}
}

async function startGame() {
	await drawBackground();
	await alert('Click the targets as fast as you can. The more the better!');
	await drawBackground();
	clickResponse();
}

startGame();

/* PART B: Use recursion to make a new button after clicking a button */

/* PART C: Limit clicks to 20, calculate stats */

/* PART D: Make a background pattern */

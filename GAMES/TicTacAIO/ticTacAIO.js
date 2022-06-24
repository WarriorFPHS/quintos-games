const title = `
TTTTT IIIII   CCC
  T     I    C
  T     I    C
  T     I    C
  T   IIIII   CCC

TTTTT  AAA    CCC
  T   A   A  C
  T   AAAAA  C
  T   A   A  C
  T   A   A   CCC

TTTTT  OOO   EEEE
  T   O   O  E
  T   O   O  EEE
  T   O   O  E
  T    OOO   EEEE`.slice(1);

text(title, 5, 6);

const bigSpace = '        \n'.repeat(7);

const bigO = `
 OOOOOO
OO    OO
OO    OO
OO    OO
OO    OO
OO    OO
 OOOOOO`.slice(1); // slice off the first newline character

const bigX = `
XX    XX
 XX  XX
  XXXX
   XX
  XXXX
 XX  XX
XX    XX`.slice(1);

const gridRow = 3;
const gridCol = 26;

let board = [
	['', '', ''],
	['', '', ''],
	['', '', '']
];

/* PART A: finish the grid of 9x8 spaces */
text('─'.repeat(26), gridRow + 7, gridCol);
text('─'.repeat(26), gridRow + 15, gridCol); // draw another horizontal line

text('│\n'.repeat(23), gridRow, gridCol + 8);
text('│\n'.repeat(23), gridRow, gridCol + 17); // draw another vertical line

/* PART A: Make the buttons in the grid */
// note the intervals! row += 8 and col += 9
let x_score = 0;
let o_score = 0;

function displayScore() {
	text('Score X: ' + x_score + '\nScore O: ' + o_score, 1, 58);
}

displayScore();

function checkForWinner(mark) {
	for (let i = 0; i < 3; i++) {
		if (board[i][0] == mark && board[i][1] == mark && board[i][2] == mark) {
			return true;
		}
		if (board[0][i] == mark && board[1][i] == mark && board[2][i] == mark) {
			return true;
		}
	}

	if (board[0][0] == mark && board[1][1] == mark && board[2][2] == mark) {
		return true;
	}
	if (board[2][0] == mark && board[1][1] == mark && board[0][2] == mark) {
		return true;
	}

	return false;
}

function checkForDraw() {
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (board[i][j] == '') {
				return false;
			}
		}
	}
	return true;
}

let turnX = true;
function randomize() {
	if (Math.random() > 0.5) {
		turnX = false;
	}
	if (turnX) {
		text('Turn: X', 1, 50);
	} else {
		text('Turn: O', 1, 50);
	}
}

let userWarning = false;
async function takeTurn(row, col) {
	if (userWarning) return;
	if (board[row][col] == 'x' || board[row][col] == 'o') {
		userWarning = true;
		await alert('This box is already filled.', 23, 59, 20);
		userWarning = false;
		return;
	}
	let mark;
	if (turnX) {
		text('Turn: O', 1, 50);
		text(bigX, gridRow + row * 8, gridCol + col * 9);
		board[row][col] = 'x';
		mark = 'x';
	} else {
		text('Turn: X', 1, 50);
		text(bigO, gridRow + row * 8, gridCol + col * 9);
		board[row][col] = 'o';
		mark = 'o';
	}

	if (checkForWinner(mark)) {
		await alert('The winner is ' + mark, 23, 59, 20);
		if (mark == 'x') {
			x_score++;
			turnX = false;
		}
		if (mark == 'o') {
			o_score++;
			turnX = true;
		}
		displayScore();

		startNewGame();
		return;
	}
	if (checkForDraw()) {
		await alert('The winner is no one', 23, 59, 20);
		randomize();
		startNewGame();
		return;
	}

	turnX = !turnX;
}

function startNewGame() {
	board = [
		['', '', ''],
		['', '', ''],
		['', '', '']
	];
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			text(bigSpace, gridRow + i * 8, gridCol + j * 9);
		}
	}
}

for (let row = 0; row < 3; row++) {
	for (let col = 0; col < 3; col++) {
		button(bigSpace, gridRow + row * 8, gridCol + col * 9, () => {
			takeTurn(row, col);
		});
	}
}

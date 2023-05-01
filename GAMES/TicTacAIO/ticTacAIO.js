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

txt(title, 5, 6);

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
	[' ', ' ', ' '],
	[' ', ' ', ' '],
	[' ', ' ', ' ']
];

/* PART A: finish the grid of 9x8 spaces */
txt('─'.repeat(26), gridRow + 7, gridCol);
txt('─'.repeat(26), gridRow + 15, gridCol); // draw another horizontal line

txt('│\n'.repeat(23), gridRow, gridCol + 8);
txt('│\n'.repeat(23), gridRow, gridCol + 17); // draw another vertical line

/* PART A: Make the buttons in the grid */
// note the intervals! row += 8 and col += 9
let x_score = 0;
let o_score = 0;
let onePlayer = false;
let aiBattle = false;
let turnNum = 1;

function displayScore() {
	txt('Score X: ' + x_score + '\nScore O: ' + o_score, 1, 58);
}
displayScore();

function chooseMode() {
	button('0 Player Mode', 10, 56, () => {
		aiBattle = true;
		startGame();
	});
	button('1 Player Mode', 15, 56, async () => {
		onePlayer = true;
		await eraseRect(10, 56, 1, 11);
		chooseDifficulty();
	});
	button('2 Player Mode', 20, 56, startGame);
}

chooseMode();

function chooseDifficulty() {
	button('Easy', 10, 56, () => {
		difficulty = 1;
		startGame();
	});
	button('Medium', 15, 56, () => {
		difficulty = 2;
		startGame();
	});
	button('Hard', 20, 56, () => {
		difficulty = 3;
		startGame();
	});
	button('Unbeatable', 25, 56, () => {
		difficulty = 4;
		startGame();
	});
}

function checkForWinner(mark) {
	for (let i = 0; i < 3; i++) {
		// check rows
		if (board[i][0] == mark && board[i][1] == mark && board[i][2] == mark) {
			return true;
		}
		// check columns
		if (board[0][i] == mark && board[1][i] == mark && board[2][i] == mark) {
			return true;
		}
	}

	// check diagonals
	if (board[0][0] == mark && board[1][1] == mark && board[2][2] == mark) {
		return true;
	}
	if (board[2][0] == mark && board[1][1] == mark && board[0][2] == mark) {
		return true;
	}

	return false;
}

function checkForDraw() {
	// check if all spaces are filled
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (board[i][j] == ' ') {
				return false;
			}
		}
	}
	return true;
}

let turnX = true;
function randomStart() {
	if (Math.random() < 0.5) {
		turnX = true;
		txt('Turn: X', 1, 50);
		if (aiBattle) {
			aiTakeTurn();
		}
	} else {
		turnX = false;
		txt('Turn: O', 1, 50);
		if (onePlayer || aiBattle) {
			aiTakeTurn();
		}
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
		txt(bigX, gridRow + row * 8, gridCol + col * 9);
		board[row][col] = 'x';
		mark = 'x';

		txt('Turn: O', 1, 50);
	} else {
		txt(bigO, gridRow + row * 8, gridCol + col * 9);
		board[row][col] = 'o';
		mark = 'o';

		txt('Turn: X', 1, 50);
	}

	turnNum++;

	if (checkForWinner(mark)) {
		userWarning = true;
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

		reset();
		if (mark == 'x') {
			aiTakeTurn();
		}
		return;
	}
	if (checkForDraw()) {
		userWarning = true;
		await alert('The winner is no one', 23, 59, 20);
		reset();
		randomStart();
		return;
	}

	turnX = !turnX;
	log(board.join('\n'));
	if (aiBattle || (onePlayer && !turnX)) {
		aiTakeTurn();
	}
}
s;
function aiTakeTurn() {
	let ai = 'o';
	let op = 'x'; // opponent
	if (aiBattle) {
		if (turnX) {
			difficulty = 4;
			ai = 'x';
			op = 'o';
		} else {
			difficulty = 3;
		}
	}
	if (difficulty == 3 || difficulty == 4) {
		// hard AI

		// go through all available spaces to check
		// if the AI can win
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] == ' ') {
					board[i][j] = ai;
					if (checkForWinner(ai)) {
						board[i][j] = ' ';
						takeTurn(i, j);
						return;
					} else {
						board[i][j] = ' ';
					}
				}
			}
		}

		// next check all availble spaces to see
		// if the AI can block their opponent from winning
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] == ' ') {
					board[i][j] = op;
					if (checkForWinner(op)) {
						board[i][j] = ' ';
						takeTurn(i, j);
						return;
					} else {
						board[i][j] = ' ';
					}
				}
			}
		}
	}

	if (difficulty == 4) {
		// unbeatable AI
		if (turnNum == 1 || (turnNum == 2 && board[1][1] == op)) {
			let rand = Math.random();
			if (rand < 0.25) {
				takeTurn(0, 0);
			} else if (rand < 0.5) {
				takeTurn(0, 2);
			} else if (rand < 0.75) {
				takeTurn(2, 0);
			} else {
				takeTurn(2, 2);
			}
			return;
		}

		// -o-
		// oox
		// xx-

		if (turnNum == 2) {
			if (board[0][1] == op || board[1][0] == op) {
				takeTurn(0, 0);
				return;
			}
			if (board[1][2] == op || board[2][1] == op) {
				takeTurn(2, 2);
				return;
			}
		}

		// take middle if available
		if (board[1][1] == ' ') {
			takeTurn(1, 1);
			return;
		}

		// o--
		// -x-
		// --o

		// if ai has middle and op has two opposing corners take a side mid
		if ((board[0][0] == op && board[2][2] == op) || (board[2][0] == op && board[0][2] == op)) {
			if (board[0][1] == ' ') {
				takeTurn(0, 1);
				return;
			}
		}

		// after taking middle if available
		// rule 1: if they took a corner take the opposite corner
		// rule 2: prevent little l by taking corner between the two side mids
		if ((board[0][0] == op || (board[1][2] == op && board[2][1] == op)) && board[2][2] == ' ') {
			takeTurn(2, 2);
			return;
		}
		if ((board[0][2] == op || (board[1][0] == op && board[2][1] == op)) && board[2][0] == ' ') {
			takeTurn(2, 0);
			return;
		}
		if ((board[2][0] == op || (board[0][1] == op && board[1][2] == op)) && board[0][2] == ' ') {
			takeTurn(0, 2);
			return;
		}
		if ((board[2][2] == op || (board[1][0] == op && board[0][1] == op)) && board[0][0] == ' ') {
			takeTurn(0, 0);
			return;
		}

		// corners + mid (anti big triangle)
		if ((board[0][0] == op || board[2][2] == op) && board[1][1] == op) {
			if (board[0][2] == ' ') {
				takeTurn(0, 2);
				return;
			}
			if (board[2][0] == ' ') {
				takeTurn(2, 0);
				return;
			}
		}
		if ((board[0][2] == op || board[2][0] == op) && board[1][1] == op) {
			if (board[0][0] == ' ') {
				takeTurn(0, 0);
				return;
			}
			if (board[2][2] == ' ') {
				takeTurn(2, 2);
				return;
			}
		}
	}

	if (difficulty == 2 || difficulty == 3 || difficulty == 4) {
		// medium AI
		while (true) {
			let row = Math.floor(Math.random() * 3);
			let col = Math.floor(Math.random() * 3);
			if (board[row][col] == ' ') {
				takeTurn(row, col);
				return;
			}
		}
	}

	if (difficulty == 1) {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] == ' ') {
					takeTurn(i, j);
					return;
				}
			}
		}
	}
}

function reset() {
	userWarning = false;
	board = [
		[' ', ' ', ' '],
		[' ', ' ', ' '],
		[' ', ' ', ' ']
	];
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			txt(bigSpace, gridRow + i * 8, gridCol + j * 9);
		}
	}
	turnNum = 1;
}

function startGame() {
	eraseRect(10, 56, 1, 16);
	for (let row = 0; row < 3; row++) {
		for (let col = 0; col < 3; col++) {
			button(bigSpace, gridRow + row * 8, gridCol + col * 9, () => {
				takeTurn(row, col);
			});
		}
	}

	randomStart();
}

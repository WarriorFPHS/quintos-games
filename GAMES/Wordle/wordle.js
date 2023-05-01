let dictionary = [];
let words = [];
let board;
let guesses = [];
let wordle;
let alphabet;

async function loadGame() {
	/* load the text files*/
	let filePath = QuintOS.dir + '/words5.txt';
	let data = await fetch(filePath);
	let wordslist = await data.text();
	words = wordslist.split('\r\n');
	log(words);

	let filePathDict = QuintOS.dir + '/dictionary5.txt';
	let dataDict = await fetch(filePathDict);
	let dictList = await dataDict.text();
	let lines = dictList.split('\r\n');

	for (let line of lines) {
		let lnWords = line.split(' ');
		for (let word of lnWords) {
			dictionary.push(word);
		}
	}

	log(dictionary);

	startGame();
}

loadGame();

/* Display all the boxes for the letters */

function displayBoxes() {
	for (let row = 0; row < 6; row++) {
		let guess = guesses[row];
		for (let col = 0; col < 5; col++) {
			if (guess) {
				// display the letter
				txt(guess[col], row * 3 + 3, col * 3 + 3);

				// check if the letter is correct or in the word or not
				if (guess[col] == wordle[col]) {
					textRect(row * 3 + 2, col * 3 + 2, 3, 3, 'dashed');
				} else if (wordle.includes(guess[col])) {
					textRect(row * 3 + 2, col * 3 + 2, 3, 3, 'outline');
				} else {
					alphabet = alphabet.replace(guess[col], ' ');
					textRect(row * 3 + 2, col * 3 + 2, 3, 3);
				}
			} else {
				textRect(row * 3 + 2, col * 3 + 2, 3, 3);
			}
		}
	}
}

function displayInfo() {
	let row = 10;
	textRect(row, 20, 3, 3, 'solid');
	txt('letter is not found in word', row, 24);
	row += 3;
	textRect(row, 20, 3, 3, 'outline');
	txt('letter is in the word', row, 24);
	row += 3;
	textRect(row, 20, 3, 3, 'dashed');
	txt('letter is in the correct position', row, 24, 14);
}

async function startGame() {
	alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	guesses = [];
	/* pick new word */
	let num = Math.floor(Math.random() * words.length);
	wordle = words[num];

	let guess;
	while (true) {
		erase();
		displayBoxes();
		txt(alphabet, 21, 2);
		if (guess == wordle) {
			await alert('You won!', 3, 18, 20);
			startGame();
			return;
		}
		if (guesses.length == 6) {
			await alert('You lost.', 3, 18, 20);
			startGame();
			return;
		}
		displayInfo();
		guess = await prompt('Guess the word!', 3, 18, 20);
		guess = guess.toUpperCase();
		if (guess.length > 5) {
			await alert('Sorry, that answer is too long.', 3, 18, 20);
		}
		if (guess.length < 5) {
			await alert('Sorry, that answer is too short.', 3, 18, 20);
		}
		if (dictionary.includes(guess) == false) {
			await alert("Sorry, that's not a word.", 3, 18, 20);
		}

		guesses.push(guess);
	}
}

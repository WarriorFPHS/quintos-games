/* Make an array of phrases, pick a random phrase, and split pharse into an array of words */
let score = 0;
let stopAddingLetters;
let phrases;
let phrase;
let words;
let le;
let count;

async function setupGame() {
	let filePath = QuintOS.dir + '/phrases.txt';
	let data = await fetch(filePath);
	let phrasesList = await data.txt();
	phrases = phrasesList.split('\r\n');
	newGame();
}
setupGame();

async function newGame() {
	await eraseRect(1, 1, 38, 13);
	stopAddingLetters = false;
	let num = Math.floor(Math.random() * phrases.length);
	log(phrases);
	phrase = phrases[num];
	phrases.splice(num, 1);
	log(phrases);
	words = phrase.split(' ');
	log(phrase);
	le = phrase.length - words.length;
	count = 0;
	displayBoxes();
	addLetter();
}

/* Display all the boxes for the phrase */
function displayBoxes() {
	for (let i = 0; i < words.length; i++) {
		let word = words[i];
		for (let j = 0; j < word.length; j++) {
			textRect(i * 4 + 2, j * 3 + 2, 3, 3);
		}
	}
}

/* Add a letter to a random empty box */
async function addLetter() {
	let letter = ' ';
	let i;
	let j;

	log(count);
	log(le);
	// test to see if the letter chooosen is a space
	while (letter == ' ') {
		i = Math.floor(Math.random() * words.length);
		j = Math.floor(Math.random() * words[i].length);
		letter = words[i][j];
	}
	log(letter, j);
	txt(letter, i * 4 + 3, j * 3 + 3);

	// replace letter with a space in the array of words (in the phrase)
	let word = words[i];
	words[i] = word.slice(0, j) + ' ' + word.slice(j + 1);
	log(words);

	count++;
	if (count > le) {
		await alert('Too slow!', 18, 2);
		score = score - 3;
		return;
	}
	await delay(1000);
	if (stopAddingLetters == true) {
		return;
	}
	addLetter();
}

txt('Score:' + score, 14, 2);
let bigBuzzer = `
|⎺|__  _   _ ___________ _ __
| '_ \\| | | |_  /_  / _ \\ '__|
| |_) | |_| |/ / / /  __/ |
|_.__/ \\__,_/___/___\\___|_|`.slice(1);

async function buzz() {
	stopAddingLetters = true;
	let answer = await prompt('Guess the phrase', 18, 2);
	if (answer.toLowerCase() == phrase.toLowerCase()) {
		await alert('You got it!', 18, 2);

		score = score + (le - count);
		txt('Score:' + score + '      ', 14, 2);
		newGame();
	} else {
		score = score - 1;
		txt('Score:' + score + '      ', 14, 2);
		stopAddingLetters = false;
		addLetter();
	}

	button(bigBuzzer, 18, 5, buzz);
}

/* Create the buzzer button */
button(bigBuzzer, 18, 5, buzz);

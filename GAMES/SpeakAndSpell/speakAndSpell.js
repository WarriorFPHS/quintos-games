let inp, word;
let wrongTries = 0;
let score = 0;
let wordsDone = 0;
// value is the text the user entered in the input
async function onSubmit(value) {
	if (value == word) {
		wrongTries = 0;
		score++;
		wordsDone++;
		if (wordsDone >= 10) {
			erase();
			text(score + '/10', 0, 0);
			await play(speechSounds['here_is_your_score']);

			// eight of ten
			let nums = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
			await play(wordSounds[nums[score]]);
			await play(wordSounds['of']);
			await play(wordSounds['ten']);

			if (score >= 10) {
				await play(speechSounds['perfect_score']);
			}
			await alert(score + '/10', 0, 0);
			return;
		}

		let opt = Math.random() * 6;
		opt = Math.ceil(opt);
		if (opt == 1) {
			await play(speechSounds['that_is_correct_now_spell']);
		}
		if (opt == 2) {
			await play(speechSounds['that_is_right_now_try']);
		}
		if (opt == 3) {
			await play(speechSounds['you_are_correct_next_spell']);
		}
		if (opt == 4) {
			await play(speechSounds['you_are_right_try']);
		}
		if (opt == 5) {
			await play(speechSounds['you_are_correct']);
			await play(speechSounds['spell']);
		}
		if (opt == 6) {
			await play(speechSounds['you_are_correct']);
			await play(speechSounds['now_spell']);
		}

		nextWord();
	} else {
		if (wrongTries == 0) {
			await play(speechSounds['wrong_try_again']);
			wrongTries++;
		} else {
			await play(speechSounds['that_is_incorrect_the_correct_spelling_of']);
			await play(wordSounds[word]);
			await play(speechSounds['is']);
			wordsDone++;

			erase();
			text(word, 0, 0);

			let spelling = word.toUpperCase().split('');
			for (let letter of spelling) {
				log(letter);
				await play(letterSounds[letter]);
			}
			await play(speechSounds['now_spell']);
			wrongTries = 0;
			nextWord();
		}
	}
}

// called everytime the user enters text in the input
function onChange(value) {
	value = value.toUpperCase();
	// abc
	let letter = value[value.length - 1];
	letterSounds[letter].play(); // example plays letter A sound
}

async function nextWord() {
	await erase(); // erase the screen
	if (mode == 'a') {
		let idx = Math.floor(Math.random() * words.length);
		word = words.splice(idx, 1);
	}
	if (mode == 'b') {
		let idx = Math.floor(Math.random() * longWords.length);
		word = longWords.splice(idx, 1);
	}
	wordSounds[word].play();

	// create the input for letters
	inp = input('', 0, 0, onSubmit, onChange);
}

async function startGame() {
	await alert('Press enter to start');
	// TODO: add prompt
	mode = 'b';
	await play(speechSounds.spell);
	nextWord();
}

startGame();

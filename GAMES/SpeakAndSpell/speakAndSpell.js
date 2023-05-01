function preload() {
	// words that are easier to spell
	words =
		'I cool know over these about down large please they after drink learn put think again each little red this ago everything live right those all face location run three also far make same to always fast man sea together am father many seven try an find may shop turn and first meaning sit under any five men six until are fly mother sleep us as foot much small use from must smile want ask give never some we at go no sorry well away green not star what because has now stay when bed here ocean stop where black his of store which blue how old strong why bring in on tell will call into one thank with clean is only that yellow cold it or the yes color just our you come kind out there'.split(
			' '
		);

	// words that are harder to spell
	longWords =
		"above coming hoof pleasure sugar abscess correct hooves plunger summers already corsage houses plural sure ancient couldn't inch poem surgeon angel county's inches poems swap another couple insects poets talk answer courage instead police ten anything cousin iron ponies terror armies danger jealous pony thief's army diamond journey potato thieves' ax diamonds lady's potatoes three axes discover language poultry to baby's does laugh priest today beach dollar laughter priests tomorrow beaches dollars learn promise touch beauty dungeon leisure pull treasure beige early lettuce puppies trouble believe earnest life puppy trucks bench earth lilies quiet two benches echo lily quotient typists blood eight linger rabbis uncles boss elf lives range union bosses elves loss ranger valley brother enough losses ready valleys built extra machine reindeer view bullet farmers man's relief village bureau feather measure remove villages bushel finger men's rhythm warm butcher five mercies rural was calf flood mercy says wash camel floor mice's scarf watch camels for minute scarves water canaries four mirror schedule welcome canary freight mother school wife candies front mouse's scissors winters candy glass navy's search witches canoe glasses niece serious wives canoes glories nine seven wolf's caravan glory ocean shield wolves carry greater oceans should woman's chalk guard once shoulder woman cheese guess one shovel women's cheeses guide other six wonder child gypsies outdoor ski word chimney half oven someone workman chimneys harbors ox's source worth chorus haste oxen's squad wrong choruses health period squat yacht circuit healthy pierce statue yield cities heaven pint stomach zero comfort heavy plague stranger".split(
			' '
		);

	/* Part B1: Load all the word sounds */

	let speech = [
		'as_in',
		'here_is_your_score',
		'i_win',
		'is',
		'now_spell',
		'perfect_score',
		'plural_possessive',
		'say_it',
		'singular_possessive',
		'spell',
		'that_is_correct_now_spell',
		'that_is_incorrect_the_correct_spelling_of',
		'that_is_right_now_try',
		'the_number',
		'wrong_try_again',
		'you_are_correct',
		'you_are_correct_next_spell',
		'you_are_right_try',
		'you_win'
	];

	let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	/* Part A0: Load all the letter sounds and apostrophe */
	letterSounds = {};

	for (let letter of letters) {
		let fileLoc = '/sounds/letters/' + letter + '.mp3';
		letterSounds[letter] = loadSound(QuintOS.dir + fileLoc);
		letterSounds[letter].setVolume(0.3);
	}

	log(letterSounds);

	/* Load all word sounds */
	wordSounds = {};
	for (let word of words) {
		let fileLoc = '/sounds/words/' + word + '.mp3';
		wordSounds[word] = loadSound(QuintOS.dir + fileLoc);
		wordSounds[word].setVolume(0.3);
	}
	for (let word of longWords) {
		let fileLoc = '/sounds/words/' + word + '.mp3';
		wordSounds[word] = loadSound(QuintOS.dir + fileLoc);
		wordSounds[word].setVolume(0.3);
	}

	/* Part B0: Load all the speech sounds */
	speechSounds = {};
	for (let speak of speech) {
		let fileLoc = '/sounds/speech/' + speak + '.mp3';
		speechSounds[speak] = loadSound(QuintOS.dir + fileLoc);
		speechSounds[speak].setVolume(0.3);
	}
}
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
			txt(score + '/10', 0, 0);
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
			txt(word, 0, 0);

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

async function start() {
	await alert('Press enter to start');
	// TODO: add prompt
	mode = 'b';
	await play(speechSounds.spell);
	nextWord();
}

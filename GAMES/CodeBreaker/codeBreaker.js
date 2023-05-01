let alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

async function start() {
	let textFilePrompt = await prompt('Would you like to load a text file? Yes or no?');
	let msg;
	let shifted;
	let response = textFilePrompt.toUpperCase();

	if (response == 'YES') {
		while (!msg) {
			let textName = await prompt("What's the name of the text file?");
			let filePath = QuintOS.dir + '/' + textName + '.txt';

			let data = await fetch(filePath);
			if (data.status == 404) {
				await alert('File not found! Did you make a typo?');
			} else {
				msg = await data.text();
			}
		}
	} else {
		msg = await prompt('What would you like to encode/decode?');
	}
	msg = msg.toUpperCase();

	let knowsShifted = await prompt('Do you know the shift key?');
	if (typeof knowsShifted == 'number') {
		shifted = knowsShifted;
		knowsShifted = 'YES';
	} else {
		knowsShifted = knowsShifted.toUpperCase();
	}
	if (knowsShifted == 'YES') {
		if (!shifted) {
			shifted = await prompt('How much would you like to shift your message?');
		}

		log(shifted);
		if (typeof shifted == 'string') {
			for (let i = 0; i < alpha.length; i++) {
				if (shifted.toUpperCase() == alpha[i]) {
					shifted = i;
					break;
				}
			}
		}
		txt(decodeCaesarCipher(msg, shifted));
	} else {
		await alert('We will decode the message for you.');
		for (let i = 1; i < 26; i++) {
			button(decodeCaesarCipher(msg.slice(0, 72) + '...', i), i + 1, 2, () => {
				erase();
				txt(decodeCaesarCipher(msg, i), 2);
			});
		}
	}
}

function decodeCaesarCipher(msg, shifted) {
	let secret = '';

	for (let i = 0; i < msg.length; i++) {
		let character = msg[i];
		let pos = -1;

		for (let j = 0; j < alpha.length; j++) {
			if (character == alpha[j]) {
				pos = j;
				log(character + ' ' + pos);
				break;
			}
		}
		if (pos == -1) {
			secret += character;
		} else {
			if (pos + shifted > 25) {
				pos = pos + shifted - 26;
				secret += alpha[pos];
			} else if (pos + shifted < 0) {
				pos = pos + shifted + 26;
				secret += alpha[pos];
			} else {
				secret += alpha[pos + shifted];
			}
		}
	}
	return secret;
}

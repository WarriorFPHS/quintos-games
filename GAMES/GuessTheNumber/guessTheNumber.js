// start of wrapper (I will explain how this works later)
(async () => {
	// your code goes here! below this line
	let res = 'yes';
	while (res == 'yes' || res == 'Yes' || res == 'YES') {
		let num = Math.random() * 100;
		num = Math.floor(num) + 1;
		let guess;

		for (let attempts = 0; num != guess; attempts++) {
			if (attempts == 7) {
				await alert('You ran out of guesses.');
				break;
			}
			guess = await prompt('Guess a Number 1-100.');
			if (guess > 100 || guess < 0) {
				attempts--;
				await alert('Invalid guess.');
			} else if (guess < num) {
				await alert('Your guess was too low!');
			} else if (guess > num) {
				await alert('Your guess was too high!');
			} else {
				await alert('You got it!');
			}
		}
		res = await prompt('Play again?');
	}
	exit();
	// this function exits the game
})(); // end

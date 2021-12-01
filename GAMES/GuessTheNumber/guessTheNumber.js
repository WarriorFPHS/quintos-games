// start of wrapper (I will explain how this works later)
(async () => {
	// your code goes here! below this line
	let num = Math.random() * 100;
	num = Math.floor(num) + 1;
	let guess; 
	while (num != guess) {
	  guess = await prompt("Guess a Number 1-100.")
		if (guess == num) {
		await alert("You got it!");
	  }
	  if (guess < num) {
		await alert("Your guess was too low!");
	  }
	  if (guess > num) {
		await alert("Your guess was too high!");
	  }
	}
	exit(); // this function exits the game
})(); // end

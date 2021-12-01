// start of wrapper (I will explain how this works later)
(async () => {
	// your code goes here! below this line

	let choice = -1; // initialize choice to -1, user has not made any choice yet

	while (choice != null) {
		// while choice is not null (nothing)
		// null in this case indicates the player cancelled out of the prompt

		let msg = ''; // initialize message to empty string
		let opt = [];

		if (choice == -1) {
			/* PART A0: Start your story! */

			msg =
				"It's a dark October night. You're staying up late coding but suddenly you hear a knock at your door!\n\n\t" +
				'1: Ask "Who is it?"\n\t' +
				'2: Ignore it and keep coding\n\t' +
				'3: Try to go to sleep';
			opt = [1, 2, 3];
		} else if (choice == 1) {
			/* PART A1: continue the story */
			msg =
				'The mysterious person behind the door replies, "Your worst nightmare"\n\n\t' +
				'4: Run away through the back door!\n\t' +
				'5: Smirk and say "I doubt that"';
			opt = [4, 5];
		} else if (choice == 2 || choice == 3) {
			msg =
				'The person behind the door waits, and then asks in a little girl voice, "Can you open the door for me?"\n\n\t' +
				'6: Run away through the back door!\n\t' +
				'7: Remain silent.\n\t' +
				'8: Open the door for the person.';
			opt = [6, 7, 8];
		} else if (choice == 5) {
			msg =
				'The mysterious person begins to laugh uncontrollably in a mad way.\n\n\t' +
				'12: Say "Stop this prank Ryan, I know it is you behind this"\n\t' +
				'13: Call the police\n\t' +
				'14: Run away through the back door!';
			opt = [12, 13, 14];
		} else if (choice == 4 || choice == 6 || choice == 14) {
			msg =
				"The figure hears you and starts to give chase, what's your next move? \n\n\t" +
				'9: RUN AS FAST AS YOU PHYSICALLY CAN!\n\t' +
				'10: Stop moving and face the figure.\n\t' +
				'11: Turn around and try to fight it.';
			opt = [9, 10, 11];
		} else if (choice == 7) {
			msg =
				"I know you're there.\n\n\t" +
				'15: Remain silent.\n\t' +
				'16: Call the police\n\t' +
				'17: Say "Stop this prank Ryan, I know it is you behind this"\n\t';
			opt = [15, 16, 17];
		} else if (choice == 8) {
			msg = '"HAHA YOU GOT PRANKED", says Ryan\n\t' + 'The End';
		} else if (choice == 9) {
			msg =
				'The figure yells, "HEY WAIT UP ITS ME RYAN SLOW DOWN!"\n\n\t' + '18: KEEP RUNNING!\n\t' + '19: Stop running.';
			opt = [18, 19];
		} else if (choice == 10) {
			msg = '"Haha did i get you with the prank?", your friend Ryan says.\n\t' + 'The End.';
		} else if (choice == 11) {
			msg = 'You punch the figure. It says, "Calm down it was just a prank man"\n\t' + 'The End';
		} else if (choice == 12 || choice == 17) {
			msg = 'The figure behind the door throws down his mask and says "DAMMIT HOW DID YOU KNOW?"\n\t' + 'The End';
		} else if (choice == 13 || choice == 16) {
			msg =
				'You call the police. You tell them what has happened, but in the middle of your explanation the figure yells, "ARE YOU CALLING THE POLICE THIS IS A PRANK BRO" You sigh and hang up the call.\n\t' +
				'The End';
		} else if (choice == 15) {
			msg = '*Sighs* DAMN ARE YOU REALLY NOT THERE, UGH IM GONNA COME BACK LATER \n\n\t' + 'The End';
		} else if (choice == 18) {
			msg = 'You run away all the way until the police station, and file a report.\n\n\t' + 'The End';
		} else if (choice == 19) {
			msg = "The figure catches up with you, and unmasks himself. It's your friend Ryan!\n\n\t" + 'The End';
		}

		/* PART B0: end the game if there are no more choices to make */

		if (opt.length == 0) {
			await alert(msg);
			break;
		}
		// prompt the player to make choices
		let input = await prompt(msg);

		/* PART B1: check if the player made a valid choice, reject invalid choices */
		if (opt.includes(input)) {
			choice = input;
		} else {
			await alert('Oops! Invalid choice! Try again.');
		}
	}

	exit(); // exits the game
})(); // end wrapper

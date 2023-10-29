// example film table
let tableHeader = `
| id | film title                      |
|====|=================================|`;

let allFilms;
let members;

async function start() {
	let filePath = QuintOS.dir + '/films.json';
	let data = await fetch(filePath);
	allFilms = await data.json();

	let filePath2 = QuintOS.dir + '/members.json';
	let data2 = await fetch(filePath2);
	members = await data2.json();
	log(members);

	mainMenu();
}

async function displayFilmInfo() {
	let id = await prompt('What is the id of the film?', 17, 0, 40);
	let film = findFilm(id);
	if (film.description.length > 40)
		txt(
			film.title +
				'\n' +
				'id:' +
				film.id +
				'\n\n' +
				film.genre +
				'\n' +
				'rating:' +
				film.rating +
				'\n\n' +
				film.description,
			2,
			2
		);
	await alert('Press enter to go back.');
	erase();
}
async function mainMenu() {
	let response = await prompt('Would you like to 0: view member, 1: view film, or 2: exit?', 18, 0, 40);
	if (response == 0) {
		let member;
		while (!member) {
			let mID = await prompt('Provide the member ID below.', 18, 0, 40);
			member = findMember(mID);
			log(member);
			if (!member) {
				await alert("Couldn't locate member, try again.", 18, 0, 40);
			}
		}
		displayMember(member);
	} else if (response == 1) {
		await displayFilmInfo();
		mainMenu();
	} else {
		exit();
	}
}

async function displayFilms(films) {
	let table = tableHeader;
	for (let film of films) {
		table += '| ' + film.id;

		if (film.title.length < 32) {
			table += ' | ' + film.title.padEnd(32, ' ') + '|\n';
		} else {
			table += ' | ' + film.title.slice(0, 28) + '... |\n';
		}
	}

	txt(table, 2, 0);
}

function findMember(mID) {
	for (let member of members) {
		if (member.id == mID) {
			return member;
		}
	}
}

function findFilm(filmID) {
	for (let film of allFilms) {
		if (filmID == film.id) {
			return film;
		}
	}
	return false;
}

async function displayMember(member) {
	let rentedFilms = [];
	for (let rentedID of member.rented) {
		rentedFilms.push(findFilm(rentedID));
	}

	displayFilms(rentedFilms);

	let response = await prompt(
		'What would you like to do? 1: Go back to main menu. 2: View film info. 3: Rent a film. 4: Return film.',
		17,
		0,
		40
	);
	if (response == 1) {
		erase();
		start();
		return;
	}
	if (response == 2) {
		erase();
		await displayFilmInfo();
	}
	if (response == 3) {
		rent_a_film = await prompt("What's the id of the film you would like to rent?", 17, 0, 40);
		if (findFilm(rent_a_film) == false) {
			await alert('invalid film id', 17);
		} else {
			member.rented.push(rent_a_film);
			await alert('Your film has been rented', 17, 0, 40);
		}
	}
	if (response == 4) {
		return_filmID = await prompt('What is the id of the film you will return?', 17, 0, 40);
		for (let i = 0; i < member.rented.length; i++) {
			if (member.rented[i] == return_filmID) {
				member.rented.splice(i, 1);
				break;
			}
		}
	}
	erase();
	displayMember(member);
}

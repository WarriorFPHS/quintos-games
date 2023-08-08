// example film table
let table = `
| id | film title                      |
|====|=================================|`;

let table2 = `
| id | film title                      |
|====|=================================|`;

let films;
let members;

async function start() {
	let filePath = QuintOS.dir + '/films.json';
	let data = await fetch(filePath);
	films = await data.json();

	let filePath2 = QuintOS.dir + '/members.json';
	let data2 = await fetch(filePath2);
	members = await data2.json();
	log(members);

	mainMenu();
}

async function mainMenu() {
	let response = await prompt('Would you like to 0: view member, 1: view film, or 2: exit?', 18, 0, 40);
	if (response == 0) {
		let mID = await prompt('Provide the member ID below.', 18, 0, 40);
		let member = findMember(mID);
		log(member);
		// TODO if not found
		displayMember(member);
	} else if (response == 1) {
		displayFilms();
	} else {
		exit();
	}
}

async function displayFilms() {
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

async function displayMember(member) {
	for (let rent of films) {
		if (rent.id == film.id) {
			rent = film.title;
		}
	}

	txt(member.id + '           ' + member.name, 2, 0);
	table2 += '| ' + member.rented;
	if (film.title.length < 32) {
		table += ' | ' + film.title.padEnd(32, ' ') + '|\n';
	} else {
		table += ' | ' + film.title.slice(0, 28) + '... |\n';
	}

	table2 += txt('Rented:' + '\n' + table2, 4, 0);

	let response = await prompt(
		'What would you like to do? 1: Go back to main menu. 2: View film info. 3: Rent a film. 4: Return film.',
		18,
		0,
		40
	);
}

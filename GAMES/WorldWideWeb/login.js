function getFormData(formID) {
	let fd = new FormData(document.getElementById(formID));
	let data = {};
	for (var entry of fd.entries()) {
		data[entry[0]] = entry[1];
	}
	return data;
}

async function checkForm() {
	let data = getFormData('register');
	console.log(data);
}

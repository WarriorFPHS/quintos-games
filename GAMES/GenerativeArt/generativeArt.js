let time = 0;
let peice = 4;

function draw() {
	background('b');
	stroke('w');
	strokeWeight(1);
	translate(width / 2, height / 2);

	for (let i = 0; i < 10; i++) {
		if (key != ' ') {
			line(eqX(time - i), eqY(time - i), eqX2(time - i), eqY2(time - i));
		} else {
			point(eqX(time - i), eqY(time - i));
			point(eqX2(time - i), eqY2(time - i));
		}
	}

	time++;
}

function keyPressed() {
	peice = key;
}

function eqX(t) {
	if (peice == 0) return cos(t * 8) * 47;
	if (peice == 1) return cos(t * 8) * 470;
	if (peice == 2) return cos(t * 4) * 254;
	if (peice == 3) return cos(t * 5) * 240;
	if (peice == 4) return cos(t * 5) * mouseX;
}

function eqY(t) {
	if (peice == 0) return sin(t * 5) * 72;
	if (peice == 1) return sin(t * 5) * 72;
	if (peice == 2) return cos(t * 4) * 254;
	if (peice == 3) return cos(t * 6) * 222;
	if (peice == 4) return cos(t * 5) * 240;
}
function eqX2(t) {
	if (peice == 0) return cos(t * 3) * 254;
	if (peice == 1) return cos(t * 3) * 254 + cos(t * 2) * 20;
	if (peice == 2) return cos(t * 4) * 254;
	if (peice == 3) return cos(t * 9) * 143;
	if (peice == 4) return cos(t * 5) * mouseY;
}
function eqY2(t) {
	if (peice == 0 || peice == 1) return sin(t * 9) * 273;
	if (peice == 2) return sin(t * 7) * 232;
	if (peice == 3) return sin(t * 10) * 248;
	if (peice == 4) return sin(t * 5) * 240;
}

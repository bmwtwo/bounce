// record position and velocity
var rightVel = 0;
var downVel = 0;
var rightPos = 50;
var downPos = 50;
// record which keyboard keys are currently pressed
var leftDown = false;
var rightDown = false;
var downDown = false;
var upDown = false;


G = 0.1;            // gravitational constant
damping = 0.01;     // how quickly the particles slow down
particleMass = 0.1; //relative to player

k = 0.0005;         // constant for electrical repulsion between particles

function tick() {
	setTimeout("tick()", 25);

	movePlayer();
	applyForces();
}

function movePlayer() {
	if (rightVel > 1.5)
		rightVel = 1.5;
	if (rightVel < -1.5)
		rightVel = -1.5;
	if (downVel > 1.5)
		downVel = 1.5;
	if (downVel < -1.5)
		downVel = -1.5;

	rightPos += rightVel;
	downPos += downVel;

	if (rightPos > 100) {
		rightPos = 200 - rightPos;
		rightVel *= -1;
	}
	if (downPos > 100) {
		downPos = 200 - downPos;
		downVel *= -1;
	}
	if (rightPos < 0) {
		rightPos = 0 - rightPos;
		rightVel *= -1;
	}
	if (downPos < 0) {
		downPos = 0 - downPos;
		downVel *= -1;
	}

	$('#player').css({'top': downPos + "%", 'left': rightPos + "%"});

	if (leftDown)
		rightVel -= 0.05;
	if (rightDown)
		rightVel += 0.05;
	if (upDown)
		downVel -= 0.05;
	if (downDown)
		downVel += 0.05;
}

function applyForces() {
   // note: forces are applied to particles, but are assumed not to affect the
   // player
	
	var particles = $('.particle');
	particles.each(function() {
		pRightPos = parseFloat($(this).attr('rPos'));
		pDownPos = parseFloat($(this).attr('dPos'));
		pRightVel = parseFloat($(this).attr('rVel'));
		pDownVel = parseFloat($(this).attr('dVel'));

      // apply gravity
		var denominator = (Math.abs(rightPos - pRightPos))^3;
      // check if denominator is 0, which would result in infinite acceleration
		if (denominator != 0)
			pRightVel += G * particleMass * (rightPos - pRightPos) / denominator;
		denominator = (Math.abs(downPos - pDownPos))^3;
		if (denominator != 0)
			pDownVel += G * particleMass * (downPos - pDownPos)/ denominator;

      // apply repulsion
		applyRepulsion($(this));

		pRightPos += pRightVel;
		pDownPos  += pDownVel;

		$(this).css({'top': pDownPos + "%", 'left': pRightPos + "%"});

		// apply damping
		pRightVel -= damping * pRightVel;
		pDownVel  -= damping * pDownVel;

		$(this).attr('rPos', pRightPos);
		$(this).attr('dPos', pDownPos);
		$(this).attr('rVel', pRightVel);
		$(this).attr('dVel', pDownVel);
	});
}

function applyRepulsion(particle) {
	var others = $('.particle');
	others.each(function() {
		oRightPos = parseFloat($(this).attr('rPos'));
		oDownPos = parseFloat($(this).attr('dPos'));
		tRightPos = parseFloat(particle.attr('rPos'));
		tDownPos = parseFloat(particle.attr('dPos'));

		denominator = (Math.abs(tRightPos - oRightPos))^3;
		if (denominator != 0) {
			pRightVel += k * (tRightPos - oRightPos) / denominator;
		}
		denominator = (Math.abs(tDownPos - oDownPos))^3;
		if (denominator != 0)
			pDownVel += k * (tDownPos - oDownPos)/ denominator;
	});
}

$(document).ready(function() {

	$('h1').fadeOut(5000); // fade out instructions
	tick();                // start game loop

   // check for control keystrokes
	$('body').keydown(function(e) {
		switch (e['keyCode']) {
			case 78: // spawn a new particle
				$(this).html($(this).html() + '<div class="particle" style="left:50%; top:50%" rVel="0" dVel="0" rPos="50" dPos="50" ></div>');
				$('h1').hide();
				break;
			case 65:
				rightVel -= 0.1;
				leftDown = true;
				break;
			case 68:
				rightVel += 0.1;
				rightDown = true;
				break;
			case 87:
				downVel -= 0.1;
				upDown = true;
				break;
			case 83:
				downVel += 0.1;
				downDown = true;
				break;
		}
	}).keyup(function(e) {
		switch (e['keyCode']) {
			case 65:
				leftDown = false;
				break;
			case 68:
				rightDown = false;
				break;
			case 87:
				upDown = false;
				break;
			case 83:
				downDown = false;
				break;
		}
	});
});

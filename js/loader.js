/*
loader.js
variable 'app' is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the game will be properties of app.
*/
"use strict";

// If app exists use the existing copy, otherwise create a new object literal.
var app = app || {};

//CONSTANTS
app.KEYBOARD = {
	"KEY_ESC": 27,
	
	"KEY_W": 87,
	"KEY_A": 65,
	"KEY_S": 83,
	"KEY_D": 68,
	"KEY_E": 69,
	"KEY_Q": 81,
};


// Loading images.
app.IMAGES = {
	chainSegment: "images/ChainUISegment.png",
	mattock: "images/PickupMattock.png",
	prisoner1: "images/Prisoner1.png",
	prisoner2: "images/Prisoner2.png",
	prisoner3: "images/Prisoner3.png",
	prisoner4: "images/Prisoner4.png",
	reticleArrows: "images/ReticleArrows.png",
	reticleCircle: "images/ReticleCircle.png",
	hat: "images/Hat.png",
	explosion1: "images/Explosion1.png",
	explosion2: "images/Explosion2.png",
	explosion3: "images/Explosion3.png",
	explosion4: "images/Explosion4.png",
	//instructions: "images/instructions.png",
};


//app.keydown array to keep track of which keys are down
//this is called a "key daemon"
//Mortar_Maneuvers.js will "poll" this array every frame
//this works because js has "sparse arrays" - not every language does
app.keydown = [];
app.keypress = [];

app.mouse = {
	x:0,
	y:0,
	clicked: false,
};

window.onload = function(){
	app.Mortar_Maneuvers.app = app;
	app.Mortar_Maneuvers.Prisoner = app.prisoner;
	//app.Mortar_Maneuvers.utilities = app.utilities;
	
	
	//Preloads images and sounds
	app.queue = new createjs.LoadQueue(false);
	//app.queue.installPlugin(createjs.Sound);
	/*app.queue.on("complete", function()
	{
		app.Mortar_Maneuvers.init();
	});
	*/
	// Loads the image files
	app.queue.loadManifest(
	[
		//{id: "instructions", src: "images/instructions.png"},
		{id: "chainSegment", src:"images/ChainUISegment.png"},
		{id: "mattock", src: "images/PickupMattock.png"},
		{id: "prisoner1", src: "images/Prisoner1.png"},
		{id: "prisoner2", src: "images/Prisoner2.png"},
		{id: "prisoner3", src: "images/Prisoner3.png"},
		{id: "prisoner4", src: "images/Prisoner4.png"},
		{id: "reticleArrows", src: "images/ReticleArrows.png"},
		{id: "reticleCircle" , src: "images/ReticleCircle.png"},
		{id: "hat", src: "images/Hat.png"},
		{id: "explosion1", src: "images/Explosion1.png"},
		{id: "explosion2", src: "images/Explosion2.png"},
		{id: "explosion3", src: "images/Explosion3.png"},
		{id: "explosion4", src: "images/Explosion4.png"},
	]);
	
	app.Mortar_Maneuvers.init();
}


/*
	Keypress event listeners originally created for:
		Friendly Fire
		Game Design and Development 2
		10/3/2014
		
		Alex Fuerst, 
		Mario Chuman,
		David Erbelding,
		Brian Nugent,
		Ryan Farrell,


	Adapted for use in:
		Mortar Maneuvers
		Casual Games Development
		2/15/2015
		
		Brian Nugent,
		Ryan Farrell,
		Clifton Rice
*/
window.addEventListener("keydown", function(e) {
	if(!app.keypress[e.keyCode] && !app.keydown[e.keyCode]) {
		app.keypress[e.keyCode] = true;
	}
	app.keydown[e.keyCode] = true;
});

window.addEventListener("keyup", function(e) {
	app.keydown[e.keyCode] = false;
});



// Mouse events listeners
window.addEventListener("mousemove", function(e){
	app.mouse.x = e.pageX - e.target.offsetLeft;
	app.mouse.y = e.pageY - e.target.offsetTop;
});
	
window.addEventListener("mousedown", function(e) {
	app.mouse.clicked = true;
});
window.addEventListener("mouseup", function(e) {
	app.mouse.clicked = false;
});
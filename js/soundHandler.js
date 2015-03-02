/*
	Created originally for:
		cyber_fighter.exe
		
		Brian Nugent,
		Ryan Farrell

		Rich Web Media Development
		
	Adapted for use in:
		Mortar Maneuvers
		
		Brian Nugent,
		Ryan Farrell,
		Clifton Rice

		Casual Games Development
		2/15/2015
*/


//SoundHandler.js is the "class" for our sound handling "objects"

"use strict";

//Create the global app object if needed
var app = app || {};

// This is the "IIFE"/Class for the Vector
app.SoundHandler = function() {
	//constructor for the vector class
	function SoundHandler() {
		//Background music
		this.backgroundMusic = new Audio('audio/background.mp3');// source: freeplaymusic.com
		this.backgroundMusic.volume = 0.2;
		this.backgroundMusic.loop = true;
	
		//Pickaxe sound
		this.pickaxeSound = new Audio('audio/pickaxe.mp3');  // Source: soundbible.com
		this.pickaxeSound.volume = 0.1;
		
		//Mortar sounds
		this.explosionSound = new Audio('audio/explosion.mp3');  // Source: soundbible.com
		this.explosionSound.volume = 0.1;
		this.mortarSound = new Audio('audio/mortar.mp3');  // Source: soundbible.com
		this.mortarSound.volume = 0.02;
	};
	
	var s = SoundHandler.prototype;
	
	//Play the background music.
	s.backgroundMusicPlay = function() {
		this.backgroundMusic.play();
	};
	//Pause the background music.
	s.backgroundMusicPause = function() {
		this.backgroundMusic.pause();
	};
	
	//Play the pickaxe sound.
	s.pickaxeSoundPlay = function() {
		this.pickaxeSound.play();
	};
	//Pause the pickaxe sound
	s.pickaxeSoundPause = function() {
		this.pickaxeSound.pause();
	};
	
	//Play the explosion sound.
	s.explosionSoundPlay = function() {
		this.explosionSound.play();
	};
	//Pause the explosion sound.
	s.explosionSoundPause = function() {
		this.explosionSound.pause();
	};
	
		//Play the pickaxe sound.
	s.mortarSoundPlay = function() {
		this.mortarSound.play();
	};
	//Pause the pickaxe sound
	s.mortarSoundPause = function() {
		this.mortarSound.pause();
	};

	
	return SoundHandler;
}();
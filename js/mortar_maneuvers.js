/*
	Mortar Maneuvers
	
	Brian Nugent,
	Ryan Farrell,
	Clifton Rice

	Casual Games Development
*/

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.Mortar_Maneuvers = {
	// CONSTANT properties
    CANVAS_WIDTH: 640, 
    CANVAS_HEIGHT: 480,
	NUM_COLLECTIBLES_LEVEL_ONE: 3,
	NUM_COLLECTIBLES_LEVEL_TWO: 5,
	NUM_START_LIVES: 5,
	
	GAME_STATE_MENU: 0,
	GAME_STATE_PLAY: 1,
	GAME_STATE_ROUND_OVER: 2,
	GAME_STATE_ROUND_REPEAT: 3,
	GAME_STATE_GAME_OVER: 4,
	GAME_STATE_PAUSE: 5,
		
	//properties
    canvas: undefined,
    ctx: undefined,
	app: undefined,
	utilities: undefined,
	buttons: undefined,
	escapePressed: undefined,
	currentState: undefined,
	animationID: undefined,
	screenHeight: undefined,
	screenWidth: undefined,
	
	currentPrisoner: undefined,
	currentPrisonerIndex: undefined,
	prisoners: undefined,
	
	activeExplosions: undefined,
	activeMortars: undefined,
	collectibles: undefined,
	inactiveCollectibles: undefined,
	
	dt: undefined,
	lastTime: undefined,

	numCollected: 0,
	numPrisoners: 2,
	roundNumber: 1,
	
	collectibleSize: 30,
	mortarSize: 60,
	
	levels: undefined,
	currentLevelIndex: 0,
	currentLevel: undefined,
	playedTutorial: false,

	numLives: undefined,
	
	//images
	mortarIMG: undefined,
	collectableIMG: undefined,
	prisonerIMGs: undefined,
	hatIMG: undefined,
	explosionIMGs: undefined,

	currentCooldown: undefined,
	
	HUDHeight: undefined,
	screenWInfo: undefined,
	screenHInfo: undefined,
	
	soundHandler: undefined,
	
	totalScore: 0,
	roundScore: 0,
	highScores: undefined,
	
    // methods
	init: function() {
		// declare properties
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.CANVAS_WIDTH;
		this.canvas.height = this.CANVAS_HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
		this.HUDHeight = 50;
		
		this.screenWInfo = new app.Vector(0, this.CANVAS_WIDTH);
		this.screenHInfo = new app.Vector(this.HUDHeight, this.CANVAS_HEIGHT);
		
		this.prisonerIMGs = [];
		this.explosionIMGs = [];
		this.instructionIMGs = [];
		this.loadImages();
		
		this.levels = [];
		this.initLevels();
		this.currentLevel = this.levels[this.currentLevelIndex];
		
		this.highScores = [];
		
		this.numLives = this.NUM_START_LIVES;

		//sound variables
		this.soundHandler = new app.SoundHandler();
		this.soundHandler.backgroundMusicPlay();
		
		this.currentState = 0;
		
		this.reset();
		
		this.dt = 0;
		this.lastTime=0;
		
		this.canvas.onmousedown = this.doMousedown;	
		this.update();
	},
	
	initLevels: function() {
		this.levels[0] = {
			cooldown: Number.MAX_SAFE_INTEGER,
			numCollectibles: 1,
			maxDistance: 100,
			tutorial: true,
			startPos: new app.Vector(this.screenWInfo.x + 50, this.screenHInfo.y - 50),
			collectablePos: new app.Vector(this.screenWInfo.y - 50, this.screenHInfo.x + 50),
			instructionsIMGS: [this.instructionIMGs[0],this.instructionIMGs[1],this.instructionIMGs[2]],
			instructionsSize: new app.Vector(180, 120),
			movePos: new app.Vector(this.screenWInfo.x + 120, this.screenHInfo.y / 2 + 20),
			rotatePos: new app.Vector(this.screenWInfo.y /2, this.screenHInfo.y / 2 + 20),
			swapPos: new app.Vector(this.screenWInfo.y - 120, this.screenHInfo.y / 2 + 20),
		}
		this.levels[1] = {
			cooldown: Number.MAX_SAFE_INTEGER,
			numCollectibles: 1,
			maxDistance: 100,
			startPos: new app.Vector(this.screenWInfo.y - 50, this.screenHInfo.x + 50),
			tutorial: true,
			collectablePos: new app.Vector(this.screenWInfo.x + 50, this.screenHInfo.y - 50),
			tutorialPrisoner: new app.Prisoner(this.prisonerIMGs[0], this.hatIMG, this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2, 40, 20, this.screenWInfo, this.screenHInfo, 100, 0),
			tutorialMortarNeeded: true,
			tutorialMortarPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			instructionPos: new app.Vector(this.screenWInfo.y /2 + 35, this.screenHInfo.y / 2),
			instructionsIMGS: [this.instructionIMGs[3]],
			instructionsSize: new app.Vector(180, 120),
			instructionsAngle: 0,
		}
		this.levels[2] = {
			cooldown: Number.MAX_SAFE_INTEGER,
			numCollectibles: 1,
			maxDistance: 100,
			startPos: new app.Vector(this.screenWInfo.x + 50, this.screenHInfo.y - 50),
			tutorial: true,
			collectablePos: new app.Vector(this.screenWInfo.y - 50, this.screenHInfo.x + 50),
			tutorialMortarNeeded: true,
			tutorialMortarPos: new app.Vector(this.screenWInfo.y - 40, this.screenHInfo.x + 40),
			instructionPos: new app.Vector(this.screenWInfo.y /2 + 20, this.screenHInfo.y / 2 + 20),
			instructionsIMGS: [this.instructionIMGs[4]],
			instructionsSize: new app.Vector(180, 120),
			instructionsAngle: 0,
		}
		this.levels[3] = {
			cooldown: 3,
			numCollectibles: 3,
			maxDistance: 97.5,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[4] = {
			cooldown: 2.80,
			numCollectibles: 5,
			maxDistance: 95,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[5] = {
			cooldown: 2.60,
			numCollectibles: 7,
			maxDistance: 92.5,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[6] = {
			cooldown: 2.40,
			numCollectibles: 9,
			maxDistance: 90,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[7] = {
			cooldown: 2.20,
			numCollectibles: 11,
			maxDistance: 87.5,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[8] = {
			cooldown: 2.00,
			numCollectibles: 13,
			maxDistance: 85,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[9] = {
			cooldown: 1.85,
			numCollectibles: 15,
			maxDistance: 82.5,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[10] = {
			cooldown: 1.70,
			numCollectibles: 17,
			maxDistance: 80,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[11] = {
			cooldown: 1.6,
			numCollectibles: 19,
			maxDistance: 77.5,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[12] = {
			cooldown: 1.55,
			numCollectibles: 21,
			maxDistance: 75,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[13] = {
			cooldown: 1.5,
			numCollectibles: 23,
			maxDistance: 72.5,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[14] = {
			cooldown: 1.45,
			numCollectibles: 25,
			maxDistance: 70,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[15] = {
			cooldown: 1.4,
			numCollectibles: 27,
			maxDistance: 67.5,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[16] = {
			cooldown: 1.35,
			numCollectibles: 29,
			maxDistance: 65,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[17] = {
			cooldown: 1.3,
			numCollectibles: 31,
			maxDistance: 62.5,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[18] = {
			cooldown: 1.25,
			numCollectibles: 33,
			maxDistance: 60,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[19] = {
			cooldown: 1.2,
			numCollectibles: 35,
			maxDistance: 57.5,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[20] = {
			cooldown: 1.15,
			numCollectibles: 37,
			maxDistance: 55,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
		this.levels[21] = {
			cooldown: 1.1,
			numCollectibles: 39,
			maxDistance: 52.5,
			startPos: new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2),
			tutorial: false,
		}
	},
	
	//load images
	loadImages: function(){
		this.mortarIMG = new Image();
		this.mortarIMG.src = this.app.IMAGES['reticleCircle'];
		
		this.collectableIMG = new Image();
		this.collectableIMG.src = this.app.IMAGES['mattock'];
		
		var p1 = new Image();
		p1.src = this.app.IMAGES['prisoner1'];
		this.prisonerIMGs.push(p1);
		
		var p2 = new Image();
		p2.src = this.app.IMAGES['prisoner2'];
		this.prisonerIMGs.push(p2);
		
		var p3 = new Image();
		p3.src = this.app.IMAGES['prisoner3'];
		this.prisonerIMGs.push(p3);
		
		var p4 = new Image();
		p4.src = this.app.IMAGES['prisoner4'];
		this.prisonerIMGs.push(p4);
		
		this.hatIMG = new Image();
		this.hatIMG.src = this.app.IMAGES['hat'];
		
		var e1 = new Image();
		e1.src = this.app.IMAGES['explosion1'];
		this.explosionIMGs.push(e1);
		
		var e2 = new Image();
		e2.src = this.app.IMAGES['explosion2'];
		this.explosionIMGs.push(e2);
		
		var e3 = new Image();
		e3.src = this.app.IMAGES['explosion3'];
		this.explosionIMGs.push(e3);
		
		var e4 = new Image();
		e4.src = this.app.IMAGES['explosion4'];
		this.explosionIMGs.push(e4);
		
		var i1 = new Image();
		i1.src = this.app.IMAGES['instructionSwap'];
		this.instructionIMGs.push(i1);
		
		var i2 = new Image();
		i2.src = this.app.IMAGES['instructionMove'];
		this.instructionIMGs.push(i2);
		
		var i3 = new Image();
		i3.src = this.app.IMAGES['instructionRotate'];
		this.instructionIMGs.push(i3);
		
		var i4 = new Image();
		i4.src = this.app.IMAGES['instructionPlayer'];
		this.instructionIMGs.push(i4);
		
		var i5 = new Image();
		i5.src = this.app.IMAGES['instructionPickaxe'];
		this.instructionIMGs.push(i5);
	},
	
	//handle player-collectable collision
	collect: function(index) {
		this.collectibles[index].soundHandler.pickaxeSoundPlay();
		this.collectibles.splice(index, 1);
		this.numCollected++;
		if(this.currentLevel.tutorial != true)
		{
			this.roundScore += 100;
		}
		
		if(this.numCollected == this.levels[this.currentLevelIndex].numCollectibles) {
			this.pauseAllAudio();
			if(this.currentLevel.tutorial != true)
			{
				this.totalScore += this.roundScore;
				this.roundScore = 0;
			}
			this.currentState = this.GAME_STATE_ROUND_OVER;

		}
		
	},
	
	storeHighScore: function() {
		if(localStorage.getItem("highScores") != null) {
			var tempScoreArray = JSON.parse(localStorage.getItem("highScores"));
			tempScoreArray.push(this.totalScore);
			tempScoreArray.sort(function(a,b){return b-a});
			
			while(tempScoreArray.length > 5) {
				tempScoreArray.pop();
			}
			
			localStorage.setItem("highScores", JSON.stringify(tempScoreArray));
		} else {
			var tempScoreArray = [];
			tempScoreArray.push(this.totalScore);
			localStorage.setItem("highScores", JSON.stringify(tempScoreArray));
		}
	},
	
	getHighScores: function() {
		var scoreArray = JSON.parse(localStorage.getItem("highScores"));
		return scoreArray;
	},
	
	writeScores: function(scoreArray, scorePos) {
		for(var i = 0; i < scoreArray.length; i++) {
			this.drawText("Score #" + (i+1) + ": " + scoreArray[i], scorePos.x, scorePos.y + (25*i), 25, "white");
		}
	},
	
	pauseAllAudio: function() {
		if(this.activeMortars.length > 0) {
				for(var i = 0; i < this.activeMortars.length; i++) {
					this.activeMortars[i].soundHandler.mortarSoundPause();
				}
			}
		if(this.activeExplosions.length > 0) {
			for(var i = 0; i < this.activeExplosions.length; i++) {
				this.activeExplosions[i].soundHandler.explosionSoundPause();
			}
		}
	},
	
	//handle player-explosion collision
	kill: function() {
		if(this.numLives > 0) {
			this.numLives--;
			this.pauseAllAudio();
			this.roundScore = 0;
			this.currentState = this.GAME_STATE_ROUND_REPEAT;
		} else {
			this.pauseAllAudio();
			this.storeHighScore();
			this.roundScore = 0;
			this.totalScore = 0;
			
			this.currentState = this.GAME_STATE_GAME_OVER;
			this.numLives = this.NUM_START_LIVES;
		}
	},
	
	reset: function() {
		this.numCollected = 0;
		//var currentLevel = this.levels[this.currentLevelIndex];
		// mortar cooldown time reset
		this.currentCooldown = this.currentLevel.cooldown;
		//prisoners
		this.prisoners = [];
		
		for(var i = 0; i < this.numPrisoners; i++)
		{
			var randomImageIndex = Math.floor(app.utilities.getRandom(0, 4));
			var randomImage = this.prisonerIMGs[randomImageIndex];
			//Prisoner(img, x, y, width, height, screenWInfo, screenHInfo chainLength, angle)
			this.prisoners.push(new app.Prisoner(randomImage, this.hatIMG, this.currentLevel.startPos.x - (i * 10), this.currentLevel.startPos.y - (i * 10), 40, 20, this.screenWInfo, this.screenHInfo,  this.levels[this.currentLevelIndex].maxDistance, 0));
		}
		
		//set focus on the first prisoner
		this.currentPrisonerIndex = 0;
		this.currentPrisoner = this.prisoners[this.currentPrisonerIndex];
		this.currentPrisoner.gainFocus();
		
		//explosions
		this.activeExplosions = [];
		this.activeMortars = [];
		
		if(this.currentLevel.tutorialMortarNeeded == true)
		{
			this.activeMortars.push(new app.Mortar(this.currentLevel.tutorialMortarPos.x, this.currentLevel.tutorialMortarPos.y, this.mortarSize, this.mortarIMG));
		}
		
		// Collectibles
		this.collectibles = [];
		
		if(this.currentLevel.tutorial != true) //randomly place collectables if not a tutorial
		{
			for(var i = 0; i < this.currentLevel.numCollectibles; i++) {
				this.collectibles.push(new app.Collectible(this.collectableIMG, app.utilities.getRandom(this.screenWInfo.x+(this.collectibleSize/2), this.screenWInfo.y-(this.collectibleSize/2)), app.utilities.getRandom(this.screenHInfo.x+(this.collectibleSize/2), this.screenHInfo.y-(this.collectibleSize/2)), this.collectibleSize));
			}
		}
		else
		{
			this.collectibles.push(new app.Collectible(this.collectableIMG, this.currentLevel.collectablePos.x, this.currentLevel.collectablePos.y, this.collectibleSize));
		}
		this.inactiveCollectibles = [];
		
	},
	
	drawText: function(string, x, y, size, color) {
		this.ctx.font = size+'px Black Ops One';
		this.ctx.fillStyle = color;
		this.ctx.fillText(string, x, y);
	},
	
	drawHUD: function() {
		if(this.currentState == this.GAME_STATE_PLAY) {
			this.drawText("Pickaxes: " + this.numCollected + "/" + this.levels[this.currentLevelIndex].numCollectibles + "      |      " + "Lives Remaining: " + this.numLives + "      |      " + "Round: " + this.currentLevelIndex, 50, 30, 16, "#E6E6E6");
		}
		
		if(this.currentState == this.GAME_STATE_MENU) {
			this.ctx.save();
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "middle";
			this.drawText("MORTAR MANEUVERS", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/4 + 20, 50, "#E0E900");
			this.drawText("Click the mouse to begin playing.", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2, 30, "#E6E6E6");
			this.ctx.restore();
		} // end if
		
		if(this.currentState == this.GAME_STATE_ROUND_OVER) {
			this.ctx.save();
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "middle";
			this.drawText("Round Completed!", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2 - 40, 30, "#FFFF66");
			this.drawText("Current Score: " + this.totalScore, this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2, 30, "#FFFFFF");
			this.drawText("Next round there are " + this.levels[this.currentLevelIndex+1].numCollectibles + " pickaxe(s)", this.CANVAS_WIDTH/2 , this.CANVAS_HEIGHT/2 + 35, 24, "#E6E6E6");
			this.drawText("Click to continue", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2 + 70, 30, "#FFFF66");
			this.ctx.restore();
		}
		
		if(this.currentState == this.GAME_STATE_ROUND_REPEAT) {
			this.ctx.save();
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "middle";
			this.drawText("Round Failed!", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2 - 20, 30, "#FFFF66");
			this.drawText("This round there are " + this.levels[this.currentLevelIndex+1].numCollectibles + " pickaxe(s)", this.CANVAS_WIDTH/2 , this.CANVAS_HEIGHT/2 + 15, 24, "#E6E6E6");
			this.drawText("Click to try again", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2 + 50, 30, "#FFFF66");
			this.ctx.restore();
		}
		
		if(this.currentState == this.GAME_STATE_GAME_OVER) {
			this.ctx.save();
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "middle";
			this.drawText("Game Over", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/4 - 40, 30, "red");
			this.drawText("Highscores:", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2 - 100, 30, "#FF6600");
			if(localStorage.getItem("highScores") != null) {
				var scoreArray = this.getHighScores();
				this.writeScores(scoreArray, new app.Vector(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2 - 50));
			}
			this.drawText("Click to respawn", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2 + 120, 30, "#E6E6E6");
			this.ctx.restore();
		}
		
		if(this.currentState == this.GAME_STATE_PAUSE) {
			this.ctx.save();
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "middle";
			this.drawText("Game Over", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2 - 40, 34,	 "#ddd");
			this.drawText("Click to play again", this.CANVAS_WIDTH/2 , this.CANVAS_HEIGHT/2 + 35, 24, "#ddd");
			this.ctx.restore();
		}
	},
	
	checkForCollisions: function() {
		if(this.currentState == this.GAME_STATE_PLAY) {
			for(var i = 0; i < this.prisoners.length; i++) {
				for(var j = 0; j < this.collectibles.length; j++) {
					if(app.utilities.collides(this.prisoners[i], this.collectibles[j])) {
						//collision stuff
						this.collect(j);
					}
				}
				for(var k = 0; k < this.activeExplosions.length; k++) {
					if(app.utilities.collides(this.prisoners[i], this.activeExplosions[k]) && this.currentLevel.tutorial != true) {
						//collision stuff
						this.kill();
					}
				}
			}
			
			for(var i = 0; i < this.activeExplosions.length; i++) {
				for(var j = 0; j < this.collectibles.length; j++) {
					if(app.utilities.collides(this.activeExplosions[i], this.collectibles[j])) {
						//collision stuff
						this.activeExplosions.push(this.makeNewExplosion(this.collectibles[j].position));
						this.collectibles.splice(j, 1);
						this.collectibles.push(new app.Collectible(this.collectableIMG, app.utilities.getRandom(this.screenWInfo.x+(this.collectibleSize/2), this.screenWInfo.y-(this.collectibleSize/2)), app.utilities.getRandom(this.screenHInfo.x+(this.collectibleSize/2), this.screenHInfo.y-(this.collectibleSize/2)), this.collectibleSize));
					}
				}
				
				if(this.currentLevel.tutorialPrisoner != undefined)
				{
					if(app.utilities.collides(this.activeExplosions[i],this.currentLevel.tutorialPrisoner))
					{
						this.currentLevel.tutorialPrisoner.position = new app.Vector(Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER);
					}
				}
			}
		}
	},
	
	// Handle player input
	handleKeyboard: function() {
		//Player input
		if (this.app.keydown[this.app.KEYBOARD.KEY_W] == true) {
			//this.currentPrisoner.move("up");
			this.currentPrisoner.isAccelerating = true;
		}
		else if(this.app.keydown[this.app.KEYBOARD.KEY_W] == false)
		{
			this.currentPrisoner.isAccelerating = false;
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_A]) {
			this.currentPrisoner.rotate("left", this.dt);
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_D]) {
			this.currentPrisoner.rotate("right", this.dt);
		}
		if (this.app.keypress[this.app.KEYBOARD.KEY_Q]) {
			this.switchPrisoner(-1);
		}
		if (this.app.keypress[this.app.KEYBOARD.KEY_E]) {
			this.switchPrisoner(1);
		}
	},
	
	//change which prisoner has focus
	switchPrisoner: function(indexChange){
		this.currentPrisoner.loseFocus();
		
		this.currentPrisonerIndex += indexChange;
		
		if(this.currentPrisonerIndex == -1)
		{
			var newIndex = this.prisoners.length-1
			this.currentPrisonerIndex = newIndex;
		}
		else if(this.currentPrisonerIndex == this.prisoners.length)
		{
			this.currentPrisonerIndex = 0;
		}
		
		this.currentPrisoner = this.prisoners[this.currentPrisonerIndex];
		this.currentPrisoner.gainFocus();
	},
	
	//return a new explosion at the position
	makeNewExplosion: function(position) {
		
		return new app.Explosion(this.explosionIMGs, position.x, position.y, 12 ,75)
	},
	
	doMousedown: function(e) {
		var mm = app.Mortar_Maneuvers;
		//if(this.currentState == this.GAME_STATE_PLAY) return;
		if(mm.currentState == mm.GAME_STATE_MENU) {
			mm.currentState = mm.GAME_STATE_PLAY;
			mm.reset();
			return;
		}
		if(mm.currentState == mm.GAME_STATE_GAME_OVER) {
			mm.currentLevelIndex = 3;
			mm.currentLevel = mm.levels[mm.currentLevelIndex];
			mm.currentState = mm.GAME_STATE_PLAY;
			mm.reset();
			return;
		}
		if(mm.currentState == mm.GAME_STATE_ROUND_OVER) {
			mm.currentLevelIndex++;
			mm.currentLevel = mm.levels[mm.currentLevelIndex];
			mm.currentState = mm.GAME_STATE_PLAY;
			mm.reset();
			return;
		}
		if(mm.currentState == mm.GAME_STATE_ROUND_REPEAT) {
			mm.currentState = mm.GAME_STATE_PLAY;
			mm.reset();
			return;
		}
	},
	
	update: function() {
		requestAnimationFrame(this.update.bind(this));
		if(this.currentState == this.GAME_STATE_MENU || this.currentState == this.GAME_STATE_GAME_OVER || this.currentState == this.GAME_STATE_ROUND_OVER || this.currentState == this.GAME_STATE_ROUND_REPEAT) {
			this.ctx.fillStyle = "black";
			this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
		}
		if(this.currentState == this.GAME_STATE_PLAY) {
			
			this.checkForCollisions();
		
			//calculate dt
			this.dt = this.calculateDeltaTime();
			
			// Fire mortars
			this.currentCooldown -= this.dt;
			if(this.currentCooldown <= 0) {
				this.activeMortars.push(new app.Mortar(app.utilities.getRandom(this.screenWInfo.x+(this.mortarSize/2), this.screenWInfo.y-(this.mortarSize/2)), app.utilities.getRandom(this.screenHInfo.x+(this.mortarSize/2), this.screenHInfo.y-(this.mortarSize/2)), this.mortarSize, this.mortarIMG));
				this.currentCooldown = this.levels[this.currentLevelIndex].cooldown;
			}
			
			//update the prisoners
			for(var i = 0; i < this.prisoners.length; i++) {
				var otherPrisoner;
				
				if(i == 0)
				{
					otherPrisoner = this.prisoners[1];
				}
				else if(i == 1)
				{
					otherPrisoner = this.prisoners[0];
				}
				this.prisoners[i].update(this.ctx, otherPrisoner);
			}
			
			//update the active mortar fire
			for(var i = 0; i < this.activeMortars.length; i++)
			{
				if(this.activeMortars[i].getActive() == true)
				{
					//update the active explosion
					this.activeMortars[i].update(this.dt);
				}
				else if (this.activeMortars[i].getActive() == false)
				{
					this.activeExplosions.push(this.makeNewExplosion(this.activeMortars[i].position));
					//remove element from array
					this.activeMortars[i].soundHandler.mortarSound.pause();
					this.activeMortars.splice(i, 1);
				}
			}
				
			
			//update the active explosions
			for(var i = 0; i < this.activeExplosions.length; i++)
			{
				if(this.activeExplosions[i].getActive() == true)
				{
					//update the active explosion
					this.activeExplosions[i].update(this.dt);
				}
				else if (this.activeExplosions[i].getActive() == false)
				{
					//remove element from array
					this.activeExplosions.splice(i, 1);
				}
			}
			//draw everything
			this.draw();
		}
		this.drawHUD();
		this.handleKeyboard();
		app.keypress = [];
	},
	
	//draw the game
	draw: function() {
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
		var backgroundPos = new app.Vector(this.CANVAS_WIDTH/2,(this.CANVAS_HEIGHT/2) + this.HUDHeight/2);
		var backgroundSize = new app.Vector(this.screenWInfo.y - this.screenWInfo.x,this.screenHInfo.y - this.screenHInfo.x);
		app.drawLib.drawRect(this.ctx, "#997A3D", backgroundPos, backgroundSize);
		//#005200
		
		if(this.currentLevel.instructionsIMGS != null) //draw the instructions if the level has any
		{
			var imgs = this.currentLevel.instructionsIMGS;
			if(imgs.length > 1){
				//draw the controls
				app.drawLib.drawImage(this.ctx, imgs[1], new app.Vector(0,0), new app.Vector(747, 496), this.currentLevel.movePos, this.currentLevel.instructionsSize, 0);
				app.drawLib.drawImage(this.ctx, imgs[0], new app.Vector(0,0), new app.Vector(747, 496), this.currentLevel.swapPos, this.currentLevel.instructionsSize, 0);
				app.drawLib.drawImage(this.ctx, imgs[2], new app.Vector(0,0), new app.Vector(747, 496), this.currentLevel.rotatePos, this.currentLevel.instructionsSize, 0);
			}
			else
			{
				//draw specific instructions
				app.drawLib.drawImage(this.ctx, imgs[0], new app.Vector(0,0), new app.Vector(747, 496), this.currentLevel.instructionPos, this.currentLevel.instructionsSize, this.currentLevel.instructionsAngle);
			}
		}
		
		//draw prisoners
		for(var i = 0; i < this.prisoners.length; i++) {
			//draw the chain from the prisoner to the next one
			if(i < this.prisoners.length - 1)
			{
				var distance = this.prisoners[i].position.distance(this.prisoners[i+1].position);
				var percentage= distance / this.levels[this.currentLevelIndex].maxDistance;
				var r = 0;
				
				if(percentage > .5) {
					r = Math.round(percentage * 255);
					app.drawLib.drawLine(this.ctx, 'rgb(' +(2*(r-Math.round(0.5*255)))+ ',0,0)', 3, this.prisoners[i].position, this.prisoners[i+1].position);
				} else {
					app.drawLib.drawLine(this.ctx, 'rgb(0,0,0)', 3, this.prisoners[i].position, this.prisoners[i+1].position);
				}
				
				//drawLine(ctx, color, weight, pos1, pos2)
				
			}
			
			this.prisoners[i].draw(this.ctx);
		}
		if(this.currentLevel.tutorialPrisoner != null)
		{
			this.currentLevel.tutorialPrisoner.draw(this.ctx);
		}
		
		// Draw the collectibles
		for(var i = 0; i < this.collectibles.length; i++) {
			this.collectibles[i].draw(this.ctx);
		}
		
		//draw mortars
		for(var i = 0; i < this.activeMortars.length; i++) {
			this.activeMortars[i].draw(this.ctx);
		}
		
		//draw the active explosions
		for(var i = 0; i < this.activeExplosions.length; i++)
		{
			this.activeExplosions[i].draw(this.ctx);
		}
		
		
	},
	
	//calculate the change in time
	calculateDeltaTime: function(){
		var now, fps;
		now = (+new Date);
		fps = 1000 / (now - this.lastTime);
		fps = app.utilities.clamp(fps, 12,60);
		this.lastTime = now; 
		return 1/fps;
	}
}

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
	GAME_STATE_GAME_OVER: 3,
	GAME_STATE_PAUSE: 4,
		
	//properties
    canvas: undefined,
    ctx: undefined,
	app: undefined,
	utilities: undefined,
	buttons: undefined,
	escapePressed: undefined,
	//gameState: undefined,
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
	
    // methods
	init: function() {
		console.log("Init called");
		// declare properties
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.CANVAS_WIDTH;
		this.canvas.height = this.CANVAS_HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
		//this.screenWidth = this.CANVAS_WIDTH - 10;
		//this.screenHeight = this.CANVAS_HEIGHT - 10;
		
		this.HUDHeight = 50;
		
		this.screenWInfo = new app.Vector(0, this.CANVAS_WIDTH);
		this.screenHInfo = new app.Vector(this.HUDHeight, this.CANVAS_HEIGHT);
		this.levels = [];
		this.initLevels();
		
		
		this.numLives = this.NUM_START_LIVES;



		
		this.currentState = 0;
		
		this.prisonerIMGs = [];
		this.explosionIMGs = [];
		this.loadImages();
		
		this.reset();
		
		this.dt = 0;
		this.lastTime=0;
		
		this.canvas.onmousedown = this.doMousedown;	
		this.update();
	},
	
	initLevels: function() {
		this.levels[0] = {
			cooldown: 3,
			numCollectibles: 1,
			maxDistance: 100,
		}
		this.levels[1] = {
			cooldown: 2,
			numCollectibles: 3,
			maxDistance: 90,
		}
		this.levels[2] = {
			cooldown: 1.75,
			numCollectibles: 5,
			maxDistance: 80,
		}
		this.levels[3] = {
			cooldown: 1.5,
			numCollectibles: 7,
			maxDistance: 70,
		}
		this.levels[4] = {
			cooldown: 1.25,
			numCollectibles: 9,
			maxDistance: 60,
		}
		this.levels[5] = {
			cooldown: 1.0,
			numCollectibles: 11,
			maxDistance: 50,
		}
		this.levels[6] = {
			cooldown: 0.75,
			numCollectibles: 13,
			maxDistance: 40,
		}
		this.levels[7] = {
			cooldown: 0.5,
			numCollectibles: 15,
			maxDistance: 30,
		}
		this.levels[8] = {
			cooldown: 0.25,
			numCollectibles: 17,
			maxDistance: 20,
		}
		this.levels[9] = {
			cooldown: 0,
			numCollectibles: 19,
			maxDistance: 10,
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
	},
	
	//handle player-collectable collision
	collect: function(index) {
		 
		this.collectibles.splice(index, 1);
		this.numCollected++;
		console.log("You collected an item, number collected: " + this.numCollected + " out of " + this.levels[this.currentLevelIndex].numCollectibles);
		
		if(this.numCollected == this.levels[this.currentLevelIndex].numCollectibles) {
		console.log("Numcollectibles in level: " + this.levels[this.currentLevelIndex].numCollectibles);
			this.currentState = this.GAME_STATE_ROUND_OVER;
		}
		
	},
	
	//handle player-explosion collision
	kill: function() {
		if(this.numLives > 0) {
			this.numLives--;
			this.reset();
		} else {
			this.currentState = this.GAME_STATE_GAME_OVER;
			this.numLives = this.NUM_START_LIVES;
		}
	},
	
	reset: function() {
		this.numCollected = 0;
		// mortar cooldown time reset
		this.currentCooldown = this.levels[this.currentLevelIndex].cooldown;
		//prisoners
		this.prisoners = [];
		
		for(var i = 0; i < this.numPrisoners; i++)
		{
			var randomImageIndex = Math.floor(app.utilities.getRandom(0, 4));
			var randomImage = this.prisonerIMGs[randomImageIndex];
			//Prisoner(img, x, y, width, height, screenWInfo, screenHInfo chainLength, angle)
			this.prisoners.push(new app.Prisoner(randomImage, this.hatIMG, this.CANVAS_WIDTH/2 - (i * 10), this.CANVAS_HEIGHT/2 - (i * 10), 40, 20, this.screenWInfo, this.screenHInfo,  this.levels[this.currentLevelIndex].maxDistance, 0));
		}
		
		//set focus on the first prisoner
		this.currentPrisonerIndex = 0;
		this.currentPrisoner = this.prisoners[this.currentPrisonerIndex];
		this.currentPrisoner.gainFocus();
		
		//explosions
		this.activeExplosions = [];
		this.activeMortars = [];
		
		
		// Collectibles
		this.collectibles = [];
		for(var i = 0; i < this.levels[this.currentLevelIndex].numCollectibles; i++) {
			this.collectibles.push(new app.Collectible(this.collectableIMG, app.utilities.getRandom(this.screenWInfo.x+(this.collectibleSize/2), this.screenWInfo.y-(this.collectibleSize/2)), app.utilities.getRandom(this.screenHInfo.x+(this.collectibleSize/2), this.screenHInfo.y-(this.collectibleSize/2)), this.collectibleSize));
		}
		this.inactiveCollectibles = [];
		
	},
	
	drawText: function(string, x, y, size, color) {
		this.ctx.font = 'bold '+size+'px Monospace';
		this.ctx.fillStyle = color;
		this.ctx.fillText(string, x, y);
	},
	
	drawHUD: function() {
		// draw score
		// drawText(string, x, y, size, color)
		
		//this.drawText("Total Score: " + totalScore, CANVAS_WIDTH - 200, 20, 16, "#ddd");
		
		if(this.currentState == this.GAME_STATE_PLAY) {
			this.drawText("Pickaxes: " + this.numCollected + "/" + this.levels[this.currentLevelIndex].numCollectibles + "   |   " + "Lives Remaining: " + this.numLives + "   |   " + "Round: " + this.currentLevelIndex, 50, 30, 16, "#E6E6E6");
		}
		
		if(this.currentState == this.GAME_STATE_MENU) {
			this.ctx.save();
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "middle";
			this.drawText("MORTAR MANEUVERS", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/4, 50, "#E0E900");
			this.drawText("Click the mouse to begin playing.", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2, 30, "#E6E6E6");
			this.ctx.restore();
		} // end if
		
		if(this.currentState == this.GAME_STATE_ROUND_OVER) {
			
			this.ctx.save();
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "middle";
			this.drawText("Round Completed!", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2 - 40, 30, "#FFFF66");
			this.drawText("Click to continue", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2, 30, "#FFFF66");
			this.drawText("Next round there are " + this.levels[this.currentLevelIndex+1].numCollectibles + " pickaxe(s)", this.CANVAS_WIDTH/2 , this.CANVAS_HEIGHT/2 + 35, 24, "#E6E6E6");
			this.ctx.restore();
		}
		
		if(this.currentState == this.GAME_STATE_GAME_OVER) {
			this.ctx.save();
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "middle";
			this.drawText("Game Over", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2 - 40, 30,	 "#FF6600");
			this.drawText("Click to respawn", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2, 30, "#E6E6E6");
			this.ctx.restore();
		} // end if
		
		if(this.currentState == this.GAME_STATE_PAUSE) {
			this.ctx.save();
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "middle";
			this.drawText("Game Over", this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2 - 40, 34,	 "#ddd");
			//this.drawText("Your final score was " + totalScore, CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 34, "red");
			this.drawText("Click to play again", this.CANVAS_WIDTH/2 , this.CANVAS_HEIGHT/2 + 35, 24, "#ddd");
			this.ctx.restore();
		}
	}, // end function
	
	checkForCollisions: function() {
		//var self = this;
		if(this.currentState == this.GAME_STATE_PLAY) {
			for(var i = 0; i < this.prisoners.length; i++) {
				for(var j = 0; j < this.collectibles.length; j++) {
					if(app.utilities.collides(this.prisoners[i], this.collectibles[j])) {
						//collision stuff
						this.collect(j);
					}
				}
				for(var k = 0; k < this.activeExplosions.length; k++) {
					if(app.utilities.collides(this.prisoners[i], this.activeExplosions[k])) {
						//collision stuff
						this.kill(k);
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
			mm.currentLevelIndex = 1;
			mm.currentState = mm.GAME_STATE_PLAY;
			mm.reset();
			return;
		}
		if(mm.currentState == mm.GAME_STATE_ROUND_OVER) {
			mm.currentLevelIndex++;
			mm.currentState = mm.GAME_STATE_PLAY;
			mm.reset();
			return;
		}
		
		//var mouse = getMouse(e);
		//console.log("(mouse.x, mouse.y)=" + mouse.x + "," + mouse.y);
	},
	
	update: function() {
		requestAnimationFrame(this.update.bind(this));
		if(this.currentState == this.GAME_STATE_MENU || this.currentState == this.GAME_STATE_GAME_OVER || this.currentState == this.GAME_STATE_ROUND_OVER) {
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
		app.drawLib.drawRect(this.ctx, "#005200", backgroundPos, backgroundSize);
		
		//draw prisoners
		for(var i = 0; i < this.prisoners.length; i++) {
			//draw the chain from the prisoner to the next one
			if(i < this.prisoners.length - 1)
			{
				//drawLine(ctx, color, weight, pos1, pos2)
				app.drawLib.drawLine(this.ctx, "black", 3, this.prisoners[i].position, this.prisoners[i+1].position);
			}
			
			this.prisoners[i].draw(this.ctx);
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
		
		// Draw the collectibles
		for(var i = 0; i < this.collectibles.length; i++) {
			this.collectibles[i].draw(this.ctx);
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

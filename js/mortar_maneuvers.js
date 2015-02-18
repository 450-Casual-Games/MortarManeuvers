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
	screenHeight: undefined,
	screenWidth: undefined,
	
	//properties
    canvas: undefined,
    ctx: undefined,
	app: undefined,
	utilities: undefined,
	buttons: undefined,
	escapePressed: undefined,
	gameState: undefined,
	currentState: undefined,
	animationID: undefined,
	currentPrisoner: undefined,
	currentPrisonerIndex: undefined,
	prisoners: undefined,
	activeExplosions: undefined,
	activeMortars: undefined,
	collectibles: undefined,
	inactiveCollectibles: undefined,
	dt: undefined,
	lastTime: undefined,
	NUM_COLLECTIBLES_LEVEL_ONE: 3,
	numCollected: 0,
	numPrisoners: 2,
	NUM_START_LIVES: 5,
	numLives: undefined,
	mortarIMG: undefined,
	collectableIMG: undefined,
	prisonerIMGs: undefined,
	
    // methods
	init: function() {
		console.log("Init called");
		// declare properties
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.CANVAS_WIDTH;
		this.canvas.height = this.CANVAS_HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
		this.screenWidth = this.CANVAS_WIDTH - 10;
		this.screenHeight = this.CANVAS_HEIGHT - 10;
		
		this.numLives = this.NUM_START_LIVES;
		
		this.gameState = {
			mainMenu: 0,
			play: 1,
			gameOver: 2,
			pause: 3,
		}
		this.currentState = this.gameState[1];
		
		this.prisonerIMGs = [];
		this.loadImages();
		
		this.reset();
		
		this.dt = 0;
		this.lastTime=0;
		
		
		this.update();
	},
	
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
	},
	
	collect: function(index) {
		this.collectibles.splice(index, 1);
		this.numCollected++;
		console.log("You collected an item, number collected: " + this.numCollected);
	},
	
	kill: function(index) {
		if(this.numLives >=0) {
			this.numLives--;
			this.reset();
		} else {
			this.currentState = this.gameState[2];
			this.numLives = this.NUM_START_LIVES;
		}
	},
	
	reset: function() {
		this.numCollected = 0;
		// mortar cooldown time reset
		
		//prisoners
		this.prisoners = [];
		
		for(var i = 0; i < this.numPrisoners; i++)
		{
			var randomImageIndex = Math.floor(app.utilities.getRandom(0, 4));
			var randomImage = this.prisonerIMGs[randomImageIndex];
			this.prisoners.push(new app.Prisoner(randomImage,this.CANVAS_WIDTH/2 - (i * 10),this.CANVAS_HEIGHT/2 - (i * 10), 40, 20));
		}
		this.currentPrisonerIndex = 0;
		this.currentPrisoner = this.prisoners[this.currentPrisonerIndex];
		this.currentPrisoner.gainFocus();
		
		//explosions
		this.activeExplosions = [];
		this.activeMortars = [];
		this.activeMortars.push(new app.Mortar(app.utilities.getRandom(15, this.screenWidth-15), app.utilities.getRandom(30, this.screenHeight-30), 60, this.mortarIMG));
		
		// Collectibles
		this.collectibles = [];
		for(var i = 0; i < this.NUM_COLLECTIBLES_LEVEL_ONE; i ++) {
			this.collectibles.push(new app.Collectible(this.collectableIMG, app.utilities.getRandom(15, this.screenWidth-15), app.utilities.getRandom(30, this.screenHeight-30), 30));
		}
		this.inactiveCollectibles = [];
		
	},
	
	checkForCollisions: function() {
		//var self = this;
		
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
		/*
		//Player 1 vs Player 2 bullets
		if(this.player1.isActive == true)
		{
			self.player2.bullets.forEach(function(bullet)
			{
				if(self.collides(bullet, self.player1))
				{
					//collision stuff
					bullet.collisionResolution();
					self.player1.bulletHit();
				}
			});
		}
		
		//Player 2 vs Player 1 bullets
		if(this.player2.isActive == true)
		{
			self.player1.bullets.forEach(function(bullet)
			{
				if(self.collides(bullet, self.player2))
				{
					//collision stuff
					bullet.collisionResolution();
					self.player2.bulletHit();
				}
			
			});
		}
		*/
	},
	
	handleKeyboard: function() {
		//Player input
		if (this.app.keydown[this.app.KEYBOARD.KEY_W]) {
			this.currentPrisoner.move("up");
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_A]) {
			this.currentPrisoner.move("left");
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_D]) {
			this.currentPrisoner.move("right");
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_S]) {
			this.currentPrisoner.move("down");
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_Q]) {
			this.switchPrisoner(-1);
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_E]) {
			this.switchPrisoner(1);
		}
	},
	
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
	
	
	/*
	handleKeyboard: function() {
		switch(this.currentState) {
			case this.gameState.play:
				if (this.escapePressed == false) {
					if (this.app.keydown[this.app.KEYBOARD.KEY_ESC]) {
						this.currentState = this.gameState.pause;

						this.escapePressed = true;
					}
				} else {
					if (!this.app.keydown[this.app.KEYBOARD.KEY_ESC]) {
						this.escapePressed = false;
					}
				}
			
				//Player input
				if (this.app.keydown[this.app.KEYBOARD.KEY_W]) {
					this.currentPrisoner.move("up", this.dt);
				}
				if (this.app.keydown[this.app.KEYBOARD.KEY_A]) {
					this.currentPrisoner.move("left", this.dt);
				}
				if (this.app.keydown[this.app.KEYBOARD.KEY_D]) {
					this.currentPrisoner.move("right", this.dt);
				}
				if (this.app.keydown[this.app.KEYBOARD.KEY_S]) {
					this.currentPrisoner.move("down", this.dt);
				}
				break;
				
			case this.gameState.pause:
				if (this.escapePressed == false) {
					if (this.app.keydown[this.app.KEYBOARD.KEY_ESC] == true) {
						this.currentState = this.gameState.play;
						this.escapePressed = true;
					}
				} else {
					if (this.app.keydown[this.app.KEYBOARD.KEY_ESC] == false) {
						this.escapePressed = false;
					}
				}
				break;
		}
		
		if (this.currentState == this.gameState.pause) {
			if (this.escapePressed == false) {
				if (this.app.keydown[this.app.KEYBOARD.KEY_ESC] == true) {
					this.currentState = this.gameState.play;
					this.escapePressed = true;
				}
			} else {
				if (this.app.keydown[this.app.KEYBOARD.KEY_ESC] == false) {
					this.escapePressed = false;
				}
			}
		}
	},
	*/
	
	//return a new explosion at the position
	makeNewExplosion: function(position) {
		
		return new app.Explosion(position.x, position.y, 75)
	},
	
	update: function() {
		requestAnimationFrame(this.update.bind(this));
		
		this.checkForCollisions();
		
		//calculate dt
		this.dt = this.calculateDeltaTime();
		
		//update the prisoners
		for(var i = 0; i < this.prisoners.length; i++) {
			this.prisoners[i].update(this.ctx);
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
		this.handleKeyboard();
	},
	
	draw: function() {
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
		var backgroundPos = new app.Vector(this.CANVAS_WIDTH/2,this.CANVAS_HEIGHT /2);
		var backgroundSize = new app.Vector(this.screenWidth,this.screenHeight);
		app.drawLib.drawRect(this.ctx, "#22FF22", backgroundPos, backgroundSize);
		
		for(var i = 0; i < this.activeMortars.length; i++) {
			this.activeMortars[i].draw(this.ctx);
		}
		
		for(var i = 0; i < this.prisoners.length; i++) {
			this.prisoners[i].draw(this.ctx);
		}
		//update the active explosions
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

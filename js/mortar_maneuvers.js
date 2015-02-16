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
	collectibles: undefined,
	dt: undefined,
	lastTime: undefined,
	
    // methods
	init: function() {
		console.log("Init called");
		// declare properties
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.CANVAS_WIDTH;
		this.canvas.height = this.CANVAS_HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
		this.gameState = {
			mainMenu: 0,
			play: 1,
			gameOver: 2,
			pause: 3,
		}
		this.currentState = this.gameState[1];
		this.prisoners = [];
		this.prisoners.push(new app.Prisoner(this.CANVAS_WIDTH/2 - 20,this.CANVAS_HEIGHT/2 - 20, 15));
		this.prisoners.push(new app.Prisoner(this.CANVAS_WIDTH/2,this.CANVAS_HEIGHT/2, 15));
		this.currentPrisonerIndex = 0;
		this.currentPrisoner = this.prisoners[this.currentPrisonerIndex];
		this.currentPrisoner.gainFocus();
		
		this.activeExplosions = [];
		this.activeExplosions.push(new app.Explosion(this.CANVAS_WIDTH/2,this.CANVAS_HEIGHT/2, 35));
		
		this.collectibles = [];
		this.collectibles.push(new app.Collectible(app.utilities.getRandom(15, this.CANVAS_WIDTH-15), app.utilities.getRandom(30, this.CANVAS_HEIGHT-30)));
		
		this.dt = 0;
		this.lastTime=0;
		
		
		this.update();
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
	update: function() {
		requestAnimationFrame(this.update.bind(this));
		
		//calculate dt
		this.dt = this.calculateDeltaTime();
		
		//update the prisoners
		for(var i = 0; i < this.prisoners.length; i++) {
			this.prisoners[i].update(this.ctx);
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
		var backgroundPos = new app.Vector(this.CANVAS_WIDTH - 50,this.CANVAS_HEIGHT - 50)
		var backgroundSize = new app.Vector(this.CANVAS_WIDTH - 100,this.CANVAS_HEIGHT- 100)
		app.drawLib.drawRect(this.ctx, "#22FF22", backgroundPos, backgroundSize);
		
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

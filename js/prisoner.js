// Dependencies: 
// Description: singleton object that is a module of app
// properties of the ship and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'ship' object literal is now a property of our 'app' global variable
app.Prisoner = function() {
	function Prisoner(img, x, y, width, height) {
		//instance variables of the ship
		this.position = new app.Vector(x,y);
		//this.size = new app.Vector(width, height);
		
		//movement related variables
		this.velocity = new app.Vector(0,0);
		
		//health related variables
		this.isActive = false;
		this.isDead = false;
		
		this.size = new app.Vector(width, height);
		this.radius = width - 10;
		
		this.image = img;
		this.sourcePosition = new app.Vector(0,0);
		this.sourceSize = new app.Vector(200,107);
		
		//respawn variables
		this.respawnTimer = 0;
		this.timerStart = 50;
		this.spawnPosition = new app.Vector(x, y);
		this.SPEED = 2;
	};
	
	//Prisoner.app = undefined;
	
	var p = Prisoner.prototype;
	
	p.draw = function(/*dt,*/ ctx) {	
		//if(this.isActive == true) {
			//if no image, draw a rectangle
			var color;
			
			if(this.isActive == true)
			{
				color = "white";
				app.drawLib.drawCircle(ctx, color, this.position, this.radius);
			}
			if(this.image)  //if image, draw that instead
			{
				var self = this;
				app.drawLib.drawImage(ctx, self.image, self.sourcePosition, self.sourceSize, self.position, self.size);
			}
		
		//}
	};
	
	//update
	p.update = function() {	
		//physics movement
		//this.move();
	
		//change cooldown
		//this.cooldown --;
		
		//respawn
		var self = this;
		/*if(this.health <= 0) 
		{
			if(self.isActive)
			{
				self.respawnTimer = self.timerStart;
				self.isActive = false;
			}
			else
			{
				self.respawnTimer--;
			}
			
			if(self.respawnTimer <=0)
			{
				this.respawn();
				this.soundHandler.shipReviveSoundPlay();
			}
		}*/
	};
	
	//input methods
	
	//move: takes delta time to affect the speed
	p.move = function(direction) {
		var self = this;
		switch(direction) {
			case "up":
				this.position.y -= this.SPEED;
				break;
			case "down":
				this.position.y += this.SPEED;
				break;
			case "left":
				this.position.x -= this.SPEED;
				break;
			case "right":
				this.position.x += this.SPEED;
				break;
		}
		
		//multiply the velocity by friction to slow
		/*this.velocity = this.velocity.mult(this.friction);
		
		// update the x and y of the player
		this.position = this.position.sum(this.velocity);*/
	};
	
	p.gainFocus = function(){
		this.isActive = true;
	}
	
	p.loseFocus=function(){
		this.isActive = false;
	}
	
	//respawn function
	p.respawn = function() {
		var self = this;
		
		//check if the ship is dead
		//If not, reset its stuff
		if(this.lives > 0)
		{
			self.position = self.spawnPosition;
			self.acceleration = new app.Vector(0,0);
			self.velocity = new app.Vector(0,0);
			self.bullets = [];
			self.angle = self.spawnAngle;
			self.health = self.maxHealth;
			self.lives--;
			self.isActive = true;
		}
		else
		{
			self.isDead = true;
		}
	};
	
	//reset variables on the ship for playing again
	p.reset = function()
	{
		this.position = this.spawnPosition;
		this.velocity = new app.Vector(0,0);
		this.lives = this.startingLives;
		this.isActive = true;
		this.isDead = false;
	};

	
	
	return Prisoner;
}();
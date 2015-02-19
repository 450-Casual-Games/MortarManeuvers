// Dependencies: 
// Description: singleton object that is a module of app
// properties of the ship and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'ship' object literal is now a property of our 'app' global variable
app.Prisoner = function() {
	function Prisoner(img, x, y, width, height, angle) {
		//instance variables of the prisoner
		this.position = new app.Vector(x,y);
		this.size = new app.Vector(width, height);
		this.angle = angle;
		this.angleChange = 4;
		
		//movement related variables
		this.isAccelerating = false;
		this.accelerationValue = 0.2;
		this.accelerationLimit = 0.1;
		this.acceleration = new app.Vector(0,0);
		this.velocity = new app.Vector(0,0);
		this.maxSpeed = 5;
		this.friction = .99;
		
		this.rotationAsRadians = (this.angle - 90) * (Math.PI/180);
		this.forward = new app.Vector(Math.cos(this.rotationAsRadians),Math.sin(this.rotationAsRadians));
		
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
		this.spawnAngle = angle;
		this.SPEED = 2;

		//image related variables
		this.sourceSize = new app.Vector(32, 32);
	};
	
	//Prisoner.app = undefined;
	
	var p = Prisoner.prototype;
	
	p.draw = function(dt, ctx) {	
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
	
	//input methods
	//rotate: take a string representing the key input for rotation
	p.rotate = function(direction)
	{
		if(this.isActive)
		{
			switch(direction)
			{
				case "left":
					this.angle -= this.angleChange;
					break;
				case "right":
					this.angle += this.angleChange;
					break;
			}
		}
	};
	
	//update
	p.update = function(dt) {	
		// Cyber Fighters
		//update angle in radians
		this.rotationAsRadians = (this.angle - 90) * (Math.PI/180);
		this.calculateForward();
	
		//physics movement
		this.move(dt);
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
		


		// Cyber Fighters
		var forwardAccel = this.forward.mult(this.accelerationValue)
		
		var self = this;
		if(this.isAccelerating)
		{
			this.soundHandler.shipEngineSoundPlay();
			this.acceleration = new app.Vector(forwardAccel.x, forwardAccel.y);
			this.acceleration.limit(this.accelerationLimit);
			
			this.velocity = this.velocity.sum(this.acceleration);
			this.velocity.limit(this.maxSpeed);
		}
		
		//multiply the velocity by friction to slow
		this.velocity = this.velocity.mult(this.friction);
		
		// update the x and y of the player
		this.position = this.position.sum(this.velocity);

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
	
	//calculate the forward vector
	p.calculateForward = function()
	{
		this.forward.x = Math.cos(this.rotationAsRadians);
		this.forward.y = Math.sin(this.rotationAsRadians);
	};
	
	
	return Prisoner;
}();
// Dependencies: 
// Description: singleton object that is a module of app
// properties of the ship and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'ship' object literal is now a property of our 'app' global variable
app.Prisoner = function() {
	function Prisoner(img, x, y, width, height, chainLength, angle) {
		//instance variables of the prisoner
		this.position = new app.Vector(x,y);
		this.angle = angle;
		this.angleChange = 3;
		
		//movement related variables
		this.isAccelerating = false;
		this.accelerationValue = 0.2;
		this.accelerationLimit = 0.05;
		this.acceleration = new app.Vector(0,0);
		this.velocity = new app.Vector(0,0);
		this.maxSpeed = 5;
		//this.friction = .99;
		this.chainLength = chainLength;
		
		this.rotationAsRadians = (this.angle - 90) * (Math.PI/180);
		this.forward = new app.Vector(Math.cos(this.rotationAsRadians),Math.sin(this.rotationAsRadians));
		
		//health related variables
		this.isActive = false;
		this.isDead = false;
		
		this.size = new app.Vector(width, height);
		this.radius = width - 10;
		
		//image related variables
		this.image = img;
		this.sourcePosition = new app.Vector(0,0);
		this.sourceSize = new app.Vector(200,107);
		
		//respawn variables
		this.respawnTimer = 0;
		this.timerStart = 50;
		this.spawnPosition = new app.Vector(x, y);
		this.spawnAngle = angle;
		this.SPEED = 2;

		
	};
	
	//Prisoner.app = undefined;
	
	var p = Prisoner.prototype;
	
	p.draw = function(ctx) {	
		//if(this.isActive == true) {
			//if no image, draw a rectangle
			if(this.isActive)
			{
				app.drawLib.drawCircle(ctx, "white", this.position, this.radius);
			}
			if(this.image)  //if image, draw that instead
			{
				var self = this;
				app.drawLib.drawImage(ctx, self.image, self.sourcePosition, self.sourceSize, self.position, self.size, self.angle);
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
	p.update = function(dt, otherPrisoner) {	
		// Cyber Fighters
		//update angle in radians
		this.rotationAsRadians = (this.angle - 90) * (Math.PI/180);
		this.calculateForward();
	
		//physics movement
		//this.move(dt);
		if(this.isActive)
		{
			this.move(dt, otherPrisoner);
		}
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
	};
	
	p.move = function(dt, otherPrisoner)
	{
		// Cyber Fighters
		var forwardAccel = this.forward.mult(this.accelerationValue)
		
		var self = this;
		if(this.isAccelerating)
		{
			//this.soundHandler.shipEngineSoundPlay();
			this.acceleration = new app.Vector(forwardAccel.x, forwardAccel.y);
			this.acceleration.limit(this.accelerationLimit);
			
			var tempVelocity = this.velocity.sum(this.acceleration);
			
			tempVelocity.limit(this.maxSpeed);
			
			//this.velocity = 
			//this.velocity.limit(this.maxSpeed);
			
			var futurePosition = this.position.sum(tempVelocity);
			
			if(futurePosition.distance(otherPrisoner.position) < this.chainLength)
			{
				this.velocity = tempVelocity;
			}
			else
			{
				this.velocity = new app.Vector(0,0);
			}
		}
		else
		{
			this.velocity = new app.Vector(0,0);
		}
		
		//multiply the velocity by friction to slow
		//this.velocity = this.velocity.mult(this.friction);
		
		// update the x and y of the player
		this.position = this.position.sum(this.velocity);
	}
	
	p.gainFocus = function(){
		this.isActive = true;
	};
	
	p.loseFocus=function(){
		this.isActive = false;
	};
	
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
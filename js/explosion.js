// Dependencies: 
// Description: singleton object that is a module of app
// properties of the explosion and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'explosion' object literal is now a property of our 'app' global variable
app.Explosion = function() {
	function Explosion(x, y, radius) {
		//instance variables of the explosion
		this.position = new app.Vector(x,y);
		
		//health related variables
		this.active = true;
		
		this.radius = 0;
		this.maxRadius = radius;
		
		this.EXPLOSION_SPEED = 35;
		
		//respawn variables
		this.respawnTimer = 0;
		this.timerStart = 50;
	};
	
	//Explosion.app = undefined;
	
	var p = Explosion.prototype;
	
	p.draw = function( ctx) {	
		//if(this.isActive == true) {
			
			//if no image, draw a rectangle
			if(!this.image) 
			{
				var color = "red";
				
				app.drawLib.drawCircle(ctx, color, this.position, this.radius);
			} 
			else  //if image, draw that instead
			{
				var self = this;
				app.DrawLib.drawImage(ctx, self.image, self.sourcePosition, self.sourceSize, self.position.difference(center), self.size, self.angle);
			}
		
		//}
	};
	
	//update
	p.update = function(dt) {	
		//grow the explosion
		this.radius += this.EXPLOSION_SPEED * dt;
		
		//check if the explosion should be active
		if(this.radius >= this.maxRadius)
		{
			this.active = false;
		}
	
		
	};
	
	//input methods
	
	p.getActive = function()
	{
		return this.active;
	}
	
	
	return Explosion;
}();
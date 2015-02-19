// Dependencies: 
// Description: singleton object that is a module of app
// properties of the explosion and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'explosion' object literal is now a property of our 'app' global variable
app.Explosion = function() {
	function Explosion(x, y, size, maxSize) {
		//instance variables of the explosion
		this.position = new app.Vector(x,y);
		
		//health related variables
		this.active = true;
		
		this.size = new app.Vector(size, size);
		this.diagonalSize = Math.sqrt((this.size.x * this.size.x) + (this.size.y * this.size.y));
		
		this.radius = 0;
		this.maxSize = maxSize;
		
		this.EXPLOSION_SPEED = 40;
		
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
				
				app.drawLib.drawRect(ctx, color, this.position, this.size);
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
		this.size.x += this.EXPLOSION_SPEED * dt;
		this.size.y += this.EXPLOSION_SPEED * dt;
		
		this.diagonalSize = Math.sqrt((this.size.x * this.size.x) + (this.size.y * this.size.y));
		
		//check if the explosion should be active
		if(this.diagonalSize >= this.maxSize)
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
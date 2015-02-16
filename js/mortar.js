// Dependencies: 
// Description: singleton object that is a module of app
// properties of the Mortar and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'Mortar' object literal is now a property of our 'app' global variable
app.Mortar = function() {
	function Mortar(x, y, radius) {
		//instance variables of the Mortar
		this.position = new app.Vector(x,y);
		
		//health related variables
		this.active = true;
		
		this.radius = radius;
		this.minRadius = 1;
		
		this.Mortar_SPEED = 15;
		
		//respawn variables
		this.respawnTimer = 0;
		this.timerStart = 50;
	};
	
	var p = Mortar.prototype;
	
	p.draw = function( ctx) {	
		//if(this.isActive == true) {
			
			//if no image, draw a rectangle
			if(!this.image) 
			{
				var color = "yellow";
				
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
		//grow the Mortar
		this.radius -= this.Mortar_SPEED * dt;
		
		//check if the Mortar should be active
		if(this.radius <= this.minRadius)
		{
			this.active = false;
		}
	};
	
	//input methods
	
	p.getActive = function()
	{
		return this.active;
	}
	
	//return a new explosion at the position
	p.makeNewExplosion = function()
	{
		return new app.Explosion(this.position.x,this.position.y, 35)
	}
	
	
	return Mortar;
}();
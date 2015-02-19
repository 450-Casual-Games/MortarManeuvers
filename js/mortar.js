// Dependencies: 
// Description: singleton object that is a module of app
// properties of the Mortar and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'Mortar' object literal is now a property of our 'app' global variable
app.Mortar = function() {
	function Mortar(x, y, size, image) {
		//instance variables of the Mortar
		this.position = new app.Vector(x,y);
		
		//health related variables
		this.active = true;
		
		//size variables		
		this.size = new app.Vector(size, size);
		this.diagonalSize = Math.sqrt((this.size.x * this.size.x) + (this.size.y * this.size.y));
		this.minSize = 30;
		
		this.MORTAR_SPEED = 15;
		
		this.image = image;
		this.sourcePosition = new app.Vector(0,0);
		this.sourceSize = new app.Vector(421,421);
		
		//respawn variables
		/*this.respawnTimer = 0;
		this.timerStart = 50;*/
	};
	
	var p = Mortar.prototype;
	
	p.draw = function( ctx) {	
		//if(this.isActive == true) {
			
			//if no image, draw a rectangle
			/*if(!this.image) 
			{
				var color = "purple";
				
				app.drawLib.drawRect(ctx, color, this.position, this.size);
			} 
			else  //if image, draw that instead
			{
				var self = this;
				app.drawLib.drawImage(ctx, self.image, self.sourcePosition, self.sourceSize, self.position.difference(center), self.size);
			}*/
			
			
			//var color = "purple";
			
			//app.drawLib.drawRect(ctx, color, this.position, this.size);
			
			if(this.image)
			{
				var self = this;
				app.drawLib.drawImage(ctx, self.image, self.sourcePosition, self.sourceSize, self.position, self.size);
			}
		
		//}
	};
	
	//update
	p.update = function(dt) {	
		//shrink the Mortar
		this.size.x -= this.MORTAR_SPEED * dt;
		this.size.y -= this.MORTAR_SPEED * dt;
		
		this.diagonalSize = Math.sqrt((this.size.x * this.size.x) + (this.size.y * this.size.y));
		
		//check if the Mortar should be active
		if(this.diagonalSize <= this.minSize)
		{
			this.active = false;
		}
	};
	
	//input methods
	
	p.getActive = function()
	{
		return this.active;
	}
	
	
	return Mortar;
}();
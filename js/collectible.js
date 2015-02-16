// Dependencies: 
// Description: singleton object that is a module of app
// properties of the explosion and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'collectible' object literal is now a property of our 'app' global variable
app.Collectible = function() {
	function Collectible(x, y) {
		//instance variables of the explosion
		this.position = new app.Vector(x,y);
		
		//health related variables
		this.active = true;
		
		//respawn variables
		this.respawnTimer = 0;
		this.timerStart = 50;
	};

	var p = Collectible.prototype;
	
	p.draw = function(ctx) {	
		//if no image, draw a triangle
		if(!this.image) {
			var color = "yellow";
			app.drawLib.drawTriangle(ctx, color, this.position);
		} else {
			// Draw an image
			var self = this;
			app.DrawLib.drawImage(ctx, self.image, self.sourcePosition, self.sourceSize, self.position.difference(center), self.size, self.angle);
		}
		
		//}
	};
	
	//update
	p.update = function(dt) {	

	
		
	};
	
	//input methods
	
	p.getActive = function() {
		return this.active;
	}
	
	return Collectible;
}();
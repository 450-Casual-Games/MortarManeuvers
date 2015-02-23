// Dependencies: 
// Description: singleton object that is a module of app
// properties of the explosion and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'collectible' object literal is now a property of our 'app' global variable
app.Collectible = function() {
	function Collectible(img, x, y, size) {
		//instance variables of the explosion
		this.position = new app.Vector(x,y);
		
		//health related variables
		this.active = true;
		
		this.size = new app.Vector(size, size);
		
		this.image = img;
		this.sourcePosition = new app.Vector(0, 0);
		this.sourceSize = new app.Vector(144, 144);
		
		this.soundHandler = new app.SoundHandler();
		this.soundHandler.pickaxeSoundPlay();
		//respawn variables
		/*this.respawnTimer = 0;
		this.timerStart = 50;*/
	};

	var p = Collectible.prototype;
	
	p.draw = function(ctx) {	
		
		
		if(this.image) {
			// Draw an image
			var self = this;
			app.drawLib.drawImage(ctx, self.image, self.sourcePosition, self.sourceSize, self.position, self.size, self.angle);
		}
		else{
			//if no image, draw a triangle
			var color = "yellow";
			app.drawLib.drawRect(ctx, color, this.position, this.size);
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
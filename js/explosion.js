// Dependencies: 
// Description: singleton object that is a module of app
// properties of the explosion and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'explosion' object literal is now a property of our 'app' global variable
app.Explosion = function() {
	function Explosion(images, x, y, size, maxSize) {
		//instance variables of the explosion
		this.position = new app.Vector(x,y);
		
		//health related variables
		this.active = true;
		
		this.size = new app.Vector(size, size);
		this.diagonalSize = Math.sqrt((this.size.x * this.size.x) + (this.size.y * this.size.y));
		
		this.radius = 0;
		this.maxSize = maxSize;
		
		this.images = images;
		this.currentImage = 0;
		this.sourcePosition = new app.Vector(0,0);
		this.sourceSizes = [];
		this.sourceSizes.push(new app.Vector(383, 400));//size for img 1
		this.sourceSizes.push(new app.Vector(194, 182));//size for img 2
		this.sourceSizes.push(new app.Vector(164, 179));//size for img 3
		this.sourceSizes.push(new app.Vector(202, 155));//size for img 3
		
		this.animationTimer = 0;
		this.maxAnimationTime = 10;
		
		this.EXPLOSION_SPEED = 40;
		
		//respawn variables
		this.respawnTimer = 0;
		this.timerStart = 50;
		
		this.soundHandler = new app.SoundHandler();
		this.soundHandler.explosionSoundPlay();
	};
	
	//Explosion.app = undefined;
	
	var p = Explosion.prototype;
	
	p.draw = function( ctx) {
		var self = this;
		console.log("Source: " + self.images[self.currentImage].src);
		app.drawLib.drawImage(ctx, self.images[self.currentImage], self.sourcePosition, self.sourceSizes[self.currentImage], self.position, self.size, self.angle);
		
		//update the animation
		//this.currentImage++;
		
		this.animationTimer++;
		if(this.animationTimer > this.maxAnimationTime)
		{
			this.animationTimer = 0;
			this.currentImage++;
			if(this.currentImage > 3)
			{
				this.currentImage = 1;
			}
		}
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
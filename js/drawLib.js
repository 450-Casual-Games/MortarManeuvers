"use strict";
var app = app || {};

app.drawLib = {
	//draw a rectangle
	drawRect: function(ctx, color, position, size) {
		ctx.save();
		ctx.translate(position.x - size.x/2,position.y-size.y/2);
		ctx.fillStyle = color;
		ctx.fillRect(-size.x/2,-size.y/2,size.x, size.y);
		ctx.restore();
	},
	
	//draw a circle
	drawCircle: function(ctx, color, position, radius){
		ctx.save();
		ctx.beginPath();
		ctx.arc(position.x,position.y,radius, 0, Math.PI *2, false);
		ctx.closePath();
		ctx.fillStyle = color;
		ctx.fill();
		ctx.restore();
	}
}; 
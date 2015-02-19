"use strict";
var app = app || {};

app.drawLib = {
	//draw a line
	drawLine: function(ctx, color, weight, pos1, pos2){
		ctx.save();
		ctx.strokeStyle = color;
		ctx.lineWidth = weight;
		ctx.beginPath();
		ctx.moveTo(pos1.x, pos1.y);
		ctx.lineTo(pos2.x,pos2.y);
		ctx.stroke();
		ctx.restore();
		
	},
	
	//draw a rectangle
	drawRect: function(ctx, color, position, size) {
		ctx.save();
		ctx.translate(position.x ,position.y);
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
	},
	
	//draw triangle
	drawTriangle: function(ctx, color, position) {
		ctx.save();
		ctx.beginPath();
		// Draw a triangle location for each corner from x:y 100,110 -> 200,10 -> 300,110 (it will return to first point)
		ctx.moveTo(position.x, position.y);
		ctx.lineTo(position.x + 15, position.y + 30);
		ctx.lineTo(position.x - 15, position.y + 30);
		ctx.closePath();
		ctx.fillStyle = color;
		ctx.fill();
		ctx.restore();
	},
	
	drawImage: function(ctx, img, sourcePos, sourceSize, position, size, r) {
		//setup the context
		ctx.save();
		//ctx.translate(position.x,position.y);
		ctx.translate(position.x,position.y);
		ctx.rotate(r * (Math.PI/180));
		
		//display image
		ctx.drawImage(img, sourcePos.x, sourcePos.y, sourceSize.x, sourceSize.y, -size.x/2, -size.y/2, size.x, size.y);
		ctx.restore();
	},
}; 
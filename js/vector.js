/*
	Created originally for:
			Friendly Fire
	
			Alex Fuerst, 
			Mario Chuman,
			David Erbelding,
			Brian Nugent,
			Ryan Farrell,

			Game Design and Development 2
			10/3/2014

	Adapted for use in:
		Mortar Maneuvers
		
		Brian Nugent,
		Ryan Farrell,
		Clifton Rice

		Casual Games Development
		2/15/2015
*/

//vector.js is the "class" for our vector "objects"

"use strict";

//Create the global app object if needed
var app = app || {};

// This is the "IIFE"/Class for the Vector
app.Vector = function()
{
	//constructor for the vector class
	function Vector(x,y) {
		this.x = x;
		this.y = y;
	};
	
	var p = Vector.prototype;
	
	//Vector magnitude function, determines and returns the length of the vector
	p.magnitude = function() {
		var magnitude = Math.sqrt((this.x * this.x)+(this.y * this.y));
		return magnitude;
	};
	
	//Vector distance function, takes a vector to determine the length as a parameter
	//returns the value of distance between the two vectors
	p.distance = function(vec) {
		var xsquared = (this.x - vec.x) * (this.x - vec.x);
		var ysquared = (this.y - vec.y) * (this.y - vec.y);
		var distance = Math.sqrt(xsquared + ysquared);
		
		return distance;
	};
	
	//Vector sum function, takes a vector to add as a parameter
	//returns the resulting vector
	p.sum = function(vec) {
		var output = new app.Vector(this.x + vec.x, this.y + vec.y);
		return output;
	};
	
	//Vector subtraction function, takes a vector to subtract as a parameter
	//returns the resulting vector
	p.difference = function(vec) {
		var output = new app.Vector(this.x - vec.x, this.y - vec.y);
		return output;
	};
	
	//set the magnitude of a vector
	p.setMag = function(mag) {
		var angle = this.getAngle();
		this.x = mag * Math.cos(angle);
		this.y = mag * Math.sin(angle);
	};
	
	//limit the magnitude of the vector
	p.limit = function(limit) {
		var mag = this.magnitude();
		if(mag > limit)
		{
			this.setMag(limit);
		}
	};
	
	//multiply the vector by a scalar
	p.mult = function(scalar) {
		var output = new app.Vector(this.x *= scalar, this.y *= scalar);
		return output;
	};
	
	//get the angle of a vector
	p.getAngle = function() {
		return Math.atan2(this.y,this.x);
	};
	
	return Vector;
}();
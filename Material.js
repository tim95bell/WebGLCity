/*  Material
represents a material from a .mtl file.
***ATTRIBUTES***
ns : Float
ka : Float[3]
kd : Float[3]
ks : Float[3]
ni : Float
d : Float
illum : Int
texture : TgaTexture
*/
function Material(){
	this.ns = null;
	this.ka = null;
	this.kd = null;
	this.ks = null;
	this.ni = null;
	this.d = null;
	this.illum = null;
	this.texture = null;
}

Material.prototype.setNs = function(ns){
	this.ns = ns;
}

Material.prototype.setKa = function(ka){
	this.ka = ka;
}

Material.prototype.setKd = function(kd){
	this.kd = kd;
}

Material.prototype.setKs = function(ks){
	this.ks = ks;
}

Material.prototype.setNi = function(ni){
	this.ni = ni;
}

Material.prototype.setD = function(d){
	this.d = d;
}

Material.prototype.setIllum = function(illum){
	this.illum = illum;
}

Material.prototype.setTexture = function(texture){
	this.texture = texture;
}
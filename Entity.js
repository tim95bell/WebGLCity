/*  Entity
represents an instance of a Model.
***ATTRIBUTES***
model : Model
modelMatrix : UniformMat4
worldMatrix : UniformMat4
worldMatrixScale : mat4
worldMatrixTranslate : mat4
worldMatrixRotate : mat4
worldMatrixChanged : boolean
width : number
height : number
depth : number
x : number
y : number
z : number
yRot : number
*/
function Entity(model, gl, program){
  this.model = model;

	let ms = this.scaleLongestSizeToOne();
	let mt = this.centerMatrix();
  let modelMatrixVal = mult(ms, mt);
	this.modelMatrix = new UniformMat4("modelMatrix", modelMatrixVal, gl, program);
	this.modelMatrix.send(gl);
  //
  this.worldMatrixScale = mat4();
  this.worldMatrixTranslate = mat4();
  this.worldMatrixRotate = mat4();
	this.worldMatrix = new UniformMat4("worldMatrix", mat4(), gl, program);
  this.worldMatrix.send(gl);
  this.worldMatrixChanged = false;
  
  this.width = this.height = this.depth = 1;
  this.x = this.z = this.y = 0;
  this.yRot = 0;
}

Entity.prototype.render = function(gl, program){
  if(this.worldMatrixChanged){
    this.worldMatrix.val = mult(this.worldMatrixTranslate, mult(this.worldMatrixRotate, this.worldMatrixScale));
    this.worldMatrixChanged = false;
  }
  this.modelMatrix.send(gl);
  this.worldMatrix.send(gl);
	this.model.render(gl, program);
}

Entity.prototype.setSize = function(size){
  this.worldMatrixScale = scalem(size, size, size);
  this.height = this.model.mesh.relativeHeight*size;
  this.width = this.model.mesh.relativeWidth*size;
  this.depth = this.model.mesh.relativeDepth*size;
	this.worldMatrixChanged = true;
}

Entity.prototype.setLocation = function(x, y, z){
  this.worldMatrixTranslate = translate(x, y, z);
  this.x = x;
  this.y = y;
  this.z = z;
  this.worldMatrixChanged = true;
}

Entity.prototype.setYRotation = function(rot){
  this.yRot = rot;
  this.worldMatrixRotate = rotate(this.yRot, [0,1,0]);
  this.worldMatrixChanged = true;
}

Entity.prototype.centerMatrix = function(){
	let model = this.model.mesh;
  return translate(
    this.centerAxisTranslateAmount(model.minX, model.maxX),
    this.centerAxisTranslateAmount(model.minY, model.maxY),
    this.centerAxisTranslateAmount(model.minZ, model.maxZ)
  );
}

Entity.prototype.centerAxisTranslateAmount = function(l, r){
  let al = Math.abs(l);
  let ar = Math.abs(r);
  if(al > ar){
    // if its too far to the left
    let dif = al - ar;
    return dif/2;
  } else if(ar > al){
    // if its too far to the right
    let dif = ar - al;
    return -dif/2;
  } else {
    return 0;
  }
}

Entity.prototype.scaleLongestSizeToOne = function(){
  let model = this.model.mesh;
  let x = model.maxX - model.minX;
  let y = model.maxY - model.minY;
  let z = model.maxZ - model.minZ;
  let scaleAmount = 1;
  if(x > y && x > z){
    scaleAmount = 1/x;
  } else if(y > x && y > z){
    scaleAmount = 1/y;
  } else{
    scaleAmount = 1/z;
  }
  return scalem(scaleAmount, scaleAmount, scaleAmount);
}
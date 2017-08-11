/*  Entity
represents an instance of a Model.
***ATTRIBUTES***
model : Model
modelMatrix : UniformMat4
worldMatrix : UniformMat4
***METHODS***
render(gl, program)
setWorldMatrix(matrix)
centerMatrix()
centerAxisTranslateAmount(l, r)
scaleLongestSizeToOne()
*/
function Entity(model, gl, program){
  this.model = model;

	let ms = this.scaleLongestSizeToOne();
	let mt = this.centerMatrix();
	let modelMatrixVal = mult(ms, mt);
	this.modelMatrix = new UniformMat4("modelMatrix", modelMatrixVal, gl, program);
	this.modelMatrix.send(gl);
	//
	this.worldMatrix = new UniformMat4("worldMatrix", mat4(), gl, program);
	this.worldMatrix.send(gl);
}

Entity.prototype.render = function(gl, program){
	// TODO: dont need to send these every time
	this.modelMatrix.send(gl);
	this.worldMatrix.send(gl);
	this.model.render(gl, program);
}

Entity.prototype.setWorldMatrix = function(matrix){
	this.worldMatrix.val = matrix;
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
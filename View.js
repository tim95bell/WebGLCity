

function View(eye, at, gl, program){
    this.eye = eye;
    this.at = at;
    let matrixVal = lookAt(this.eye, this.at, this.up);
    this.matrix = new UniformMat4("viewMatrix", matrixVal, gl, program);
}

View.prototype.up = vec3(0, 1, 0);

View.prototype.send = function(gl){
    this.matrix.send(gl);
}
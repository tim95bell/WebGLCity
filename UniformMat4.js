 function UniformMat4(name, val, glContext, program){
 	this.loc = glContext.getUniformLocation(program, name);
 	this.val = val;
 }

 UniformMat4.prototype.send = function(glContext){
 	glContext.uniformMatrix4fv(this.loc, glContext.FALSE, flatten(this.val));
 }
/* WebGLCity
***ATTRIBUTES***
canvas
gl
program
projectionMatrix : UniformMat4
carModel : Model
floorModel : Model
h1Model : Model
h2Model : Model
h3Model : Model
car : Entity
floor : Entity
h1 : Entity
h2 : Entity
h3 : Entity
vertexPositions : vec3[]
texturePositions : vec2[]
*/
function WebGLCity(){
	this.canvas = document.getElementById( "gl-canvas" );

	this.gl = WebGLUtils.setupWebGL( this.canvas );
  	if ( !this.gl ) { alert( "WebGL isn't available" ); }

  this.gl.viewport( 0, 0, this.canvas.width, this.canvas.height );
  this.gl.clearColor( 0.1, 0.3, 0.2, 1.0 );

	this.program = initShaders( this.gl, "Shaders/Shader.vs",
                               "Shaders/Shader.fs" );
  this.gl.useProgram( this.program );  	

  // projection matrix
  let projectionMatrixVal = perspective(45,512.0/512.0 ,0.1, 10000.0 );
  this.projectionMatrix = new UniformMat4("projMatrix", projectionMatrixVal, this.gl, this.program);
  this.projectionMatrix.send(this.gl);

  this.vertexPositions = [];
  this.texturePositions = [];
  // Models and Entities
  this.aModel = new Model("Assets/meshes/H3.obj", "Assets/meshes/H3.mtl", this.gl, this.vertexPositions, this.texturePositions);
  this.a = new Entity(this.aModel, this.gl, this.program);
  this.a.setWorldMatrix(translate(0, 0, -2));

  // vertex buffer
  let posBufferId = this.gl.createBuffer();
  this.gl.bindBuffer( this.gl.ARRAY_BUFFER, posBufferId );
  this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(this.vertexPositions), this.gl.STATIC_DRAW );
  // aPosition
  let aPosition = this.gl.getAttribLocation( this.program, "aPosition" );
  this.gl.vertexAttribPointer( aPosition, 3, this.gl.FLOAT, false, 0, 0 );
  this.gl.enableVertexAttribArray( aPosition );

  // texture buffer
  let texBufferId = this.gl.createBuffer();
  this.gl.bindBuffer( this.gl.ARRAY_BUFFER, texBufferId );
  this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(this.texturePositions), this.gl.STATIC_DRAW );
  // aTextureCoordinate
  let aTextureCoordinate = this.gl.getAttribLocation( this.program, "aTextureCoordinate" );
  this.gl.vertexAttribPointer( aTextureCoordinate, 2, this.gl.FLOAT, false, 0, 0 );
  this.gl.enableVertexAttribArray( aTextureCoordinate );

  this.gl.uniform1i( this.gl.getUniformLocation(this.program, "myTexture"), 0);
	this.gl.enable(this.gl.DEPTH_TEST);
  // this.gl.enable(gl.BLEND);
 	// this.gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

WebGLCity.prototype.run = function(){
	window.requestAnimFrame(this.run.bind(this), this.canvas);
  this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
   
  this.a.render(this.gl, this.program);
}





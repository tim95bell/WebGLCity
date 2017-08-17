/* WebGLCity
***ATTRIBUTES***
worldSize : number
builingGap : number
buildingSize : number

canvas
gl

projectionMatrix : UniformMat4
views : View[]

vertexPositions : vec3[]
texturePositions : vec2[]

h1Model : Model
h2Model : Model
h3Model : Model
carModel : Model
floorModel Model

buildings : Entity[]
car : Entity
floor : Entity

carPath : CarPath
*/
function WebGLCity(){
  this.worldSize = 1020;
  this.buildingGap = 20;
  this.buildingSize = 80;

  // setup gl
	this.canvas = document.getElementById( "gl-canvas" );
	this.gl = WebGLUtils.setupWebGL( this.canvas );
  	if ( !this.gl ) { alert( "WebGL isn't available" ); }
  this.gl.viewport( 0, 0, this.canvas.width, this.canvas.height );
  this.gl.clearColor( 0.49, 0.56, 0.98, 1.0 );
	this.program = initShaders( this.gl, "Shaders/Shader.vs",
                               "Shaders/Shader.fs" );
  this.gl.useProgram( this.program );  	

  // projection matrix
  let projectionMatrixVal = perspective(45,512.0/512.0 ,0.1, 10000.0 );
  this.projectionMatrix = new UniformMat4("projMatrix", projectionMatrixVal, this.gl, this.program);
  this.projectionMatrix.send(this.gl);

  // verticex and textrure data
  this.vertexPositions = [];
  this.texturePositions = [];

  // Models
  this.h1Model = new Model("Assets/meshes/H1.obj", "Assets/meshes/H1.mtl", this.gl, this.vertexPositions, this.texturePositions);
  this.h2Model = new Model("Assets/meshes/H2.obj", "Assets/meshes/H2.mtl", this.gl, this.vertexPositions, this.texturePositions);
  this.h3Model = new Model("Assets/meshes/H3.obj", "Assets/meshes/H3.mtl", this.gl, this.vertexPositions, this.texturePositions);
  this.carModel = new Model("Assets/meshes/car.obj", "Assets/meshes/car.mtl", this.gl, this.vertexPositions, this.texturePositions);
  this.floorModel = new Model("Assets/meshes/floor.obj", "Assets/meshes/floor.mtl", this.gl, this.vertexPositions, this.texturePositions);
  
  // Entities
  this.buildings = [];
  this.placeBuildings();

  this.floor = new Entity(this.floorModel, this.gl, this.program);
  this.floor.setSize(this.worldSize);
  this.floor.setLocation(0, 0, 0);

  this.car = new Entity(this.carModel, this.gl, this.program);
  this.car.setSize(40);
  let carX = carZ = -this.worldSize/2 + this.buildingGap/2 + 4*this.buildingGap + 4*this.buildingSize;
  let carY = this.car.height/100;
  this.car.setLocation(carX, carY, carZ);
  this.carPath = new CarPath(this.buildingSize+this.buildingGap, this.car, this.gl, this.program);
  
  // Views
  this.views = [];
  //whole map back
  let eye = vec3(0, 1000, -1400);
  let at = vec3(0, 0, 0);
  this.views.push( new View(eye, at, this.gl, this.program) );
  //whole map center
  eye = vec3(0, 1300, 1);
  at = vec3(0, 0, 0);
  this.views.push( new View(eye, at, this.gl, this.program) );
  //car distant
  eye = vec3(carX + this.buildingSize/2, 200, carZ + this.buildingSize/2 + 400);
  at = vec3(carX + 1 + this.buildingSize/2, 0, carZ + 1 + this.buildingSize/2);
  this.views.push( new View(eye, at, this.gl, this.program) );
  //car close
  eye = vec3(carX - 100, 100, carZ - 100);
  at = vec3(carX + this.buildingGap + this.buildingSize/2, 0, carZ + this.buildingGap + this.buildingSize/2);
  this.views.push( new View(eye, at, this.gl, this.program) );
  // low down
  eye = vec3(-this.worldSize/2 + this.buildingSize*2 + this.buildingGap*3, 10, -this.worldSize/2 + this.buildingSize*5 + this.buildingGap*5.5);
  at = vec3(carX + this.buildingGap + this.buildingSize/2, 0, carZ + this.buildingGap + this.buildingSize/2);
  this.views.push( new View(eye, at, this.gl, this.program) );
  // low down map edge
  eye = vec3(0, 10, -this.worldSize/2);
  at = vec3(0, 0, 0);
  this.views.push( new View(eye, at, this.gl, this.program) );
  //
  this.views[0].send(this.gl);

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

  // setup view buttons
  document.getElementById("view1").onclick = ()=>this.setView(1);
  document.getElementById("view2").onclick = ()=>this.setView(2);
  document.getElementById("view3").onclick = ()=>this.setView(3);
  document.getElementById("view4").onclick = ()=>this.setView(4);
  document.getElementById("view5").onclick = ()=>this.setView(5);
  document.getElementById("view6").onclick = ()=>this.setView(6);
}

WebGLCity.prototype.setView = function(num){
  this.views[num-1].send(this.gl);
}

WebGLCity.prototype.run = function(){
	window.requestAnimFrame(this.run.bind(this), this.canvas);

  this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );

  this.car.render(this.gl, this.program);
  this.floor.render(this.gl, this.program);

  this.carPath.update(this.gl);
  
  for(var i = 0; i < this.buildings.length; ++i){
    this.buildings[i].render(this.gl, this.program);
  }
}

WebGLCity.prototype.placeBuildings = function(){
  for(var col = 0; col < 10; ++col){
    for(var row = 0; row < 10; ++row){
      let model = null;
      let rand = Math.random()*3;
      if(rand < 1){
        model = this.h1Model;
      } else if(rand < 2){
        model = this.h2Model;
      } else{
        model = this.h3Model;
      }

      let entity = new Entity(model, this.gl, this.program);
      entity.setSize(this.buildingSize);
      let xLoc = -this.worldSize/2 + this.buildingSize/2 + this.buildingGap + col*this.buildingGap + col*this.buildingSize;
      let yLoc = entity.height/2;
      if(model.name === "H3"){
        yLoc -= 10;
      }
      let zLoc = -this.worldSize/2 + this.buildingSize/2 + this.buildingGap + row*this.buildingGap + row*this.buildingSize; 
      entity.setLocation(xLoc, yLoc, zLoc);
      this.buildings.push(entity);
    }
  }
}
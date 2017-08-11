/*  ObjMesh
represents a model mesh from a .obj file.
***ATTRIBUTES***
// vertexPositions : Float[3]
// texturePositions : Float[2]
objects : []
minX : Float
maxX : Float
minY : Float
maxY : Float
minZ : Float
maxZ : Float
*/
function ObjMesh(fileName, vertexPositions, texturePositions){
	let modelStringData = loadFileAJAX(fileName);
  	if(!modelStringData){
    	alert("Could not retrieve model data: " + fileName);
		}
		
  	let lines = modelStringData.split("\n");
  	let tempVertexPositionList = [];
		let tempTexturePositionList = [];
		
  	// this.vertexPositions = [];
		// this.texturePositions = [];
		let startIndex = vertexPositions.length;
		
  	this.objects = [];
		let nextObject = null;
		
  	for(let lineId = 0; lineId < lines.length; ++lineId){
			let line = lines[lineId];
			let lineSplit = line.split(" ");
    	if(line[0] == 'v' && line[1] == ' '){
      		let newPos = [ parseFloat(lineSplit[1]), parseFloat(lineSplit[2]), parseFloat(lineSplit[3]) ];
      		tempVertexPositionList.push(newPos);
    	} else if(line[0] == 'f'){
      		// v, vt, vn
      		let v1 = lineSplit[1].split("/");
      		let v2 = lineSplit[2].split("/");
      		let v3 = lineSplit[3].split("/");
      		//
      		vertexPositions.push( tempVertexPositionList[ parseInt(v1[0])-1 ] );
      		vertexPositions.push( tempVertexPositionList[ parseInt(v2[0])-1 ] );
      		vertexPositions.push( tempVertexPositionList[ parseInt(v3[0])-1 ] );
      		texturePositions.push( tempTexturePositionList[ parseInt(v1[1])-1 ] );
      		texturePositions.push( tempTexturePositionList[ parseInt(v2[1])-1 ] );
      		texturePositions.push( tempTexturePositionList[ parseInt(v3[1])-1 ] );
    	} else if(line[0] == 'v' && line[1] == 't'){
      		tempTexturePositionList.push( [parseFloat(lineSplit[1]),parseFloat(lineSplit[2])] )
    	} else if(lineSplit[0] === "usemtl"){
    		let materialName = lineSplit[1];
    		nextObject = {};
  			nextObject.vertexPositions = [];
  			nextObject.texturePositions = [];
				nextObject.materialName = materialName;
				nextObject.startVertex = vertexPositions.length;
    	} else if(lines[lineId][0] =='o' && nextObject != null){
    		nextObject.vertexCount = vertexPositions.length - nextObject.startVertex;
    		this.objects.push(nextObject);
    	}
	}
	if(nextObject != null){
    	nextObject.vertexCount = vertexPositions.length - nextObject.startVertex;;
    	this.objects.push(nextObject);
	}
		
	let numIndices = vertexPositions.length;


	this.minX = this.maxX = vertexPositions[startIndex][0];
  this.minY = this.maxY = vertexPositions[startIndex][1];
  this.minZ = this.maxZ = vertexPositions[startIndex][2];
  for(let i = startIndex + 1; i < startIndex + numIndices; ++i){
    if(vertexPositions[i][0] < this.minX){
      this.minX = vertexPositions[i][0];
    } else if(vertexPositions[i][0] > this.maxX){
      this.maxX = vertexPositions[i][0];
    }
    if(vertexPositions[i][1] < this.minY){
      this.minY = vertexPositions[i][1];
    } else if(vertexPositions[i][1] > this.maxY){
      this.maxY = vertexPositions[i][1];
    }
    if(vertexPositions[i][2] < this.minZ){
      this.minZ = vertexPositions[i][2];
    } else if(vertexPositions[i][2] > this.maxZ){
      this.maxZ = vertexPositions[i][2];
    }
  }

}




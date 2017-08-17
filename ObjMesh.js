/*  ObjMesh
represents a model mesh from a .obj file.
***ATTRIBUTES***
objects : []
minX : Float
maxX : Float
minY : Float
maxY : Float
minZ : Float
maxZ : Float
relativeHeight : Float
relativeWidth : Float
relativeDepth : Float
*/
function ObjMesh(fileName, vertexPositions, texturePositions) {
	// retrieve file data
	let modelStringData = loadFileAJAX(fileName);
	if (!modelStringData) {
		alert("Could not retrieve model data: " + fileName);
	}

	let tempVertexPositions = [];
	let tempTexturePositions = [];
	this.objects = [];
	let object = null;
	let lines = modelStringData.split("\n");
	let startIndex = vertexPositions.length;
	
	// parse file data
	for(var i = 0; i < lines.length; ++i){
		let line = lines[i];
		let lineSplit = line.split(" ");
		if(lineSplit[0] == "v"){
			let pos = [ parseFloat(lineSplit[1]), parseFloat(lineSplit[2]), parseFloat(lineSplit[3]) ];
			tempVertexPositions.push(pos);
		} else if(lineSplit[0] == "vt"){
			let tex = [ parseFloat(lineSplit[1]), parseFloat(lineSplit[2]) ];
			tempTexturePositions.push(tex)
		} else if(lineSplit[0] == "f"){
			// v, vt, vn
			let v1 = lineSplit[1].split("/");
			let v2 = lineSplit[2].split("/");
			let v3 = lineSplit[3].split("/");
			//
			vertexPositions.push(tempVertexPositions[parseInt(v1[0]) - 1]);
			vertexPositions.push(tempVertexPositions[parseInt(v2[0]) - 1]);
			vertexPositions.push(tempVertexPositions[parseInt(v3[0]) - 1]);
			texturePositions.push(tempTexturePositions[parseInt(v1[1]) - 1]);
			texturePositions.push(tempTexturePositions[parseInt(v2[1]) - 1]);
			texturePositions.push(tempTexturePositions[parseInt(v3[1]) - 1]);
		} else if(lineSplit[0] == "usemtl"){
			if(object != null){
				// save curent object and start a new one
				object.numIndices = vertexPositions.length - object.startIndex;
				this.objects.push(object);
			}
			object = {};
			object.materialName = lineSplit[1];
			object.startIndex = vertexPositions.length;
			object.numIndices = 0;
		} else if(lineSplit[0] == "o"){

		}
	}
	if(object != null){
		// save curent object, end of file reached
		object.numIndices = vertexPositions.length - object.startIndex;
		this.objects.push(object);
	}
	
	// calculate min and max for each axis
	this.minX = this.maxX = vertexPositions[startIndex][0];
	this.minY = this.maxY = vertexPositions[startIndex][1];
	this.minZ = this.maxZ = vertexPositions[startIndex][2];
	let numVertices = vertexPositions.length;
	for (let i = startIndex + 1; i < numVertices; ++i) {
		if (vertexPositions[i][0] < this.minX) {
			this.minX = vertexPositions[i][0];
		} else if (vertexPositions[i][0] > this.maxX) {
			this.maxX = vertexPositions[i][0];
		}
		if (vertexPositions[i][1] < this.minY) {
			this.minY = vertexPositions[i][1];
		} else if (vertexPositions[i][1] > this.maxY) {
			this.maxY = vertexPositions[i][1];
		}
		if (vertexPositions[i][2] < this.minZ) {
			this.minZ = vertexPositions[i][2];
		} else if (vertexPositions[i][2] > this.maxZ) {
			this.maxZ = vertexPositions[i][2];
		}
	}

	// calculate relative height, width, and depth
	let h = this.maxY - this.minY;
	let w = this.maxX - this.minX;
	let d = this.maxZ - this.minZ;
	if (h > w && h > d) {
		this.relativeHeight = h / h;
		this.relativeWidth = w / h;
		this.relativeDepth = d / h;
	} else if (w > h && w > d) {
		this.relativeHeight = h / w;
		this.relativeWidth = w / w;
		this.relativeDepth = d / w;
	} else {
		this.relativeHeight = h / d;
		this.relativeWidth = w / d;
		this.relativeDepth = d / d;
	}
}




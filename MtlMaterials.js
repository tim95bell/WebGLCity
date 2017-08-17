/*  MtlMaterials
represents a list of materials from a .mtl file.
***ATTRIBUTES***
materials : Material[]
***METHODS***
getMaterial(name) : Material
*/
function MtlMaterials(fileName, gl){
	this.materials = [];
	let textures = [];
	let mtlStringData = loadFileAJAX(fileName);
  	if(!mtlStringData){
    	alert("Could not retrieve model data: " + fileName);
  	}
  	let lines = mtlStringData.split("\n");

  	let currentMaterialString = null;
  	let currentMaterial = null;
  	for(let lineId = 0; lineId < lines.length; ++lineId){
  		let line = lines[lineId];
  		let lineSplit = line.split(" ");
  		if(lineSplit[0] === "newmtl"){
  			if(currentMaterialString != null){
				  this.materials[currentMaterialString] = currentMaterial;
  			}
  			currentMaterialString = lineSplit[1];
  			currentMaterial = new Material();
  		} else if(lineSplit[0] === "Ns"){
  			currentMaterial.setNs( parseFloat(lineSplit[1]) );
  		} else if(lineSplit[0] === "Ka"){
  			let val = [
  				parseFloat(lineSplit[1]),
  				parseFloat(lineSplit[1]),
  				parseFloat(lineSplit[1])
  			];
  			currentMaterial.setKa( val );
  		} else if(lineSplit[0] === "Kd"){
  			let val = [
  				parseFloat(lineSplit[1]),
  				parseFloat(lineSplit[1]),
  				parseFloat(lineSplit[1])
  			];
  			currentMaterial.setKd( val );
  		} else if(lineSplit[0] === "Ks"){
  			let val = [
  				parseFloat(lineSplit[1]),
  				parseFloat(lineSplit[1]),
  				parseFloat(lineSplit[1])
  			];
  			currentMaterial.setKs( val );
  		} else if(lineSplit[0] === "Ni"){
  			let val = [
  				parseFloat(lineSplit[1]),
  				parseFloat(lineSplit[1]),
  				parseFloat(lineSplit[1])
  			];
  			currentMaterial.setNi( val );
  		} else if(lineSplit[0] === "d"){
  			currentMaterial.setD( parseFloat(lineSplit[1]) );
  		} else if(lineSplit[0] === "illum"){
  			currentMaterial.setIllum( parseInt(lineSplit[1]) );
  		} else if(lineSplit[0] === "map_Kd"){
  			let textureString = lineSplit[1];
  			if(textures[textureString] == null){
  				textures[textureString] = new TgaTexture("Assets/textures/"+textureString, gl);
			  }
  			currentMaterial.setTexture( textures[textureString] );
  		} 
  	}
  	if(currentMaterialString != null){
		  this.materials[currentMaterialString] = currentMaterial;
  	}
}

MtlMaterials.prototype.getMaterial = function(name){
	return this.materials[name];
}
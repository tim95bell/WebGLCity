/*  Model
represents a model, including the mesh and materials.
***ATTRIBUTES***
mesh : ObjMesh
materials : MtlMaterials
name : string
*/
function Model(objFile, mtlFile, gl, vertexPositions, texturePositions){
	this.mesh = new ObjMesh(objFile, vertexPositions, texturePositions);
	this.materials = new MtlMaterials(mtlFile, gl);
	
	let pathSplit = objFile.split("/");
	this.name = pathSplit[pathSplit.length-1].split(".")[0];
}

Model.prototype.render = function(gl, program){
	// Draw normal objects
	if(this.name !== "car"){
		for(var i = 0; i < this.mesh.objects.length; ++i){
			let obj = this.mesh.objects[i];
			let materialName = obj.materialName;
			let material = this.materials.getMaterial(materialName);
			if(material.texture.id != null){
				gl.activeTexture( gl.TEXTURE0);
				gl.bindTexture( gl.TEXTURE_2D, material.texture.id);
				gl.drawArrays( gl.TRIANGLES, obj.startIndex, obj.numIndices );
			}
		}
	} 
	// Draw car, needs special attention because of color change
	else {
		for(var i = 0; i < this.mesh.objects.length; ++i){
			let obj = this.mesh.objects[i];
			let materialName = obj.materialName;
			let material = this.materials.getMaterial(materialName);
			if(	materialName === "FrontColorNoCulling" || 
				materialName === "material0" || materialName === "material1" ){
				gl.uniform1i(gl.getUniformLocation(program, "useColorBlend"), 1);
				if(material.texture.id != null){
					gl.activeTexture( gl.TEXTURE0);
					gl.bindTexture( gl.TEXTURE_2D, material.texture.id);
					gl.drawArrays( gl.TRIANGLES, obj.startIndex, obj.numIndices );
				}
				gl.uniform1i(gl.getUniformLocation(program, "useColorBlend"), 0);
			} else{
				if(material.texture.id != null){
					gl.activeTexture( gl.TEXTURE0);
					gl.bindTexture( gl.TEXTURE_2D, material.texture.id);
					gl.drawArrays( gl.TRIANGLES, obj.startIndex, obj.numIndices );
				}
			}
		}
	}

}
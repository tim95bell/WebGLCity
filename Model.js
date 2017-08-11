/*  Model
represents a model, including the mesh and materials.
***ATTRIBUTES***
mesh : ObjMesh
materials : MtlMaterials
*/
function Model(objFile, mtlFile, gl, vertexPositions, texturePositions){
	this.mesh = new ObjMesh(objFile, vertexPositions, texturePositions);
	this.materials = new MtlMaterials(mtlFile, gl);
}

Model.prototype.render = function(gl, program){
	let obj = this.mesh.objects[0];
	let materialName = obj.materialName;
	let mtl = this.materials.materials[materialName];

	for(var i = 0; i < this.mesh.objects.length; ++i){
		let obj = this.mesh.objects[i];
		let materialName = obj.materialName;
		let material = this.materials.getMaterial(materialName);
		if(material.texture.id != null){
			gl.activeTexture( gl.TEXTURE0);
			gl.bindTexture( gl.TEXTURE_2D, material.texture.id);
			gl.drawArrays( gl.TRIANGLES, obj.startVertex, obj.vertexCount );
		}
	}

}
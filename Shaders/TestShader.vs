
attribute vec3 aPosition;
attribute vec2 aTextureCoordinate;
varying vec2 vTextureCoordinate;
uniform mat4 modelMatrix;
uniform mat4 worldMatrix;
//uniform mat4 projMatrix;
//uniform mat4 viewMatrix;

void main()
{
	vTextureCoordinate = aTextureCoordinate;
	//gl_Position =    projMatrix * viewMatrix * worldMatrix * modelMatrix * vec4(aPosition, 1.0);
	gl_Position =    worldMatrix * modelMatrix * vec4(aPosition, 1.0);
	//gl_Position = vec4(aPosition, 1.0);
}

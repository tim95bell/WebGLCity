
precision mediump float;
varying vec2 vTextureCoordinate;
uniform sampler2D myTexture;

void main()
{
  vec4 color = texture2D(myTexture, vTextureCoordinate);
  //if(color.r == 227.0/255.0 && color.g == 39.0/255.0 && color.b == 229.0/255.0){
  //	color = vec4(0.0, 0.0, 0.0, 0.0);
  //}
  gl_FragColor = color;
  //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}

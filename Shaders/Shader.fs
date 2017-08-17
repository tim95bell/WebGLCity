
precision mediump float;
varying vec2 vTextureCoordinate;
uniform sampler2D myTexture;
uniform vec3 colorBlend;
uniform int useColorBlend;

void main()
{
  vec4 color = texture2D(myTexture, vTextureCoordinate);
  if(useColorBlend == 1){
    gl_FragColor = vec4(colorBlend.r, colorBlend.g, colorBlend.b, color.a);
  } else {
    gl_FragColor = color;
  }
}

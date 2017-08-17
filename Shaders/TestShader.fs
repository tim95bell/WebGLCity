
precision mediump float;
varying vec2 vTextureCoordinate;
uniform sampler2D myTexture;

void main()
{
  vec4 color = texture2D(myTexture, vTextureCoordinate);
  gl_FragColor = vec4(color.r, color.g * 30, color.b, color.a);
}

/*  TgaTexture
represents and sets up a texture from a .tga file.
***ATTRIBUTES***
id
*/
function TgaTexture(fileName, gl){
	this.id = null;

	let httpRequest = null;
	if(window.XMLHttpRequest){
		httpRequest = new XMLHttpRequest();
	}

	if(httpRequest != null){
		httpRequest.open("GET", fileName, true);
    httpRequest.responseType = "arraybuffer";
    httpRequest.parser = this;
		httpRequest.onreadystatechange = function(){
			if(httpRequest.readyState == 4 && httpRequest.status == 200){
				httpRequest.parser.parseTGAFile(httpRequest.response, gl);
			}
		}
		httpRequest.send();
	} else {
		window.alert("Error createing XMLHttpRequest object while loading .tga file");
	}
}


TgaTexture.prototype.parseTGAFile = function(binaryData, gl){
	if(!binaryData){
    alert("Error no TGA file data loaded");
    return;
  }
  let binaryDataUint8Array = new Uint8Array(binaryData);
  let pixelDepth = binaryDataUint8Array[16];
  let height = (binaryDataUint8Array[15]<<8) + binaryDataUint8Array[14];
  let width = (binaryDataUint8Array[13]<<8) + binaryDataUint8Array[12];

  this.id = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, this.id);

  // reformat from bgr to rgb
  for(let i = 18; i < binaryDataUint8Array.length; i+=3){
    let tempR = binaryDataUint8Array[i];
    binaryDataUint8Array[i] = binaryDataUint8Array[i+2];
    binaryDataUint8Array[i+2] = tempR;
  }

  //reformat to begin with image in 0 index
  for(let i = 0; i < binaryDataUint8Array.length-18; ++i){
    binaryDataUint8Array[i] = binaryDataUint8Array[i+18];
  }
  binaryDataUint8Array.length = binaryDataUint8Array.length-18;

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, binaryDataUint8Array);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
}
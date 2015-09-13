function tagToVector3(tag){
	vect = new THREE.Vector3();
	x = parseFloat(tag.getAttribute('x'));
	y = parseFloat(tag.getAttribute('y'));
	z = parseFloat(tag.getAttribute('z'));
	vect.set(x,y,z);
	return vect
}

function loadPixelsFromXML(xmlPath){

  pixelsList = [];

  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.open("GET",xmlPath,false);
  xmlhttp.send();
  xmlDoc=xmlhttp.responseXML;
  
  console.log(xmlDoc);

  pixelsDoc = xmlDoc.getElementsByTagName("Pixel")
  for (var i = 0; i < pixelsDoc.length; i++) {
    
    pixel = pixelsDoc[i]
    R = parseInt(pixel.getAttribute('r'))
    G = parseInt(pixel.getAttribute('g'))
    B = parseInt(pixel.getAttribute('b'))

    color = (R << 16) | (G << 8) | B;
    
    renderTag = pixel.getElementsByTagName('Render')[0]

    objectModelName = renderTag.getAttribute('mesh')
    
    frontTag = renderTag.getElementsByTagName('Front')[0]
    upTag = renderTag.getElementsByTagName('Up')[0]
    positionTag = renderTag.getElementsByTagName('Position')[0]
    
    front = tagToVector3(frontTag);
    up = tagToVector3(upTag);
    position = tagToVector3(positionTag);

    pixelsList.push(addObject(objectModelName + '100.obj',position,up,front,color));

  };

  return pixelsList;
}
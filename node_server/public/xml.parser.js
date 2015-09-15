function tagToVector3(tag){
	vect = new THREE.Vector3();
	x = parseFloat(tag.getAttribute('x'));
	y = parseFloat(tag.getAttribute('y'));
	z = parseFloat(tag.getAttribute('z'));
	vect.set(x,y,z);
	return vect
}

function loadPixelsFromXML(xmlPath, callBack){

  var pixelsList = [];

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
  var xmlDoc=xmlhttp.responseXML;
  
  console.log(xmlDoc);

  var pixelsDoc = xmlDoc.getElementsByTagName("Pixel")
  var pixelsQty = pixelsDoc.length

  var loaderFunction = function(object){
  	pixelsList.push(object);
  	console.log("adding pixel...");
  	if (pixelsList.length == pixelsQty){
  		console.log("calling callback");
  		callBack(pixelsList);
  	}
  }

  for (var i = 0; i < pixelsDoc.length; i++) {
    
    var pixel = pixelsDoc[i]
    var R = parseInt(pixel.getAttribute('r'))
    var G = parseInt(pixel.getAttribute('g'))
    var B = parseInt(pixel.getAttribute('b'))

    var color = (R << 16) | (G << 8) | B;
    
    var renderTag = pixel.getElementsByTagName('Render')[0]

    var objectModelName = renderTag.getAttribute('mesh')
    
    var frontTag = renderTag.getElementsByTagName('Front')[0]
    var upTag = renderTag.getElementsByTagName('Up')[0]
    var positionTag = renderTag.getElementsByTagName('Position')[0]
    
    var front = tagToVector3(frontTag);
    var up = tagToVector3(upTag);
    var position = tagToVector3(positionTag);

    addObject(objectModelName + '100.obj',position,up,front,color,loaderFunction);

  };

}
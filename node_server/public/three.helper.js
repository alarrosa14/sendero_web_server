var container, stats;

var camera, controls, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function initThree() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 100;

    // orbits
    controls = new THREE.OrbitControls( camera );
    controls.damping = 0.2;
    controls.addEventListener( 'change', render );

    // scene

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight( 0x404040 );
    scene.add( ambient );

    // var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    // directionalLight.position.set( 0, 0, 1 );
    // scene.add( directionalLight );


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild( stats.domElement );

    // document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function changePixelColor(object,r,g,b){

	colorRGB = (r << 16) | (g << 8) | b;
	// object.material.color.setHex(colorRGB);
	object.traverse( function ( child ) {

	    if ( child instanceof THREE.Mesh ) {

	      // child.material.map = texture;
	      var material = new THREE.MeshBasicMaterial( { color: colorRGB } );
	      child.material = material;

	    }
	});
}

function addObject(objModel, position, up, front, RGBColor, objectGetter){

	var onProgress = function ( xhr ) {
	  if ( xhr.lengthComputable ) {
	    var percentComplete = xhr.loaded / xhr.total * 100;
	    console.log( Math.round(percentComplete, 2) + '% downloaded' );
	  }
	};

	var onError = function ( xhr ) {
	};

	var manager = new THREE.LoadingManager();

	manager.onProgress = function ( item, loaded, total ) {

	  console.log( item, loaded, total );

	};

	var loader = new THREE.OBJLoader( manager );

	/////////////////////////////////////
	var obj;
	loader.load( objModel , function ( object ) {

	  object.traverse( function ( child ) {

	    if ( child instanceof THREE.Mesh ) {

	      var material = new THREE.MeshBasicMaterial( { color: RGBColor } );
	      child.material = material;

	    }

	  } );

	  object.position.set(position.x,position.y,position.z);
	  object.up = up;
	  object.lookAt(front);

	  console.log('en addObj object: ' + object);
	  obj = object;
	  console.log('en addObj inside: ' + obj);
	  
	  scene.add( object );

	  objectGetter(object);
	}, onProgress, onError );

	console.log('en addObj: ' + obj);
	/////////////////////////////////////////
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;

}

  //

function animate() {

    requestAnimationFrame( animate );
    controls.update();

}

function render() {

    renderer.render( scene, camera );
    stats.update();

}
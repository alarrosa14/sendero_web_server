var container, stats;

var camera, controls, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function initThree() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor( 0x212121, 1);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  element = renderer.domElement;
  container = document.getElementById( 'container' );
  container.appendChild( element );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 300;

  // orbits
  controls = new THREE.OrbitControls(camera, element);
  /*controls.target.set(
    camera.position.x + 0.1,
    camera.position.y,
    camera.position.z
  );*/
  controls.noZoom = true;
  controls.noPan = true;

  controls.addEventListener( 'change', render );

  // scene

  scene = new THREE.Scene();

  var ambient = new THREE.AmbientLight( 0x404040 );
  scene.add( ambient );

  // var directionalLight = new THREE.DirectionalLight( 0xffeedd );
  // directionalLight.position.set( 0, 0, 1 );
  // scene.add( directionalLight );




  // document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  document.addEventListener( 'touchmove', onDocumentTouchMove, false );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function changePixelColor(object,r,g,b){

  colorRGB = (r << 16) | (g << 8) | b;
  // object.material.color.setHex(colorRGB);
  object.traverse( function ( child ) {

    if ( child instanceof THREE.Mesh ) {

      child.material.color.set(colorRGB);
      // child.material.map = texture;

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
  loader.load( objModel , function ( objectSrc ) {

    var object = objectSrc.clone();

    object.traverse( function ( child ) {

      if ( child instanceof THREE.Mesh ) {

        var material = new THREE.MeshBasicMaterial( { color: RGBColor, side : THREE.DoubleSide } );
        child.material = material;

      }

    } );

    front = front.normalize();
    up = up.normalize();

    var rotFront = new THREE.Matrix4();

    var qFront = new THREE.Quaternion();
    qFront.setFromUnitVectors(new THREE.Vector3(1,0,0),front);

    var newSourceUp = new THREE.Vector3(0,0,1); // hardcoded

    var qUp = new THREE.Quaternion();
    qUp.setFromUnitVectors(newSourceUp,up);

    var qTot = qFront;
    
    object.setRotationFromQuaternion(qTot);
    
    object.position.set(position.x*1.1,position.y*1.1,position.z*1.1);
    
    scene.add( object );

    objectGetter(object);
  }, onProgress, onError );

  /////////////////////////////////////////
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}


function onDocumentTouchMove(ev) {

  if (ev.targetTouches.length == 2) {   
    server.emit('log', ev);
    console.log("EL TOUCH", ev);
  }

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

}
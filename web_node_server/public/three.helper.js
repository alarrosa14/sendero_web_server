var container, stats;
var camera, controls, scene, renderer;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

/*** Intersection ***/
var raycaster;
var mouse;
var intersectionSphere;

var interaction_server = io.connect('localhost:8080');

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

  renderer = new THREE.WebGLRenderer({ antialias: true, precision: 'highp', alpha: true });
  renderer.setClearColor( 0x212121, 1);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 100;

  var material = new THREE.MeshBasicMaterial( {transparent: true, opacity: 0.0} );
  intersectionSphere = new THREE.Mesh( new THREE.SphereGeometry( 75, 10, 10 ), material );
  intersectionSphere.position.set(0, 0, 0);
  scene.add( intersectionSphere );

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  document.addEventListener( 'mousemove', onDocumentMouseDown, false );

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

function addObject(objModel, position, up, front, RGBColor, ID, objectGetter){

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
    
    object.position.set(position.x,position.y,position.z);
    
    scene.add( object );

    object.pixelId = ID;
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

var shouldSend = true;
function onDocumentMouseDown( event ) {
  event.preventDefault();

  if (shouldSend){
    mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var objects_intersect = [];
    objects_intersect.push(intersectionSphere);
    var intersects = raycaster.intersectObjects( objects_intersect, true );

    if ( intersects.length > 0 ) {
      interaction_server.emit('interaction', (intersects[0].point.x).toString() + ',' + (intersects[0].point.y).toString() + ',' + (intersects[0].point.z).toString());
    }

    shouldSend = false;

    setTimeout(function(){
      shouldSend = true;
    },1000/24);
  }

}

function animate() {

  requestAnimationFrame( animate );
  controls.update();
}

function render() {

  renderer.render( scene, camera );
  stats.update();
}
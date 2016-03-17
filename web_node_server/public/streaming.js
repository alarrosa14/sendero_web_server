/**
  *
  * Steraming
  * Module to manage the data streaming.
  * Author: dernster, alarrosa14, kitab15.
  */

var Streaming = function(){

	// ###########################################################
    // Private
    // ###########################################################

	var streaming_server;
	var buffer = [];

	// ###########################################################
    // Public Methods
    // ###########################################################

	function init(streaming_server_url){
		console.log(this);
		streaming_server = io.connect(streaming_server_url);
	};

	function receive(){
		streaming_server.on('frame', function(frame){

			buffer.push(frame);
		});
	};

	function play(pixels){
		setInterval(function(){

			var frame = buffer.pop();

			ThreeHelper.update(frame, pixels);
			ThreeHelper.render();
		}, 1100);
	};

	// ###########################################################
    // Three Helper
    // ###########################################################

    var oPublic = {
      init: init,
      receive: receive,
      play: play,
    };
    return oPublic;

}();
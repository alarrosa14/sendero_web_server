var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');
var path = require('path');
var queue = require('amqplib/callback_api');

app.use(express.static(path.join(__dirname, 'public')));

require('socket.io-stream')(io);

/***********************************************/
/***************** MAIN ************************/
/***********************************************/


io.on('connection', function(client){

	console.log("Connected client...");

	setInterval(function() {
		console.log('Emit');
		client.emit('frame', [parseInt(Math.random()*255),parseInt(Math.random()*255),parseInt(Math.random()*255),0,0,0,0,0,0]);
		var d = new Date();
		var n = d.getMilliseconds();
		console.log("Millis " + n);
	}, 1000/24);

});

server.listen(8080);
console.log("listening in 8080...");
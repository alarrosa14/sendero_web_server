var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

require('socket.io-stream')(io);

io.on('connection', function(client){
  console.log("Connected client... NUEVO");
  console.log("EL CLIENTE: ", client);
  client.on('sendFrame', function(data){
    client.broadcast.emit('frame', data);
  });
});

app.get('/', function(req, res){
  console.log("GETTING!");
  res.sendFile(__dirname + '/views/index.html');
});

server.listen(8080);
console.log("listening in 8080...");
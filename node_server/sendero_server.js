var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');
var path = require('path');
require('socket.io-stream')(io);

io.on('connection', function(client){
  console.log("Connected client... ");
  client.on('file_upload', function(data){
    console.log(data);
    var writable = fs.createWriteStream('elarchivo.jpg');
    writable.write(data);
    writable.end();
  });
});

app.get('/', function(req, res){
  console.log("GETTING!");
  res.sendFile(__dirname + '/views/index.html');
});

server.listen(8080);
console.log("listening in 8080...")
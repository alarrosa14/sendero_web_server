var socket = io();

var myRequest = new XMLHttpRequest();

myRequest.open(
   'POST',
   'http://localhost:5002',
   false
   );

myRequest.send("<?xml version=\"1.0\" ?><ConfigurationRequest installationName='Celebra1' clientName='CelebraClient'></ConfigurationRequest>");

myRequest.responseText;

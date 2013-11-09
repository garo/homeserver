#!/opt/node/bin/node

var homeserver = require('./lib/homeserver');

homeserver.start(function (err) {
  console.log("Homeserver started");
});
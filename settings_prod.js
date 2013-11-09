var homeserver = require('./lib/homeserver');

var settings = {};

settings.mysql = {
};

settings.statefile = '/state/homeserver.state.json';

settings.energypump = {
  athomerelaypin : 0
};

settings.alarms = {
  "0" : { name : "Olohuone", triggeron : "low", extracheck : motionSensorCheck },
  "1" : { name : "Apukeittiš", triggeron : "low", extracheck : motionSensorCheck },
  "2" : { name : "Eteinen", triggeron : "low", extracheck : motionSensorCheck },
  "3" : { name : "Parvi", triggeron : "low", extracheck : motionSensorCheck },
  "4" : { name : "Energiapumppu", triggeron : "high" }
};

// Business logic: Don't alert on motion sensors when we're at home
function motionSensorCheck(alarm, cb) {
  homeserver.services.energypump.getAtHomeState(function (err, athome) {
    if (athome) {
      // Dont alert on motion sensors when we're at home
      cb(null, false);
    } else {
      cb(null, true);
    }
  });
}

exports.get = function (key) {
  return settings[key];
};

var homeserver = require('./lib/homeserver');


var settings = {};

settings.mysql = {

};

settings.statefile = 'test.state.json';

settings.energypump = {
  athomerelaypin : 1
};

settings.zabbix = {
  host : "172.16.140.22"
};

settings.alarms = {
  "0" : { name : "Olohuone", triggeron : "low", extracheck : motionSensorCheck, zabbix_key : "alarms.olohuone" },
  "1" : { name : "Parvi", triggeron : "low", extracheck : motionSensorCheck,zabbix_key : "alarms.parvi"  },
  "2" : { name : "Eteinen", triggeron : "low", extracheck : motionSensorCheck, zabbix_key : "alarms.eteinen"  },
  "3" : { name : "Apukeittiš", triggeron : "low", extracheck : motionSensorCheck, zabbix_key : "alarms.apukeittio"  },
  "4" : { name : "Energiapumppu", triggeron : "high", zabbix_key : "alarms.energiapumppu"  }
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

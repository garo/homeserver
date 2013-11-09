/*jslint bitwise: true*/

var homeserver = require('../homeserver');

var zabbix = new (require('zabbix-sender'))({

});

exports.init = function (cb) {
  setInterval(exports.checkAlarms, 1000);
  cb();
};

var alarmStates = {};

exports.checkAlarms = function () {
  var inputs = homeserver.drivers.piface.readInputs();
  var alarmChecks = homeserver.settings.get("alarms");
  for (var pin in alarmChecks) {
    if (alarmChecks.hasOwnProperty(pin)) {
      var check = alarmChecks[pin];

      if (((inputs) & (1 << (pin))) && alarmChecks[pin].triggeron === "high") {
        if (alarmStates[pin] !== 1) {
          alarmStates[pin] = 1;
          exports.processAlarm(check);
        }
      } else if (((inputs) & (1 << (pin))) === 0 && alarmChecks[pin].triggeron === "low") {
        if (alarmStates[pin] !== 1) {
          alarmStates[pin] = 1;
          exports.processAlarm(check);
        }
      } else {
        if (alarmStates[pin] !== 0) {
          exports.clearAlarm(check);
        }
        alarmStates[pin] = 0;
      }
    }
  }
};

/**
 * Does extra check on alarm conditions
 * @param alarm
 */
exports.processAlarm = function (alarm) {
  if (alarm.extracheck) {
    alarm.extracheck(alarm, function (err, allowAlarm) {
      if (allowAlarm) {
        exports.triggerAlarm(alarm);
      }
    });
  } else {
    exports.triggerAlarm(alarm);
  }

};

/**
 * We have alarm. Log it, send email etc
 *
 * @param alarm
 */
exports.triggerAlarm = function (alarm) {
  var ts = new Date();
  console.warn(ts.toISOString() + " Alarm on ", alarm);

  if (alarm.zabbix_key) {
    var obj = {
      alarm : {}
    };
    obj.alarm[alarm.zabbix_key] = 1;
    zabbix.send(obj);
  }

};

/**
 * Clear alarm
 */
exports.clearAlarm = function (alarm) {
  var ts = new Date();
  console.warn(ts.toISOString() + " Alarm off ", alarm);

  if (alarm.zabbix_key) {
    var obj = {
      alarm : {}
    };
    obj.alarm[alarm.zabbix_key] = 0;
    zabbix.send(obj);
  }
};

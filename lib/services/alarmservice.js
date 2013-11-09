/*jslint bitwise: true*/

var homeserver = require('../homeserver');
var exec = require('child_process').execFile;
var os = require('os');

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
          exports.clearAlarm(check, pin);
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
  console.warn(ts.toISOString() + " Alarm on ", alarm.name);

  if (alarm.zabbix_key) {
    exec('zabbix_sender', ['-s', os.hostname(), '-c', '/etc/zabbix/zabbix_agentd.conf', '-k', alarm.zabbix_key, '-o', 1], function (err) {
      if (err) {
        console.error("Err on zabbix_sender", err);
      }
    });
  }

};

/**
 * Clear alarm
 */
exports.clearAlarm = function (alarm, pin) {
  var ts = new Date();
  console.warn(ts.toISOString() + " Alarm off ", alarm.name, "old state was", alarmStates[pin]);

  if (alarm.zabbix_key) {
    exec('zabbix_sender', ['-s', os.hostname(), '-c', '/etc/zabbix/zabbix_agentd.conf', '-k', alarm.zabbix_key, '-o', 0], function (err) {
      if (err) {
        console.error("Err on zabbix_sender", err);
      }
    });
  }
};

/*jslint bitwise: true */
/*jslint -W083 */

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

      // Check if we have a pin state showing an alarm
      if ((((inputs) & (1 << (pin))) && alarmChecks[pin].triggeron === "high") ||
          (((inputs) & (1 << (pin))) === 0 && alarmChecks[pin].triggeron === "low")) {

        // Then check if we already have triggered this alarm
        if (alarmStates[pin] !== 1) {

          // Then check if we have an extra check in place
          if (check.extracheck) {
            check.extracheck(check, function (err, allowAlarm) {
              if (allowAlarm) {
                alarmStates[pin] = 1;
                exports.processAlarm(check);
              }
            });

          } else {
            // No extra check, go ahead an trigger the alarm
            alarmStates[pin] = 1;
            exports.processAlarm(check);
          }
        }

      } else {
        // Pin state shows no alarm. Check if there was alarm previously
        // and then clear it if there was one.
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

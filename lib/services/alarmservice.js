/*jslint bitwise: true*/

var homeserver = require('../homeserver');

exports.init = function (cb) {
  setInterval(exports.checkAlarms, 1000);
  cb();
};

exports.checkAlarms = function () {
  var inputs = homeserver.drivers.piface.readInputs();
  var alarmChecks = homeserver.settings.get("alarms");
  for (var pin in alarmChecks) {
    if (alarmChecks.hasOwnProperty(pin)) {
      var check = alarmChecks[pin];

      if (((inputs) & (1 << (pin))) && alarmChecks[pin].triggeron === "high") {
        exports.processAlarm(check);
      } else if (((inputs) & (1 << (pin))) === 0 && alarmChecks[pin].triggeron === "low") {
        exports.processAlarm(check);
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
};

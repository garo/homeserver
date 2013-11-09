var async = require('async');


exports.repositories = require('./repositories');
exports.models = require('./models');
exports.services = require('./services');
exports.drivers = require('./drivers');

if (process.env.NODE_ENV === "prod") {
  exports.settings = require('../settings_prod');
} else {
  exports.settings = require('../settings_test');
}

exports.start = function (cb) {
  async.series([
    exports.drivers.piface.init,
    exports.services.energypump.init,
    exports.services.alarmservice.init,
    exports.services.restful.init,
  ], function (err) {
    cb(err);
  });
};



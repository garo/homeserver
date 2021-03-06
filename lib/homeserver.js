var async = require('async');


exports.repositories = require('./repositories');
exports.models = require('./models');
exports.services = require('./services');
exports.drivers = require('./drivers');

if (process.env.NODE_ENV === "prod") {
  console.log("Using production settings (NODE_ENV=prod)");
  exports.settings = require('../settings_prod');
} else {
  console.log("Using test settings (no NODE_ENV was set)");
  exports.settings = require('../settings_test');
}

exports.start = function (cb) {
  async.series([
      function (cb) {
        exports.repositories.state.getState(function (err, state) {
          console.log("Read state form file:", state);
          cb();
        });
      },
    exports.drivers.piface.init,
    exports.services.energypump.init,
    exports.services.alarmservice.init,
    exports.services.restful.init
  ], function (err) {
    cb(err);
  });
};



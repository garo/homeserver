var homeserver = require('../homeserver');
var fs = require('fs');

exports.getState = function (cb) {
  fs.readFile(homeserver.settings.get("statefile"), function (err, data) {
    if (err) {
      if (err.code == 'ENOENT') {
        console.log("No state file found");
        cb(null, {});
        return;
      } else {
        console.error("Error reading statefile", err);
        cb(err);
        return;
      }
    }

    var state = null;
    try {
      state = JSON.parse(data.toString());
    } catch (err) {
      cb(err);
      return;
    }

    cb(null, state);
  });
};


exports.get = function (key, cb) {
  exports.getState(function (err, state) {
    if (err) {
      cb(err);
      return;
    }

    if (!state) {
      cb("No state found");
      return;
    }

    cb(null, state[key]);
  });
};

exports.set = function (key, value, cb) {
  exports.getState(function (err, state) {
    if (err) {
      cb(err);
      return;
    }

    state[key] = value;
    var str = JSON.stringify(state);

    fs.writeFile(homeserver.settings.get("statefile") + ".tmp", str, function (err) {
      if (err) {
        console.error("Error when writing new state file", err);
        cb(err);
        return;
      }

      fs.renameSync(homeserver.settings.get("statefile") + ".tmp", homeserver.settings.get("statefile"));
      cb();

    });
  });
};

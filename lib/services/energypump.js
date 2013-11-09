var homeserver = require('../../lib/homeserver');

var previousState = null;

exports.init = function (cb) {

  // Verify that we have state or create new state from scratch
  exports.getState(function (err, state) {
    if (!state) {

      // default state
      previousState = state = {
        athome : true
      };
      console.warn("Energy pump had no previous state, created new default state:", state);

      homeserver.repositories.state.set("energypump", state, next);
    } else {
      previousState = state;
      next();
    }
  });

  function next() {
    exports.setAtHomeState(previousState.athome, function() {
      setInterval(exports.updateStateFromFileIfNeeded, 10000);
      console.log("Energypump service started");
      cb();
    });
  }

};

exports.updateStateFromFileIfNeeded = function() {
  exports.getState(function (err, state) {
    if (err) {
      console.error("Error", err);
      return;
    }

    if (state.athome !== previousState.athome) {
      console.log("Updating state from file");
      exports.setAtHomeState(state.athome, function(err) {
        if (err) {
          console.error(err);
        }
      });
    }

    previousState = state;
  });
};

exports.getState = function (cb) {
  homeserver.repositories.state.get("energypump", function (err, state) {
    cb(err, state);
  });
};

exports.setState = function (key, value, cb) {
  exports.getState(function (err, state) {
    state[key] = value;
    homeserver.repositories.state.set("energypump", state, function (err) {
      cb(err);
    });
  });
};

exports.setAtHomeState = function (atHome, cb) {
  var pin = homeserver.settings.get("energypump").athomerelaypin;
  if (atHome === true) {
    console.log("Setting energy pump home state: at home");
    homeserver.drivers.piface.on(pin, function () {
      exports.setState("athome", true, function (err) {
        if (err) {
          console.error("Error when writing state", err);
        }
        cb();
      });
    });
  } else {
    console.log("Setting energy pump home state: away from home");
    homeserver.drivers.piface.off(pin, function () {

      exports.setState("athome", false, function (err) {
        if (err) {
          console.error("Error when writing state", err);
        }
        cb();
      });
    });
  }

};

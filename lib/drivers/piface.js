/* jshint bitwise:false */

/**
 * Implements a very simple and naive driver for PiFace attachment board.
 *
 * Usage: first call .init() function when the program starts and then
 * call .on(pin number) or .off(pin number).
 *
 */

var homeserver = require('../homeserver');

var simplespi;
try {
  simplespi = require('simplespi');
} catch (err) {
  simplespi = {
    send:function () {
    }
  };
  console.warn("SimpleSPI not available, PiFace is not enabled");
}

var PIN_TO_BITMASK = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80];

var outputState = 0;

/**
 * Initializes the PiFace internal chip.
 * @param cb
 */
exports.init = function (cb) {
  simplespi.send("400a08");
  simplespi.send("401200");
  simplespi.send("400000");
  simplespi.send("4001ff");
  simplespi.send("400dff");

  homeserver.repositories.state.get("pifacestate", function (err, oldState) {
    if (oldState !== undefined) {
      outputState = oldState;
    } else {
      outputState = 0;
    }

    exports.flushOutputs();

    if (cb) {
        cb();
    }
  });

};

/**
 * Flushes interna outputState to the PiFace board via SPI
 */
exports.flushOutputs = function () {
  var hex = outputState.toString(16);
  if (hex.length === 1) {
    hex = "0" + hex;
  }
  var cmd = "4012" + hex;
//  console.log("flush cmd: ", cmd);
  simplespi.send(cmd);
};

/**
 * Sets output pin state
 *
 * PiFace has eight outputs. First two outputs are also connected
 * to relays.
 *
 * @param pin
 * @param newValue 0 for off, 1 for on
 */
exports.setOutput = function (pin, newValue, cb) {
  if (pin >= 0 && pin <= 7) {

    var oldOutputState = outputState;

    outputState = (newValue ? outputState | PIN_TO_BITMASK[pin]
        : outputState & (~PIN_TO_BITMASK[pin]));

    if (oldOutputState != outputState) {
      exports.flushOutputs();
      homeserver.repositories.state.set("pifacestate", outputState, function (err) {
        cb();
      });
    }

  } else {
    console.error("Invalid pin number (out of range):", pin);
    cb();
  }
};

exports.on = function (pin, cb) {
  this.setOutput(pin, 1, cb);
};

exports.off = function (pin, cb) {
  this.setOutput(pin, 0, cb);
};







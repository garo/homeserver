var assert = require('assert');
var sinon = require('sinon');
var piface = require('../../lib/drivers/piface');

describe('piface', function () {
  var pf;
  it("should have init", function () {
    assert.ok(piface.init);
  });

  it("should be able to turn relay on and off", function (done) {
    piface.on(1, function () {
      piface.off(1, function () {
        done();
      });
    });
  });

  it("should be able to read inpus", function () {
    var old = piface.simplespi.send;
    piface.simplespi.send = function() {
      return "0000AB";
    };

    var inputBits = piface.readInputs();

    // Inputs are low-bit-on, but the user doesn't need to know that
    assert.equal(84, inputBits);

    piface.simplespi.send = old;
  });
});

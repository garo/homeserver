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
      setTimeout(function () {
        piface.off(1, function () {
          piface.off(3, function () {
            piface.off(4, function () {
              done();

            });


          });

        });
      }, 200);

      piface.on(3, function () {
        piface.on(4, function() {});
      });

    });

  });

});
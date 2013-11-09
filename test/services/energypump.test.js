var assert = require('assert');
var sinon = require('sinon');
var homeserver = require('../../lib/homeserver');

describe('energypump', function () {
  it("should have .init function", function(done) {
    homeserver.services.energypump.init(function (err) {
      assert.ifError(err);
      done();
    });
  });


  describe("setAtHomeState", function() {
    it("should set correct piface pin to on", function (done) {
      var on = sinon.stub(homeserver.drivers.piface, "on", function (pin, cb) {
        assert.equal(pin, 1); // 1 is from settings_test
        cb();
      });
      var setState = sinon.stub(homeserver.repositories.state, "set", function (key, value, cb) {
        assert.equal(key, "energypump");
        assert.deepEqual(value, {athome:true});
        cb();
      });
      homeserver.services.energypump.setAtHomeState(true, function (err) {
        assert.ok(on.called);
        on.restore();
        assert.ok(setState.called);
        setState.restore();
        done();
      });
    });

    it("should set correct piface pin to off", function (done) {
      var off = sinon.stub(homeserver.drivers.piface, "off", function (pin, cb) {
        assert.equal(pin, 1); // 1 is from settings_test
        cb();
      });
      var setState = sinon.stub(homeserver.repositories.state, "set", function (key, value, cb) {
        assert.equal(key, "energypump");
        assert.deepEqual(value, {athome:false});
        cb();
      });
      homeserver.services.energypump.setAtHomeState(false, function (err) {
        assert.ok(off.called);
        off.restore();
        assert.ok(setState.called);
        setState.restore();
        done();
      });
    });
  });
});
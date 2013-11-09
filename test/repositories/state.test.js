var assert = require('assert');
var sinon = require('sinon');
var homeserver = require('../../lib/homeserver');

describe('state', function () {
  describe("get", function () {
    it("should get state from file", function (done) {
      homeserver.repositories.state.get("teststate", function (err, value) {
        assert.ifError(err);
        assert.equal("foobar", value);
        done();
      });
    });
  });

  describe("set", function () {
    it("should save state to file", function (done) {
      homeserver.repositories.state.set("newkey", "yay", function (err) {
        assert.ifError(err);
        homeserver.repositories.state.get("newkey", function (err, value) {
          assert.ifError(err);
          assert.equal("yay", value);
          done();
        });
      });

    });
  });
});
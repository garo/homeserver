var assert = require('assert');
var sinon = require('sinon');
var homeserver = require('../../lib/homeserver');

describe('restful', function () {
  it("should have .init function", function(done) {
    homeserver.services.restful.init(function (err) {
      assert.ifError(err);
      homeserver.services.restful.deinit(done);
    });
  });

});
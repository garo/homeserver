var assert = require('assert');
var sinon = require('sinon');
var homeserver = require('../../../lib/homeserver');

describe('resource:energypump', function () {
  it("should have .index function", function() {
    assert.ok(homeserver.services.resources.energypump.index);
  });
});

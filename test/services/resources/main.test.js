var assert = require('assert');
var sinon = require('sinon');
var homeserver = require('../../../lib/homeserver');

describe('resource:main', function () {
  it("should have .index function", function() {
    assert.ok(homeserver.services.resources.main.index);
  });
});

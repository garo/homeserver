var assert = require('assert');
var sinon = require('sinon');
var homeserver = require('../../lib/homeserver');

describe('energypump', function () {
  it("should have .init function", function (done) {
    homeserver.services.alarmservice.init(function (err) {
      assert.ifError(err);
      done();
    });
  });

  describe("checkAlarms", function () {
    it("should get input bits from piface and check for alarms", function () {
      var readInputs = sinon.stub(homeserver.drivers.piface, "readInputs", function () {
        return 0xff;
      });

      var settingsGet = sinon.stub(homeserver.settings, "get", function (key) {
        assert.equal(key, "alarms");
        return {
          "0":{ name:"Olohuone", triggeron:"low" },
          "1":{ name:"Apukeittiš", triggeron:"low" },
          "2":{ name:"Eteinen", triggeron:"low" },
          "3":{ name:"Parvi", triggeron:"low" },
          "4":{ name:"Energiapumppu", triggeron:"high" }
        };
      });

      var triggerAlarm = sinon.stub(homeserver.services.alarmservice, "triggerAlarm", function (alarm) {
        assert.equal("Energiapumppu", alarm.name);
      });

      homeserver.services.alarmservice.checkAlarms();

      assert.ok(readInputs.called);
      assert.ok(settingsGet.called);
      assert.ok(triggerAlarm.called);
      readInputs.restore();
      settingsGet.restore();
      triggerAlarm.restore();
    });
  });

});
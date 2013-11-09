var homeserver = require('../../homeserver');

exports.index = function(req, res) {
  homeserver.services.energypump.getState(function (err, state) {
    res.send(state);
  });
};

exports.update = function(req, res) {

  console.log("update something", req);
  res.end();
};

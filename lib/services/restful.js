var homeserver = require('../homeserver');

var express = require('express');
var resource = require('express-resource');

exports.resources = {};

exports.init = function(cb) {

  exports.app = express();

  /*
  var main = app.resource(require('./controllers/main'));
  var forums = app.resource('forums', require('./controllers/forum'));
  var threads = app.resource('threads', require('./controllers/thread'));
  forums.add(threads);
   */
  exports.app.use(express.bodyParser());

  exports.resources.main = exports.app.resource(homeserver.services.resources.main);
  exports.resources.energypump = exports.app.resource('energypump', homeserver.services.resources.energypump);
  exports.app.use(function (err, req, res, next) {
      res.json({error: err.message}, err.code ? err.code : 500);
    });

  exports.server = exports.app.listen(3000);
  console.log('Listening on :3000');
  cb();
};

exports.deinit = function(cb) {
  if (exports.server) {
    exports.server.close(cb);
  } else {
    cb();
  }

};



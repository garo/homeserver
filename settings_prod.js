var settings = {};

settings.mysql = {
};

settings.statefile = '/state/homeserver.state.json';

settings.energypump = {
  athomerelaypin : 0
};

exports.get = function (key) {
  return settings[key];
};

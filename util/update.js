'use strict';


var updateNotifier = require('update-notifier');
var pkg = require('../package.json');

module.exports = function update() {
  var notifier = updateNotifier({
    updateCheckInterval: 1000 * 60 * 60 * 24, // 1 day
    pkg: pkg
  });

  if (notifier.update) {
    notifier.notify();
  }
};

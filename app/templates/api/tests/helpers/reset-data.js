'use strict';

// Helpers rollbacking + migrating a fresh DB
//
// TODO:
// - Might need a way to recover from failures
// - faster way to resetdb ?
var spawn = require('child_process').spawn;

module.exports = function (next) {

  var knexRollback = spawn('npm', ['run', 'resetdb']);

  // Log errors of spawn process
  knexRollback.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  knexRollback.on('close', function () {
    next();
  });

};

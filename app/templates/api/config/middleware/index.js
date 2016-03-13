'use strict';

/**
  Export all the middlewares from the dir

*/

const path = require('path');
const fs = require('fs');
const middleware = {};

fs.readdirSync(__dirname).forEach(function (file) {
  if (path.extname(file) === '.js') {
    let cleanFile = path.basename(file, '.js');
    const camelCaseFile = cleanFile[0].toLowerCase() + cleanFile.replace(/-([a-z])/g, function(a, b) {
      return b.toUpperCase();
    }).slice(1);
    middleware[camelCaseFile] = require(path.join(__dirname, file));
  }
});

module.exports = middleware;

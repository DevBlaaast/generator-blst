'use strict';

let _ = require('lodash');
// Config keys for all environments
let config = require('./config');
// Config keys for specifig environment
let envConfig = require('./' + process.env.NODE_ENV).config;
// Merge config files keys
let finalConfig = _.extend(config, envConfig);

module.exports = {
  config: finalConfig
};

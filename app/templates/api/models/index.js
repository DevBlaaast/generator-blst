'use strict';

let _ = require('lodash'),
  Promise = require('bluebird'),
  models;

models = {
  excludeFiles: ['_messages', 'basetoken.js', 'base.js', 'index.js'],

  // ### init
  // Scan all files in this directory and then require each one and cache
  // the objects exported onto this `models` object so that every other
  // module can safely access models without fear of introducing circular
  // dependency issues.
  // @returns {Promise}
  init() {

    // One off inclusion of Base file.
    this.Accesstoken = require('./accesstoken').Accesstoken;
    this.Accesstokens = require('./accesstoken').Accesstokens;
    this.Base = require('./base');
    this.Contract = require('./contract').Contract;
    this.Contracts = require('./contract').Contracts;
    this.Correction = require('./correction').Correction;
    this.Corrections = require('./correction').Corrections;
    this.Form = require('./form').Form;
    this.Forms = require('./form').Forms;
    this.Mark = require('./mark').Mark;
    this.Marks = require('./mark').Marks;
    this.Question = require('./question').Question;
    this.Questions = require('./question').Questions;
    this.Refreshtoken = require('./refreshtoken').Refreshtoken;
    this.Refreshtokens = require('./refreshtoken').Refreshtokens;
    this.User = require('./user').User;
    this.Users = require('./user').Users;
  }
};

module.exports = models;

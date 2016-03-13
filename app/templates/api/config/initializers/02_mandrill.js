'use strict';

/**
  Email initializer

*/

let mandrill = require('mandrill-api/mandrill');
let config = require('../environments/' + process.env.NODE_ENV).config;

mandrill.ticket = {
  'config': {
    'email': 'hello@ticketforchange.org'
  },
  'client': new mandrill.Mandrill(config.mandrill)
};

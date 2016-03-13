'use strict';

/**
  Middleware - Error

  @param {Object} opts
  @api public
*/

const http = require('http');
const env = process.env.NODE_ENV || 'development';

module.exports = function error(opts) {
  opts = opts || {};

  return function *error(next){

    try {
      yield next;
      if (404 === this.response.status && !this.response.body) this.throw(404);

    } catch (err) {
      this.status = err.status || 500;

      if ('development' == env) {
        this.body = err.message

      } else if (err.expose) {
        this.body = err.message

      } else {
        this.body = { error: http.STATUS_CODES[this.status] }
      }

      // application
      this.app.emit('error', err, this);

    }
  }
}

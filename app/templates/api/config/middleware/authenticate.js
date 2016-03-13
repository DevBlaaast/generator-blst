'use strict';

/**
  Middleware - authenticate

  Authenticate users through password/credentials
*/

const passport = require('koa-passport');

module.exports = function authenticate() {

  return function *authenticate(next) {
    yield* passport.authenticate(['oauth2-client-password'], {
      session: false
    }).call(this, next);
  };

};

'use strict';

/**
  Middleware - is-authenticated

  Check if user is authenticated using the Bearer strategy
*/

const Promise = require('bluebird');
const passport = require('koa-passport');
const acl = Promise.promisifyAll(require('acl').ticketAcl);
const debug = require('debug')('hiring:middleware:is-authenticated');

module.exports = function isAuthenticated() {

  return function *isAuthenticated (next) {

    const _this = this;

    let authURLs = this.request.url.split('/');
    authURLs = [authURLs[0], authURLs[1], authURLs[2]].join('/');

    const isAuthorized = authURLs === '/authentication/token'
                    || authURLs === '/authentication/social'
                    || authURLs === '/exports/applications'
                    || authURLs === '/stats/acv'
                    || authURLs === '/send-reset/'
                    || authURLs === '/reset-password/'
                    || (authURLs === '/users/' && this.request.method === 'POST');

    if (isAuthorized) {
      yield* next;

    } else {

      yield passport.authenticate('bearer', {
        session: false,
        failWithError: true
      }, function*(err, user) {
        if (err) {
          throw err;
        }
        if (!user) {
          _this.status = 401;
          _this.body = 'Unauthorized';
        } else {
          let isAdmin = yield acl.userRoles(user.id);

          if (!process.env.APPLY_OVER || (isAdmin.indexOf('admin') > -1 || isAdmin.indexOf('corrector') > -1)) {
            debug('allowed !');
            yield _this.login(user);
            yield* next;
          } else {
            debug('not allowed :(');
            _this.status = 401;
            _this.body = 'Unauthorized';
          }

        }
      }).call(this, next);
    }

  };
};

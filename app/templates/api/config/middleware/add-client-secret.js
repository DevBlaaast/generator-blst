'use strict';

/**
  Middleware - add-client-secret

  Add the apps secret so that oauth2orize doesn't explode
*/

module.exports = function addClientSecret() {

  return function *addClientSecret(next) {
    if (!this.request.body.client_secret) {
      this.request.body.client_secret = 'not_available';
    }
    yield* next;
  };

};

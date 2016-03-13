'use strict';

/**
  Middleware - generate-access-token

  Create OAuth2 tokens for the users logging-in
*/

const oauthServer;

module.exports.generateAccessToken = function() {
  return function *generateAccessToken() {
    yield oauthServer.token();
  };
};

module.exports.refreshToken = function() {
  return function *refreshToken() {
    yield oauthServer.refreshToken();
  };
};

module.exports.generateGoogleAccessToken = function() {
  return function *generateGoogleAccessToken() {
    // Set authorization_code grant type to use oauth2 server code exchange
    this.req.body.grant_type = 'authorization_code';
    yield oauthServer.token();
  };
};

module.exports.cacheOauthServer = function (server) {
  oauthServer = server;
};

'use strict';

let oauth2orize = require('koa-oauth2orize');

let user = require('../../models/user').User;
let clientModel = require('../../models/client').Client;
let accesstoken = require('../../models/accesstoken').Accesstoken;
let refreshtoken = require('../../models/refreshtoken').Refreshtoken;

const ONE_HOUR_MS = 3600000;
const ONE_DAY_MS = 86400000;
const ONE_HOUR_S = 3600;

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// TODO move to jwt
function uid (len) {
  let buf = [],
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    charlen = chars.length,
    i;

  for (i = 1; i < len; i = i + 1) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
}

let oauth = {

  init: function (oauthServer) {
    // remove all expired accesstokens on startup
    accesstoken.destroyAllExpired();

    // remove all expired refreshtokens on startup
    refreshtoken.destroyAllExpired();

    // Exchange user id and password for access tokens. The callback accepts the
    // `client`, which is exchanging the user's name and password from the
    // authorization request for verification. If these values are validated, the
    // application issues an access token on behalf of the user who authorized the code.
    oauthServer.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {
      // Validate the client
      clientModel.forge({ slug: client.slug }).fetch().then(function (client) {
        if (!client) {
          return done(new Error('Invalid client.'));
        }
        // Validate the user
        return user.check({ email: username, password: password }).then(function (user) {

          // Everything validated, return the access- and refreshtoken
          let accessToken = uid(256),
            refreshToken = uid(256),
            accessExpires = Date.now() + ONE_HOUR_MS,
            refreshExpires = Date.now() + ONE_DAY_MS * 4;

          return accesstoken
            .add({ token: accessToken, user_id: user.id, client_id: client.id, expires: accessExpires })
            .then(function () {
              return refreshtoken.add({ token: refreshToken, user_id: user.id, client_id: client.id, expires: refreshExpires });

          }).then(function () {
            return done(null, accessToken, refreshToken, { expires_in: ONE_HOUR_S });

          }).catch(function (error) {
            return done(error, false);

          });
        }).catch(function (error) {
          return done(error);
        });
      });
    }));

    // Exchange social login id to local oauth2 token
    oauthServer.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {

      refreshtoken.forge({ token: refreshToken }).fetch().then(function (model) {
        if (!model) {
          let error = new Error('Invalid refresh token (or removed).');
          error.expose = true;
          error.status = 400;
          return done(error, false);
        } else {
          let token = model.toJSON(),
            accessToken = uid(256),
            accessExpires = Date.now() + ONE_HOUR_MS,
            refreshExpires = Date.now() + ONE_DAY_MS * 4;

          if (token.expires > Date.now()) {
            accesstoken.add({
              token: accessToken,
              user_id: token.user_id,
              client_id: token.client_id,
              expires: accessExpires
            }).then(function () {
              return refreshtoken.edit({ expires: refreshExpires }, { id: token.id });

            }).then(function () {
              return done(null, accessToken, { expires_in: ONE_HOUR_S });

            }).catch(function (error) {
              return done(error, false);

            });
          } else {
            return done(new Error('Refresh token expired.'), false);
          }
        }
      });
    }));

    oauthServer.exchange(oauth2orize.exchange.code(function(client, code, redirectURI, done) {
      // Validate client
      clientModel.forge({ slug: client }).fetch().then(function (client) {
        if (!client) {
          return done(new Error('Invalid client.'));
        }

        // Everything validated, return the access- and refreshtoken
        let accessToken = uid(256),
          refreshToken = uid(256),
          accessExpires = Date.now() + ONE_HOUR_MS,
          refreshExpires = Date.now() + ONE_DAY_MS * 4;

        return accesstoken
          .add({ token: accessToken, user_id: code, client_id: client.id, expires: accessExpires })
          .then(function () {
            return refreshtoken.add({ token: refreshToken, user_id: code, client_id: client.id, expires: refreshExpires });

        }).then(function () {
          return done(null, accessToken, refreshToken, { expires_in: ONE_HOUR_S });

        }).catch(function (error) {
          return done(error, false);

        });
      });

    }));
  }
};

module.exports = oauth;

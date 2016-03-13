'use strict';

let uuid = require('node-uuid');
let passport = require('koa-passport');
let BearerStrategy = require('passport-http-bearer').Strategy;
let ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
let GoogleAuthCodeStrategy = require('./../../lib/passport/google-authcode').Strategy;

let config = require('./../environments').config;
let client = require('../../models/client').Client;
let user = require('../../models/user').User;
let accesstoken  = require('../../models/accesstoken').Accesstoken;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  user.forge({ id: id }).then(function (user) {
    done(null, user);
  }).catch(function (err) {
    done(err);
  });
});

/**
 * ClientPasswordStrategy
 *
 * This strategy is used to authenticate registered OAuth clients.  It is
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.  The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate (not implemented yet).
 *
 * Use of the client password strategy is implemented to support ember-simple-auth.
 */
passport.use(new ClientPasswordStrategy(function (clientId, clientSecret, done) {
  client.forge({ slug: clientId }).fetch().then(function (model) {
    if (model) {
      let client = model.toJSON();
      if (client.secret === clientSecret) {
        return done(null, client);
      }
    }
    return done(null, false);
  });
}));

/**
 * GoogleStrategy
 *
 * This strategy is used to authenticate Google OAuth users.  It is
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.
 */
passport.use(new GoogleAuthCodeStrategy({
    clientID: config.google.client_id,
    clientSecret: config.google.client_secret,
    redirectURI: config.google.redirect_uri,
    passReqToCallback : true
  },
  function (req, accessToken, refreshToken, profile, done) {
    // Manage user creation + authentication
    return user.findOne({ google_id: profile.id }).then(function (authUser) {
      if (authUser) {
        // User exits
        req.body.code = authUser.id;
        return done(null, req.body.client_id);
      }
      // User doesn't exists create one and return the client to the next
      // middleware
      let userId = uuid.v4();
      let options = {
        context: { user: userId }
      };
      return user.add({
        id: userId,
        google_id: profile.id,
        email: profile._json.email,
        name: profile._json.name
      }, options).then(function (user) {
        req.body.code = user.id;
        return done(null, req.body.client_id);
      });
    });
  }
));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate users based on an access token (aka a
 * bearer token).  The user must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(function (accessToken, done) {
  accesstoken.forge({ token: accessToken }).fetch().then(function (model) {
    if (model) {
      let token = model.toJSON();
      if (token.expires > Date.now()) {
        user.forge({ id: token.user_id }).fetch().then(function (model) {
          if (model) {
            let user = model.toJSON(),
              info = { scope: '*' };
            return done(null, { id: user.id }, info);
          }
          return done(null, false);
        });
      } else {
        return done(null, false);
      }
    } else {
      return done(null, false);
    }
  });
}));

'use strict';

/**
* Start monitoring
*/
require('newrelic');

/**
 * Module dependencies.
 */
let url = require('url');
let responseTime = require('koa-response-time');
let ratelimit = require('koa-ratelimit');
let compress = require('koa-compress');
let logger = require('koa-logger');
let router = require('koa-router');
let body = require('koa-body');
let cors = require('koa-cors');
let etag = require('koa-etag');
let conditional = require('koa-conditional-get');
let load = require('./lib/load');
let redis = require('redis');
let koa = require('koa');
let passport = require('koa-passport');
let oauth2orize = require('koa-oauth2orize');

/**
 * Environment.
 */
let env = process.env.NODE_ENV || 'development';

/**
 * Redis setup
 */
if ( process.env.REDISCLOUD_URL ) {
  let redisURL = url.parse(process.env.REDISCLOUD_URL);
  let authRedis = redisURL.auth.split(':')[1];
  redis.hiringTicket = redis.createClient( redisURL.port, redisURL.hostname, {
    no_ready_check: true
  });
  // Authentication
  redis.hiringTicket.auth( authRedis );
} else {
  // Local dev, default connection settings
  redis.hiringTicket = redis.createClient();
}

/**
 * Initializers
 */
require('./config/initializers/00_database');
require('./config/initializers/01_models');
require('./config/initializers/02_mandrill');
require('./config/initializers/03_acl')(redis.hiringTicket);

let oauth = require('./config/passport/oauth');
let authStrategies = require('./config/passport/strategies');
let generateAccessToken = require('./config/middleware/generate-access-token');
let isAuthenticated = require('./config/middleware/is-authenticated');
let error = require('./config/middleware/error');

/**
 * Expose `api()`.
 */
module.exports = api;

/**
 * Initialize an app with the given `opts`.
 *
 * @param {Object} opts
 * @return {Application}
 * @api public
 */
function api(opts) {
  opts = opts || {};
  let app = koa();

  // Oauth2 server init & caching
  let oauthServer = oauth2orize.createServer();
  oauth.init(oauthServer);
  generateAccessToken.cacheOauthServer(oauthServer);

  // querystring
  require('koa-qs')(app);
  app.querystring = require('qs');

  app.use(body());

  app.use(cors({
    methods: 'GET,POST,PUT,PATCH,OPTIONS',
    headers: 'Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since',
    maxAge: 300000,
    credentials: true
  }));

  // Logging
  if ('test' != env) app.use(logger());

  // Passport
  app.use(passport.initialize());

  // Enable app-wide authentication
  app.use(isAuthenticated());

  // Etag
  app.use(conditional());
  app.use(etag());

  // x-response-time
  app.use(responseTime());

  // compression
  app.use(compress());

  // rate limiting
  app.use(ratelimit({
    max: opts.ratelimit,
    duration: opts.duration,
    db: redis.hiringTicket
  }));

  // routing
  app.use(router(app));

  // Error handling
  app.use(error());

  // boot
  load(app, __dirname + '/api');

  return app;
}

'use strict';

let Promise = require('bluebird');
let config = require('../../config/environments').config;
let middleware = require('../../config/middleware');
let compose = require('koa-compose');
let path = require('path');
let models = require('../../models');

let MailService = require('../../services/mail');

/**
 * POST /authentication/token
 */

exports.token = compose([
  middleware.addClientSecret(),
  middleware.authenticate(),
  middleware.generateAccessToken.generateAccessToken()
]);

/**
 * GET /authentication/social/token
 */

exports.social = compose([
  middleware.addClientSecret(),
  middleware.authenticateSocial(),
  middleware.generateAccessToken.generateGoogleAccessToken()
]);

/**
 * POST authentication/revoke
 */

exports.revoke = function *(){
  yield Promise.all([
    models.Accesstoken.destroyByUser({ id: this.req.user.id }),
    models.Refreshtoken.destroyByUser({ id: this.req.user.id })
  ]);

  this.body = 'OK';
};


exports.sendReset = function *(){
  let mailService = new MailService();
  let data = this.request.body;
  let expires = Date.now() + 1*3600*1000; // dans 1 heure

  yield models.User.generateResetToken(data.email, expires).then(function (user) {
    let baseUrl = config.api.hostname,
      params = {
        'to': [{ email: data.email, type: 'to'}],
        'resetUrl': path.join('apply.ticketforchange.org', 'reset', user.token)
      };

    return mailService.resetEmail(params.to, params.resetUrl);
  });

  this.body = 'OK';
};

exports.reset = function *(){
  let data = this.request.body;
  let options = {
    context: {
      user: 'f42723e2-af37-475f-9d81-ac27d9b8c57e' // system admin
    }
  };

  yield models.User.resetPassword(data.token, data.newPassword, null, options);

  this.body = 'Password reset OK';
};

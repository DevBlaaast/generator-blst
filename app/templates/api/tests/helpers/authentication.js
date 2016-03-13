'use strict';

// Test helper - Authentication
// Create + cache access_token / only one DB call per test session

let request = require('supertest');

module.exports = function (app, done) {

  request(app.listen())
    .post('/authentication/token')
    .send({
      'username': 'bruce@wayne.com',
      'password': 'batman75',
      'grant_type': 'password',
      'client_id': 'hiring-ticket-app'
    })
    .end(function (err, response) {
      let token = response.res.body.access_token;
      done(token);
    });
};

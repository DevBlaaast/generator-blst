'use strict';

let _ = require('lodash');
let request = require('supertest');
let api = require('../..');
let expect = require('chai').expect;
let testHelpers = require('../../tests/helpers/init');

describe('Users', function(){
  let token;

  before(function (done) {
    let app = api();

    testHelpers.auth(app, function (access_token) {
      token = access_token;
      done();
    });
  });

  context('GET /users/:id', function () {

    it('should respond with user with :id', function(done){
      let app = api();

      request(app.listen())
        .get('/users/5f25e33f-36d9-4169-bfef-dca69dde5472')
        .set('Authorization', 'Bearer ' + token)
        .end(function (err, response){
          if (err) return done(err);
          expect(response.statusCode).to.eql(200);
          expect(response.body.user.name).to.eql('John Wayne');
          done();
        });
    });
  });

  context('GET /users/me', function () {

    it('should respond with currentUser', function(done){
      let app = api();

      request(app.listen())
        .get('/users/me')
        .set('Authorization', 'Bearer ' + token)
        .end(function (err, response){
          if (err) return done(err);
          expect(response.statusCode).to.eql(200);
          expect(response.body.user.name).to.eql('Bruce Wayne');
          done();
        });
    });

    it('should respond with a current user that has a `links` attribute', function(done){
      let app = api();

      request(app.listen())
        .get('/users/me')
        .set('Authorization', 'Bearer ' + token)
        .end(function (err, response) {
          if (err) return done(err);
          let userHasLinks = _.every(response.res.body.user, 'links');
          expect(response.statusCode).to.eql(200);
          expect(userHasLinks).to.be.truthy;
          done();
        });
    });
  });
});

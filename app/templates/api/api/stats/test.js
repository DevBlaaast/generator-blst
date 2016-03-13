'use strict';

let request = require('supertest');
let api = require('../..');
let expect = require('chai').expect;
let testHelpers = require('../../tests/helpers/init');

let allStats = {
  requests: 100000,
  average_duration: 52,
  uptime: 123123132
};

describe('Stats', function () {
  let token;

  before(function (done) {
    let app = api();

    testHelpers.auth(app, function (access_token) {
      token = access_token;
      done();
    });
  });

  context('GET /stats', function(){

    it('should respond with stats', function(done){
      let app = api();

      request(app.listen())
        .get('/stats')
        .set('Authorization', 'Bearer ' + token)
        .end(function (err, response) {
          expect(response.body).to.eql(allStats);
          done();
        });
    });
  });

  context('GET /stats/:name', function(){
    it('should respond with a single stat', function(done){
      let app = api();

      request(app.listen())
        .get('/stats/requests')
        .set('Authorization', 'Bearer ' + token)
        .expect('100000', done);
    });
  });
});

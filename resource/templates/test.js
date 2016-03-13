/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

const _ = require('lodash');
const request = require('supertest');
const api = require('../..');
const expect = require('chai').expect;
const testHelpers = require('../../tests/helpers/init');

describe('Acceptance / <%= resourceName %>', () => {
  let token;

  before(done => {
    const app = api();

    testHelpers.auth(app, access_token => {
      token = access_token;
      done();
    });
  });


  /**
   * GET all <%= resourceName %> of a user.
   */
  context('GET /<%= resourceName %>', () => {

    it('should return a list of <%= resourceName %>', done => {
      const app = api();

      request(app.listen())
        .get('/<%= resourceName %>')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body.data.<%= resourceName %>.length, true);
          done();
        });
    });

  });

});

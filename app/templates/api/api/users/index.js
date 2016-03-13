'use strict';

/**
 * Module dependencies.
 */
let _ = require('lodash');

let User = require('../../models/user').User;
let Contract = require('../../models/contract').Contract;

/**
 * GET all users.
 */

exports.index = function *() {

  if (!this.query.status) {
    this.throw('You must include a status to filter users.');
  }

  const status = this.query.status.split(',');

  const users = yield User.findAll({
    whereIn: ['status', status]
  });

  this.status = 200;
  this.body = { users };

};

/**
 * GET user by :id.
 */

exports.show = function *() {

  let contract, userAttr;

  if ( this.params.user === 'me' ) {
    this.params.user = this.req.user.id;
  }

  let user = yield User.findOne({ id: this.params.user }, { withRelated: 'contract' });
  // Sideload data
  contract = user.related('contract');
  user.set('contract', user.related('contract').get('id'));
  userAttr = user.toJSON();
  userAttr.contract = userAttr.contract.id;

  this.status = 200;
  this.body = {
    user: userAttr,
    contracts: [contract.toJSON()]
  };

};

/**
 * POST a new user.
 */

exports.create = function *() {

  let options = {
    context: {
      user: this.request.body.user.id
    }
  };

  if (process.env.ACTIVATE_SIGNUP === 'off') {
    this.throw(400, 'Les inscriptions sont fermées pour le moment.');
  }

  if (this.request.body.user.status === 'entre') {
    this.throw(400, 'Les inscriptions pour les entrepreneurs sont fermées pour le moment.');
  }

  let addedUser = yield User.add(this.request.body.user, options);

  this.status = 201;
  this.body = {
    user: addedUser
  };

};

/**
 * PUT a user.
 */

exports.update = function *() {

  let options = {
    context: {
      user: this.req.user.id,
    },
    id: this.params.user
  };

  let editedUser = yield User.edit(this.request.body, options);

  this.status = 200;
  this.body = {
    user: editedUser
  };

};

'use strict';

const <%= modelName %> = require('../models').<%= modelName %>;

/**
  GET <%= resourceNamePlur %>
*/
exports.index = function *() {

  const <%= modelNamePlur %> = yield <%= modelName %>.findAll();

  this.body = { data: { <%= modelNamePlur %> } };

};


/**
  GET <%= resourceNamePlur %>/:id
*/
exports.show = function *() {

  const <%= modelNameSing %> = yield <%= modelName %>.findOne({ id: this.params.<%= resourceName %> });

  this.body = { data: { <%= modelNameSing %> } };

};


/**
  POST <%= resourceNamePlur %>
*/
exports.create = function *() {

  const payload = this.request.body.<%= modelNameSing %>;
  const options = {
    context: {
      user: this.req.user.id,
    }
  };

  const <%= modelNameSing %> = yield <%= modelName %>.add(payload, options);

  this.body = { data: { <%= modelNameSing %> } };

};


/**
  PUT <%= resourceNamePlur %>/:id
*/
exports.update = function *() {

  const options = {
    context: {
      user: this.req.user.id,
    },
    id: this.params.<%= resourceName %>
  };

  const <%= modelNameSing %> = yield <%= modelName %>.edit(payload, options);

  this.body = { data: { <%= modelNameSing %> } };

};


/**
  DELETE <%= resourceNamePlur %>/:id
*/
exports.destroy = function *() {

  const options = {
    context: {
      user: this.req.user.id,
    },
    id: this.params.<%= resourceName %>
  };

  const <%= modelNameSing %> = yield <%= modelName %>.destroy(options);

  this.body = { data: { <%= modelNameSing %> } };

};

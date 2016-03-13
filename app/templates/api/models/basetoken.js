'use strict';

/**
 * BaseToken Model
 */
let Promise = require('bluebird');
let hiringBookshelf  = require('./base');
let Basetoken;

Basetoken = hiringBookshelf.Model.extend({

  permittedAttributes: function () {
    return [
      'id', 'user_id', 'client_id', 'token', 'expires'
    ];
  },

  // override for base function since we don't have
  // a created_by field for sessions
  creating: function (newObj, attr, options) {
    /*jshint unused:false*/
  },

  // override for base function since we don't have
  // a updated_by field for sessions
  saving: function (newObj, attr, options) {
    /*jshint unused:false*/
    // Remove any properties which don't belong on the model
    this.attributes = this.pick(this.permittedAttributes());
  },

  user: function () {
    return this.belongsTo('User');
  },

  client: function () {
    return this.belongsTo('Client');
  }

}, {

  // TO BE DELETED ONCE CONTEXT IS SET BY A MIDDLEWARE
  add: function (data, options) {
    options = options || {};
    return hiringBookshelf.Model.add.call(this, data, options);
  },

  destroyAllExpired:  function (options) {
    // options = this.filterOptions(options, 'destroyAll');
    return hiringBookshelf.Collection.forge([], {model: this})
      .query('where', 'expires', '<', Date.now())
      .fetch(options)
      .then(function (collection) {
        collection.invokeThen('destroy', options);
      });
  },

  /**
   * ### destroyByUser
   * @param  {[type]} options has context and id. Context is the user doing the
   * destroy, id is the user to destroy
   */
  destroyByUser: function (options) {
    let userId = options.id;

    // options = this.filterOptions(options, 'destroyByUser');

    if (userId) {
      return hiringBookshelf.Collection.forge([], { model: this })
        .query('where', 'user_id', '=', userId)
        .fetch(options)
        .then(function (collection) {
          collection.invokeThen('destroy', options);
        });
    }

    return Promise.reject(new Error('No user found'));
  },

  /**
   * ### destroyByToken
   * @param  {[type]} options has token where token is the token to destroy
   */
  destroyByToken: function (options) {
    let token = options.token;

    // options = this.filterOptions(options, 'destroyByUser');

    if (token) {
      return hiringBookshelf.Collection.forge([], { model: this })
        .query('where', 'token', '=', token)
        .fetch(options)
        .then(function (collection) {
          collection.invokeThen('destroy', options);
        });
    }

    return Promise.reject(new Error('Token not found'));
  }
});

module.exports = Basetoken;

'use strict';

/**
 * AccessToken Model
 */
let Accesstoken, Accesstokens;
let ghostBookshelf = require('./base');
let Basetoken = require('./basetoken');

Accesstoken = Basetoken.extend({
  tableName: 'accesstokens',

  permittedAttributes: function () {
    return [
      'id', 'user_id', 'client_id', 'token', 'expires'
    ];
  }
});

Accesstokens = ghostBookshelf.Collection.extend({
  model: Accesstoken
});

module.exports = {
  Accesstoken: ghostBookshelf.model('Accesstoken', Accesstoken),
  Accesstokens: ghostBookshelf.collection('Accesstokens', Accesstokens)
};

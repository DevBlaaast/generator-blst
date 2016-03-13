'use strict';

/**
 * Refresh Token Model
 */
let Refreshtoken, Refreshtokens;
let ghostBookshelf = require('./base');
let Basetoken = require('./basetoken');

Refreshtoken = Basetoken.extend({
  tableName: 'refreshtokens'
});

Refreshtokens = ghostBookshelf.Collection.extend({
  model: Refreshtoken
});

module.exports = {
  Refreshtoken: ghostBookshelf.model('Refreshtoken', Refreshtoken),
  Refreshtokens: ghostBookshelf.collection('Refreshtokens', Refreshtokens)
};

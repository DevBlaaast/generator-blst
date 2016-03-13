'use strict';

/**
 * Client Model
 */
let Client,  Clients;
let hiringBookshelf  = require('./base');

Client = hiringBookshelf.Model.extend({

  tableName: 'clients',

});

Clients = hiringBookshelf.Collection.extend({
  model: Client
});

module.exports = {
  Client: hiringBookshelf.model('Client', Client),
  Clients: hiringBookshelf.collection('Clients', Clients)
};

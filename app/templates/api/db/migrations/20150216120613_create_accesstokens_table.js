'use strict';

exports.up = function(knex, Promise) {

  return knex.schema.createTable('accesstokens', function (t) {
    t.uuid('id').primary();
    t.string('token').unique();
    t.uuid('user_id').references('users.id');
    t.uuid('client_id').references('clients.id');
    t.bigInteger('expires');
  });

};

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('accesstokens');

};

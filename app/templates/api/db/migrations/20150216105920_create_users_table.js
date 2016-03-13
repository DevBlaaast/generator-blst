'use strict';

exports.up = function(knex, Promise) {

  return knex.schema.createTable('users', function (t) {
    t.uuid('id').primary();
    t.string('slug');
    t.string('name');
    t.string('email').unique();
    t.string('password', 60);
    t.string('status');
    t.uuid('created_by').references('users.id');
    t.uuid('updated_by').references('users.id');
    t.timestamps();
  });

};

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('users');

};

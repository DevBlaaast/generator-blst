'use strict';

exports.seed = function(knex) {

  return knex('clients').insert({
    id: '215e3465-b4be-4234-acfc-a5a26fe7d72f',
    name: 'Hiring Ticket App',
    slug: 'hiring-ticket-app',
    secret: 'not_available'
  });

};

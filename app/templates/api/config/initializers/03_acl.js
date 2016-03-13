
'use strict';

/**
  ACL initializer

  Many async operations here that do not happen one after the other.
  Do not despair though, since they don't have to be run in any specific order.
*/

let acl = require('acl');
let knex = require('knex').ticketKnex;

module.exports = function(redisClient) {

  // Using redis backend
  acl.ticketAcl = new acl(new acl.redisBackend(redisClient, 'acl-'));

  // Add admin roles
  knex('users')
    .whereIn('status', ['admin', 'admin-entre', 'admin-intra'])
    .select('id').map(user => {
      acl.ticketAcl.addUserRoles(user.id, ['admin', 'corrector']);
    });

  // Add corrector roles
  knex('users')
    .whereIn('status', ['corrector-entre', 'corrector-intra'])
    .select('id').map(user => {
      acl.ticketAcl.addUserRoles(user.id, 'corrector');
    });

  // Add authorization to roles
  acl.ticketAcl.allow('corrector', 'corrections', ['index', 'show', 'update']);

  acl.ticketAcl.allow('corrector', 'marks', ['creation', 'update']);

};

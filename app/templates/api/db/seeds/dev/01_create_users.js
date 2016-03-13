'use strict';

exports.seed = function(knex) {

  return knex('users').insert([{
    id: 'f42723e2-af37-475f-9d81-ac27d9b8c57e',
    name: 'Bruce Wayne',
    status: 'corrector-entre',
    email: 'bruce@wayne.com',
    password: '$2a$10$fvDkXPmfbi9NUhhBHox7kexVJoTU5tvma2W1FVcajgypqj50C.0Fu' // batman75
  }, {
    id: '4b828e95-51e4-41f3-871d-399d4e0e37a3',
    name: 'John Paul',
    status: 'entre',
    enrolled: 'true',
    email: 'john@paul.com',
    password: '$2a$10$fvDkXPmfbi9NUhhBHox7kexVJoTU5tvma2W1FVcajgypqj50C.0Fu' // batman75
  }, {
    id: '3684e14d-daa8-4a5e-800e-8a9a4a8d38a7',
    name: 'John Wayne',
    status: 'corrector-intra',
    email: 'john@wayne.com',
    password: '$2a$10$fvDkXPmfbi9NUhhBHox7kexVJoTU5tvma2W1FVcajgypqj50C.0Fu' // batman75

  }, {
    id: '6ca5ce15-d673-41e7-940e-08aa64c3421b',
    name: 'Admin ticket 1',
    status: 'admin-entre',
    email: 'admin@ticket.com',
    password: '$2a$10$fvDkXPmfbi9NUhhBHox7kexVJoTU5tvma2W1FVcajgypqj50C.0Fu' // batman75
  }, {
    id: '7ca5ce15-d673-41e7-940e-08aa64c3421b',
    name: 'Admin ticket 2',
    status: 'admin-entre',
    email: 'admin2@ticket.com',
    password: '$2a$10$fvDkXPmfbi9NUhhBHox7kexVJoTU5tvma2W1FVcajgypqj50C.0Fu' // batman75
  }, {
    id: '8ca5ce15-d673-41e7-940e-08aa64c3421b',
    name: 'Admin ticket 3',
    status: 'admin-intra',
    email: 'admin3@ticket.com',
    password: '$2a$10$fvDkXPmfbi9NUhhBHox7kexVJoTU5tvma2W1FVcajgypqj50C.0Fu' // batman75
  }, {
    id: '9ca5ce15-d673-41e7-940e-08aa64c3421b',
    name: 'Admin ticket 4',
    status: 'admin-intra',
    email: 'admin4@ticket.com',
    password: '$2a$10$fvDkXPmfbi9NUhhBHox7kexVJoTU5tvma2W1FVcajgypqj50C.0Fu' // batman75
  }]);

};

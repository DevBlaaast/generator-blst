'use strict';

exports.seed = function(knex, Promise) {

  return knex('users').insert([{

    id: 'f42723e2-af37-475f-9d81-ac27d9b8c57e',
    status: 'admin',
    email: 'admin@blaaast.co',
    password: '$2a$10$fvDkXPmfbi9NUhhBHox7kexVJoTU5tvma2W1FVcajgypqj50C.0Fu',
    created_by: 'f42723e2-af37-475f-9d81-ac27d9b8c57e',
    updated_by: 'f42723e2-af37-475f-9d81-ac27d9b8c57e',
    updated_at: '2014-09-30 10:44:26.528+00',
    created_at: '2014-09-30 10:44:26.528+00'

  }, {

    id: 'c161be7f-dd4e-4996-953a-e48a3b772b70',
    status: 'admin-intra',
    email: 'josephine@ticketforchange.org',
    password: '$2a$10$fvDkXPmfbi9NUhhBHox7kexVJoTU5tvma2W1FVcajgypqj50C.0Fu',
    created_by: 'f42723e2-af37-475f-9d81-ac27d9b8c57e',
    updated_by: 'f42723e2-af37-475f-9d81-ac27d9b8c57e',
    updated_at: '2014-09-30 10:44:26.528+00',
    created_at: '2014-09-30 10:44:26.528+00'
  }, {
    id: '33c23db3-22de-4139-b82b-df4aa8dfe566',
    status: 'admin-intra',
    email: 'matthieu@ticketforchange.org',
    password: '$2a$10$fvDkXPmfbi9NUhhBHox7kexVJoTU5tvma2W1FVcajgypqj50C.0Fu',
    created_by: 'f42723e2-af37-475f-9d81-ac27d9b8c57e',
    updated_by: 'f42723e2-af37-475f-9d81-ac27d9b8c57e',
    updated_at: '2014-09-30 10:44:26.528+00',
    created_at: '2014-09-30 10:44:26.528+00'
  }, {
    id: '948e59ec-ce51-4cb9-ba28-02388f3691a8',
    status: 'admin-intra',
    email: 'jonas@corporateforchange.com',
    password: '$2a$10$fvDkXPmfbi9NUhhBHox7kexVJoTU5tvma2W1FVcajgypqj50C.0Fu',
    created_by: 'f42723e2-af37-475f-9d81-ac27d9b8c57e',
    updated_by: 'f42723e2-af37-475f-9d81-ac27d9b8c57e',
    updated_at: '2014-09-30 10:44:26.528+00',
    created_at: '2014-09-30 10:44:26.528+00'
  }, {
    id: '860164ed-feec-41cc-9aef-0f9d16f45216',
    status: 'admin-intra',
    email: 'angelina@corporateforchange.com',
    password: '$2a$10$fvDkXPmfbi9NUhhBHox7kexVJoTU5tvma2W1FVcajgypqj50C.0Fu',
    created_by: 'f42723e2-af37-475f-9d81-ac27d9b8c57e',
    updated_by: 'f42723e2-af37-475f-9d81-ac27d9b8c57e',
    updated_at: '2014-09-30 10:44:26.528+00',
    created_at: '2014-09-30 10:44:26.528+00'
  }, {
    id: 'd80eff0a-828f-47e7-83f3-8605c8dbb891',
    status: 'admin-intra',
    email: 'alexandre@corporateforchange.com',
    password: '$2a$10$fvDkXPmfbi9NUhhBHox7kexVJoTU5tvma2W1FVcajgypqj50C.0Fu',
    created_by: 'f42723e2-af37-475f-9d81-ac27d9b8c57e',
    updated_by: 'f42723e2-af37-475f-9d81-ac27d9b8c57e',
    updated_at: '2014-09-30 10:44:26.528+00',
    created_at: '2014-09-30 10:44:26.528+00'
  }]);

};

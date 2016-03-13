'use strict';

/**
  Database initializer

  Kickstart the Bookshelf.js ORM with Postgresql
*/

let bookshelf = require('bookshelf');
let knex = require('knex');

let env = process.env.NODE_ENV || 'development';
let dbConf = require('../../knexfile')[env];

let knexInstance = knex(dbConf);

bookshelf.store = bookshelf(knexInstance);
knex.knexInstance = knexInstance;

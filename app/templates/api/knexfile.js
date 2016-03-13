'use strict';

// Update with your config settings.
var url = require('url');

var dbConnect = process.env.DATABASE_URL ? url.parse(process.env.DATABASE_URL) : '';

if (dbConnect) {
  dbConnect.pathname = dbConnect.pathname.substr(1);
  dbConnect.auth = dbConnect.auth.split(':');
  dbConnect.user = dbConnect.auth[0];
  dbConnect.password = dbConnect.auth[1];
}

module.exports = {

  development: {
    // debug: true,
    client: 'pg',
    connection: {
      database: 'hiring-ticket',
      user    : process.env.PG_USER || 'tom',
      password: process.env.PG_PASSWORD || 'tom',
      charset : 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/db/migrations',
      tableName: 'version'
    },
    seeds: {
      directory: './db/seeds/dev'
    }
  },

  test: {
    // debug: true,
    client: 'pg',
    connection: {
      database: 'hiring-ticket',
      user    : process.env.PG_USER || 'tom',
      password: process.env.PG_PASSWORD || 'tom',
      charset : 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/db/migrations',
      tableName: 'version'
    },
    seeds: {
      directory: './db/seeds/dev'
    }
  },

  staging: {
    client: 'pg',
    connection: {
      host:     dbConnect.hostname,
      database: dbConnect.pathname,
      user:     dbConnect.user,
      password: dbConnect.password,
      charset : 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/db/migrations',
      tableName: 'version'
    },
    seeds: {
      directory: './db/seeds/prod'
    }
  },

  production: {
    client: 'pg',
    connection: {
      host:     dbConnect.hostname,
      port:     dbConnect.port,
      database: dbConnect.pathname,
      user:     dbConnect.user,
      password: dbConnect.password,
      charset : 'utf8'
    },
    pool: {
      min: 2,
      max: 40
    },
    migrations: {
      directory: __dirname + '/db/migrations',
      tableName: 'version'
    },
    seeds: {
      directory: './db/seeds/prod'
    }
  }

};

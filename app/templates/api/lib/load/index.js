'use strict';

/*jshint -W064:true*/
/**
 * Module dependencies.
 */

let Resource = require('koa-resource-router');
let debug = require('debug')('hiring:lib:load');
let path = require('path');
let fs = require('fs');
let join = path.resolve;
let readdir = fs.readdirSync;

// let isAuthenticated = require('../../config/middleware/is-authenticated');

/**
 * Define routes in `conf`.
 */

function route(app, conf) {
  debug('routes: %s', conf.name);

  let mod = require(conf.directory);

  for (let key in conf.routes) {
    // Remove multiple spaces
    let prop = conf.routes[key];
    let routeDescription = key.replace(/\s{2,}/g, ' ');

    let method = routeDescription.split(' ')[0];
    let path = routeDescription.split(' ')[1];
    let isPublic = routeDescription.split(' ')[2] && routeDescription.split(' ')[2] === 'public';
    debug('%s %s -> .%s :: %s', method, path, prop, isPublic && 'public' || 'private');

    let fn = mod[prop];
    if (!fn) throw new Error(conf.name + ': exports.' + prop + ' is not defined');

    // By default routes are private unless 'public' is appended to their verb + path
    // if (isPublic) {
    //   app[method.toLowerCase()](path, fn);

    // } else {
    //  app[method.toLowerCase()](path, isAuthenticated(), fn);

    // }
    app[method.toLowerCase()](path, fn);
  }
}

/**
 * Define resource in `conf`.
 */

function resource(app, conf) {
  if (!conf.name) throw new Error('.name in ' + conf.directory + '/config.json is required');
  debug('resource: %s', conf.name);

  let mod = require(conf.directory);
  // All resources are protected by the authentication middleware
  // app.use(
  //   compose([
  //     isAuthenticated(),
  //     Resource(conf.name, mod).middleware()
  //   ])
  // );
  app.use(Resource(conf.name, mod).middleware());
}

/**
 * Load resources in `root` directory.
 *
 * @param {Application} app
 * @param {String} root
 * @api private
 */

module.exports = function(app, root){
  readdir(root).forEach(function(file){
    let dir = join(root, file);
    let stats = fs.lstatSync(dir);
    if (stats.isDirectory()) {
      let conf = require(dir + '/config.json');
      conf.name = file;
      conf.directory = dir;
      if (conf.routes) route(app, conf);
      else resource(app, conf);
    }
  });
};

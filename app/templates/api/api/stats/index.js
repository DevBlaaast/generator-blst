'use strict';

/*jshint -W124*/
/**
 * This file illustrates how you may map
 * single routes using config.json instead
 * of resource-based routing.
 */

let stats = {
  requests: 100000,
  average_duration: 52,
  uptime: 123123132,
  ping: 'OK'
};

/**
 * GET all stats.
 */

exports.all = function *(){
  this.body = stats;
};

/**
 * GET a single stat.
 */

exports.get = function *(){
  this.body = stats[this.params.name];
};

/**
 * HEAD status
 */

exports.acv = function *(){
  this.body = 'OK';
};

/*jshint +W124*/

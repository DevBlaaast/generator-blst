'use strict';

/**
 * Base Model
 */
let _ = require('lodash');
let bookshelf = require('bookshelf');
let Promise = require('bluebird');
let uuid = require('node-uuid');
let validator = require('validator');
let unidecode = require('unidecode');
// let moment = require('moment');
// let config = require('../config/environments/' + process.env.NODE_ENV);

let ticketBookshelf = bookshelf.ticketBookshelf;
ticketBookshelf.validator = validator;
ticketBookshelf.plugin('registry');
ticketBookshelf.plugin('virtuals');

ticketBookshelf.Model = ticketBookshelf.Model.extend({

  hasTimestamps: true,

  defaults: function () {
    return {
      id: uuid.v4()
    };
  },

  // Get permitted attributes from db/schema.js, which is where the DB schema is defined
  permittedAttributes: function () {
    // return _.keys(schema.tables[this.tableName]);
    return this.permittedAttributes();
  },

  initialize: function () {
    let self = this,
      options = arguments[1] || {};

    // make options include available for toJSON()
    if (options.include) {
      this.include = _.clone(options.include);
    }

    this.on('updated', this.updated, this);
    this.on('created', this.created, this);
    this.on('creating', this.creating, this);
    this.on('saving', function (model, attributes, options) {
      return Promise.resolve(self.saving(model, attributes, options)).then(function () {
        return self.validate(model, attributes, options);
      });
    });
  },

  validate: function (model/*, attributes, options*/) {
    return Promise.resolve(model);
  },

  creating: function (newObj, attr, options) {
    if (!this.get('created_by')) {
      this.set('created_by', this.contextUser(options));
    }
  },

  created: function () {

  },

  updated: function () {

  },

  saving: function (newObj, attr, options) {
    // Remove any properties which don't belong on the model
    this.attributes = this.pick(this.permittedAttributes());
    // Store the previous attributes so we can tell what was updated later
    this._updatedAttributes = newObj.previousAttributes();
    this.set('updated_by', this.contextUser(options));
  },

  // Base prototype properties will go here
  // Fix problems with dates
  // fixDates: function (attrs) {
  //   let self = this;

  //   _.each(attrs, function (value, key) {
  //     if (value !== null
  //             && schema.tables[self.tableName].hasOwnProperty(key)
  //             && schema.tables[self.tableName][key].type === 'dateTime') {
  //       // convert dateTime value into a native javascript Date object
  //       attrs[key] = moment(value).toDate();
  //     }
  //   });

  //   return attrs;
  // },

  // Convert integers to real booleans
  // fixBools: function (attrs) {
  //   let self = this;
  //   _.each(attrs, function (value, key) {
  //     if (schema.tables[self.tableName].hasOwnProperty(key)
  //            && schema.tables[self.tableName][key].type === 'bool') {
  //       attrs[key] = value ? true : false;
  //     }
  //   });

  //   return attrs;
  // },

  // Get the user from the options object
  contextUser: function (options) {
    // Default to context user
    if (options.context && options.context.user) {
        return options.context.user;
    // Other wise use the internal override
    } else if (options.context && options.context.internal) {
        return 1;
    } else {
        throw new Error('missing context');
    }
  },

  // format date before writing to DB, bools work
  format: function (attrs) {
    return attrs;
    // return this.fixDates(attrs);
  },

  // format data and bool when fetching from DB
  parse: function (attrs) {
    return attrs;
    // return this.fixBools(this.fixDates(attrs));
  }

}, {

  /**
   * Returns an array of keys permitted in every method's `options` hash.
   * Can be overridden and added to by a model's `permittedOptions` method.
   * @return {Array} Keys allowed in the `options` hash of every model's method.
   */
  permittedOptions: function () {
    // terms to whitelist for all methods.
    return ['context', 'include', 'transacting'];
  },

  /**
   * Filters potentially unsafe model attributes, so you can pass them to
   * Bookshelf / Knex.
   * @param {Object} data Has keys representing the model's attributes/fields in
   * the database.
   * @return {Object} The filtered results of the passed in data, containing
   * only what's allowed in the schema.
   */
  filterData: function (data) {
    let permittedAttributes = this.prototype.permittedAttributes(),
      filteredData = _.pick(data, permittedAttributes);

    return filteredData;
  },

  /**
   * ### Find One
   * Naive find one where data determines what to match on
   * @param {Object} data
   * @param {Object} options (optional)
   * @return {Promise(ticketBookshelf.Model)} Single Model
   */
  findOne: function (data, options) {
    data = this.filterData(data);
    options = options || {};
    // options = this.filterOptions(options, 'findOne');
    // We pass include to forge so that toJSON has access
    return this.forge(data, { include: options.include }).fetch(options);
  },

  /**
   * ### Find All
   * Naive find all fetches all the data for a particular model
   * @param {Object} options (optional)
   * @return {Promise(ticketBookshelf.Collection)} Collection of all Models
   */
  findAll:  function (options, relations) {
    options = options || {};
    // options = this.filterOptions(options, 'findAll');

    return this.query(options).fetchAll(relations).then(function (result) {
      if (options.include) {
        _.each(result.models, function (item) {
          item.include = options.include;
        });
      }
      return result;
    });
  },

  /**
   * ### Edit
   * Naive edit
   * @param {Object} data
   * @param {Object} options (optional)
   * @return {Promise(ticketBookshelf.Model)} Edited Model
   */
  edit: function (data, options) {
    let id = options.id;
    data = this.filterData(data);
    options = options || {};
    // options = this.filterOptions(options, 'edit');

    return this.forge({ id: id }).fetch(options).then(function (object) {
      if (object) {
        return object.save(data, options).then(function (project) {
          return project;
        });
      }
    });
  },

  /**
   * ### Add
   * Naive add
   * @param {Object} data
   * @param {Object} options (optional)
   * @return {Promise(ticketBookshelf.Model)} Newly Added Model
   */
  add: function (data, options) {
    data = this.filterData(data);
    let model = this.forge(data);
    // Set method to insertion
    options.method = 'insert';
    // We allow you to disable timestamps when importing posts so that the new posts `updated_at` value is the same
    // as the import json blob.
    if (options.importing) {
      model.hasTimestamps = false;
    }
    return model.save(null, options);
  },

  /**
   * ### Destroy
   * Naive destroy
   * @param {Object} options (optional)
   * @return {Promise(ticketBookshelf.Model)} Empty Model
   */
  destroy: function (options) {
    let id = options.id;
    options = options || {};
    // options = this.filterOptions(options, 'destroy');
    return this.forge({id: id}).destroy(options);
  },

  /**
   * Create a string to act as the permalink for an object.
   * @param {ticketBookshelf.Model} Model Model type to generate a slug for
   * @param {String} base The string for which to generate a slug, usually a title or name
   * @param {Object} options Options to pass to findOne
   * @return {Promise(String)} Resolves to a unique slug string
   */
  generateSlug: function (Model, base, options) {
    let slug,
        slugTryCount = 1,
        baseName = Model.prototype.tableName.replace(/s$/, ''),
        // Look for a matching slug, append an incrementing number if so
        checkIfSlugExists;

    checkIfSlugExists = function (slugToFind) {
      let args = {slug: slugToFind};
      // status is needed for posts
      if (options && options.status) {
        args.status = options.status;
      }
      return Model.findOne(args, options).then(function (found) {
        let trimSpace;

        if (!found) {
          return slugToFind;
        }

        slugTryCount += 1;

        // If this is the first time through, add the hyphen
        if (slugTryCount === 2) {
          slugToFind += '-';
        } else {
          // Otherwise, trim the number off the end
          trimSpace = -(String(slugTryCount - 1).length);
          slugToFind = slugToFind.slice(0, trimSpace);
        }

        slugToFind += slugTryCount;

        return checkIfSlugExists(slugToFind);
      });
    };

    slug = base.trim();

    // Remove non ascii characters
    slug = unidecode(slug);

    // Remove URL reserved chars: `:/?#[]@!$&'()*+,;=` as well as `\%<>|^~£"`
    slug = slug.replace(/[:\/\?#\[\]@!$&'()*+,;=\\%<>\|\^~£"]/g, '')
        // Replace dots and spaces with a dash
        .replace(/(\s|\.)/g, '-')
        // Convert 2 or more dashes into a single dash
        .replace(/-+/g, '-')
        // Make the whole thing lowercase
        .toLowerCase();

    // Remove trailing hyphen
    slug = slug.charAt(slug.length - 1) === '-' ? slug.substr(0, slug.length - 1) : slug;

    // if slug is empty after trimming use the model name
    if (!slug) {
      slug = baseName;
    }
    // Test for duplicate slugs.
    return checkIfSlugExists(slug);
  }

});

module.exports = ticketBookshelf;

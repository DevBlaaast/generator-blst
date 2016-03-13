'use strict';

/**
 * User Model
 */
let url = require('url');
let config = require('./../config/environments').config;
let Promise = require('bluebird');
let bcrypt = Promise.promisifyAll(require('bcrypt'));
let crypto = require('crypto');
let validator = require('validator');
let debug = require('debug')('hiring:models:user');

let User, Users;
let ticketBookshelf = require('./base');
let AccountService = require('./../services/account');

let tokenSecurity = {}; // in memory password reset anti-spam, should go to redis

function validatePasswordLength(userData) {
  if (userData.google_id) {
    return Promise.resolve();
  }
  try {
    if (!validator.isLength(userData.password, 8)) {
      let error = new Error('Votre mot de passe doit faire au moins 8 caractères de long.');
      error.expose = true;
      error.status = 400;
      throw error;
    }
  } catch (error) {
    return Promise.reject(error);
  }
  return Promise.resolve();
}

function validateEmail (userData) {
  try {
    if (!validator.isEmail(userData.email)) {
      let error = new Error('Veuillez entrer une adresse email valide.');
      error.expose = true;
      error.status = 400;
      throw error;
    }
  } catch (error) {
    return Promise.reject(error);
  }
  return Promise.resolve();
}

function generatePasswordHash(password) {
  // Generate a new salt
  return bcrypt.genSaltAsync().then(function (salt) {
    // Hash the provided password with bcrypt
    return bcrypt.hashAsync(password, salt);
  });
}

User = ticketBookshelf.Model.extend({

  tableName: 'users',

  permittedAttributes: function () {
    return [
      'id', 'name', 'status', 'slug', 'password', 'email', 'created_at',
      'enrolled', 'created_by', 'updated_at', 'updated_by'
    ];
  },

  virtuals: {
    // Build model's links
    links: function() {
      return {
        forminfos: url.format({
          protocol: config.api.protocol || 'http',
          host: config.api.hostname,
          pathname: 'forms',
          query: { userId: this.get('id'), type: 'infos' }
        }),
        formtest: url.format({
          protocol: config.api.protocol || 'http',
          host: config.api.hostname,
          pathname: 'forms',
          query: { userId: this.get('id'), type: 'test' }
        }),
        corrections: url.format({
          protocol: config.api.protocol || 'http',
          host: config.api.hostname,
          pathname: 'corrections',
          query: { correctorId: this.get('id') }
        })
      };
    }
  },

  creating: function () {
    ticketBookshelf.Model.prototype.creating.apply(this, arguments);

    // Set basic status for all users (can be changed later)
    const type = this.get('status');
    if (type === 'entre' || type === 'intra') {
      this.set('status', type);
    } else {
      this.set('status', 'basic');
    }
  },

  toJSON: function (options) {
    let attrs = ticketBookshelf.Model.prototype.toJSON.call(this, options);
    // remove password hash for security reasons
    delete attrs.password;

    return attrs;
  },

  // Relationships
  contract: function () {
    return this.hasOne('Contract', 'created_by');
  },

  corrections: function () {
    return this.hasMany('Correction', 'created_by');
  },

  forms: function () {
    return this.hasMany('Form', 'created_by');
  },

  reviews: function () {
    return this.hasMany('Correction', 'corrector_id');
  }

}, {

  /**
   * ## Search
   * Autocomplete for users
   *
   * @param {object} data
   * @param {object} options
   */
  search: function (searchTerm, options) {
    return User.forge()
      .query('where', 'name', 'ilike', '%' + searchTerm + '%').fetch()
      .then(function (res) {
        // Always return an array
        if (!Array.isArray(res)) {
          return [res];
        }
        return res;
      });
  },

  /**
   * ## Add
   * Hashes the password provided before saving to the database.
   *
   * @param {object} data
   * @param {object} options
   * @extends ticketBookshelf.Model.add to manage all aspects of user signup
   * **See:** [ticketBookshelf.Model.add](base.js.html#Add)
   */
  // TODO validate the status
  add: function (data, options) {
    let userData = this.filterData(data);

    userData.email = userData.email ? userData.email.toLowerCase() : userData.email;

    return validatePasswordLength(userData).then(function () {
      return validateEmail(userData);

    }).then(() => {
      return this.forge({ email: userData.email }).fetch(options);

    }).then((user) => {
      if ( user && ( user.get('email') === userData.email ) ) {
        var error = new Error('Il y a déjà un utilisateur avec cette addresse email.');
        error.expose = true;
        error.status = 400;
        return Promise.reject(error);
      }

    }).then(function () {
      // Generate a new password hash
      if (data.password) {
        return generatePasswordHash(data.password);
      }
    }).then((hash) => {
      // Assign the hashed password
      userData.password = hash;
      // Save the user with the hashed password
      return ticketBookshelf.Model.add.call(this, userData, options);
    }).then(function (user) {
      let accountService = new AccountService();
      return accountService.createContract(user, options);
    });
  },

  /**
   * ## Edit
   * Check that 'status' is not changed
   *
   * @param {Object} data
   * @param {Object} options (optional)
   * @return {Promise(ticketBookshelf.Model)} Edited Model
   */
  edit: function (data, options) {
    let id = options.id;
    data = this.filterData(data);
    options = options || {};
    // options = this.filterOptions(options, 'edit');

    return this.forge({ id: id }).fetch(options).then(function (user) {
      // Prevent manual changes of 'status'
      if (user.get('status') !== data.status) {
        data.status = user.get('status');
      }
      if (user) {
        return user.save(data, options).then(function (project) {
          return project;
        });
      }
    });
  },

  /**
   * ## Check
   * Finds the user by email, and checks the password
   *
   * @param {object} email
   */
  check: function (_userdata) {
    _userdata.email = _userdata.email ? _userdata.email.toLowerCase() : _userdata.email;

    return this.forge({
      email: _userdata.email.toLowerCase()
    }).fetch({ require: true }).then(function (user) {
      debug('Status: ', user.get('status'));
      if (process.env.APPLY_OVER && (user.get('status') !== 'admin' && user.get('status') !== 'corrector')) {
        debug('Not allowed');
        var error = new Error('Les candidatures sont maintenant fermées.');
        error.expose = true;
        error.status = 401;
        return Promise.reject(error);
      }

      return bcrypt.compareAsync(_userdata.password, user.get('password')).then(function (matched) {
        if (!matched) {
          var error = new Error('Votre mot de passe est incorrect.');
          error.expose = true;
          error.status = 401;
          return Promise.reject(error);
        }
        return user;
      }).catch(function(){
        var error = new Error('Votre mot de passe est incorrect.');
        error.expose = true;
        error.status = 401;
        return Promise.reject(error);
      });
    }, function (error) {
      /*jshint unused:false, eqnull:true */
      var error = new Error('Il n\'y a pas d\'utilisateur possédant cette adresse mail: ' + _userdata.email);
      error.expose = true;
      error.status = 401;
      return Promise.reject(error);
    });
  },

  /**
   * ## generateResetToken
   * First step of the "reset my password" funnel
   *
   * @param {String} email
   * @param {String} email
   * @param {object} email
   */
  generateResetToken: function (email, expires, dbHash) {
    return this.getByEmail(email).then(function (foundUser) {
      var hash = crypto.createHash('sha256'),
        text = '';

      // Token:
      // BASE64(TIMESTAMP + email + HASH(TIMESTAMP + email + oldPasswordHash + dbHash ))

      hash.update(String(expires));
      hash.update(email.toLocaleLowerCase());
      hash.update(foundUser.get('password'));
      hash.update(String(dbHash));

      text += [expires, email, hash.digest('base64')].join('|');

      return {
        name: foundUser.attributes.name,
        token: new Buffer(text).toString('base64')
      };
    });
  },

  validateToken: function (token, dbHash) {
    /*jshint bitwise:true*/
    var tokenText = new Buffer(token, 'base64').toString('ascii'),
      parts,
      expires,
      email;

    parts = tokenText.split('|');

    // Check if invalid structure
    if (!parts || parts.length !== 3) {
      return Promise.reject(new Error('Invalid token structure'));
    }

    expires = parseInt(parts[0], 10);
    email = parts[1];

    if (isNaN(expires)) {
      return Promise.reject(new Error('Invalid token expiration'));
    }

    // Check if token is expired to prevent replay attacks
    if ( expires < Date.now() ) {
      let error = new Error('Pour des raisons de sécurité, le lien a expiré. Veuillez recommencer le processus de réinitilaisation de mot de passe.');
      error.expose = true;
      error.status = 400;
      return Promise.reject(error);
    }

    // to prevent brute force attempts to reset the password the combination of email+expires is only allowed for 10 attempts
    if (tokenSecurity[email + '+' + expires] && tokenSecurity[email + '+' + expires].count >= 10) {
      return Promise.reject(new Error('Token locked'));
    }

    return this.generateResetToken(email, expires).then(function (generatedToken) {
      generatedToken = generatedToken.token;
      // Check for matching tokens with timing independent comparison
      var diff = 0,
        i;

      // check if the token lenght is correct
      if (token.length !== generatedToken.length) {
        diff = 1;
      }

      /*jshint -W016*/
      for (i = token.length - 1; i >= 0; i = i - 1) {
        diff |= token.charCodeAt(i) ^ generatedToken.charCodeAt(i);
      }
      /*jshint +W016*/

      if (diff === 0) {
        return Promise.resolve(email);
      }

      // increase the count for email+expires for each failed attempt
      tokenSecurity[email + '+' + expires] = {count: tokenSecurity[email + '+' + expires] ? tokenSecurity[email + '+' + expires].count + 1 : 1};
      return Promise.reject(new Error('Invalid token'));
    });
  },

  resetPassword: function (token, newPassword, /*ne2Password,*/ dbHash, options) {
    var _this = this;

    // if (newPassword !== ne2Password) {
    //   return Promise.reject(new Error('Your new passwords do not match'));
    // }

    return validatePasswordLength({ password: newPassword }).then(function () {
      // Validate the token; returns the email address from token
      return _this.validateToken(token, dbHash);

    }).then(function (email) {
      // Fetch the user by email, and hash the password at the same time.
      return Promise.all([
        _this.forge({ email: email.toLocaleLowerCase() }).fetch({require: true}),
        generatePasswordHash(newPassword)
      ]);
    }).spread(function (foundUser, pwHash) {
      // Update the user with the new password hash
      foundUser.save({ password: pwHash }, options);
      return foundUser;
    });
  },

  getByEmail: function (email) {
    return Users.forge().fetch({ require: true }).then(function (users) {
      var userWithEmail = users.find(function (user) {
        return user.get('email').toLowerCase() === email.toLowerCase();
      });

      if (userWithEmail) {
        return Promise.resolve(userWithEmail);
      }

      let error = new Error('Addresse email inconnue.');
      error.expose = true;
      error.status = 400;
      return Promise.reject(error);
    });
  }

});

Users = ticketBookshelf.Collection.extend({
  model: User
});

module.exports = {
  User: ticketBookshelf.model('User', User),
  Users: ticketBookshelf.collection('Users', Users)
};

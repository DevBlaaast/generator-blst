'use strict';


const path = require('path');
const yeoman = require('yeoman-generator');
const blstutil = require('../util');


module.exports = yeoman.generators.Base.extend({

  defaults: function defaults() {
    this.argument('name', { type: String, required: true });
  },

  init: function () {
    blstutil.update();
  },

  files: function files() {
    this.fs.copyTpl(
      this.templatePath('model.js'),
      this.destinationPath(path.join('models', this.name + '.js')),
      {
        model: this.name
      }
    );
  }
});

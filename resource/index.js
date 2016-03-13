'use strict';


const path = require('path');
const yeoman = require('yeoman-generator');
const blstutil = require('../util');
const prompts = require('./prompts');

module.exports = yeoman.Base.extend({

  defaults: function defaults() {
    this.argument('name', { type: String, required: true });
  },

  init: function () {
    blstutil.update();

    this.resourceName = path.basename(this.name);
    this.resourceNamePlur = path.basename(this.name) + 's';
    this.modelName = this.resourceName.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
    this.resourcePath = path.join('api', this.resourceName, 'index.js');
    this.configPath = path.join('api', this.resourceName, 'config.js');
    this.testPath = path.join('api', this.resourceName, 'test.js');
  },

  files: function files() {
    this.fs.copyTpl(
      this.templatePath('resource.js'),
      this.destinationPath(this.resourcePath),
      {
        resourceName: this.resourceName,
        resourceNamePlur: this.resourceNamePlur,
        modelName: this.modelName,
        modelNameSing: this.modelName.toLowerCase(),
        modelNamePlur: this.resourceNamePlur
      }
    );
    this.fs.copyTpl(
      this.templatePath('config.json'),
      this.destinationPath(this.configPath),
      {
        resourceName: this.resourceName,
        resourceNamePlur: this.resourceNamePlur,
        modelName: this.modelName,
        modelNameSing: this.modelName,
        modelNamePlur: this.resourceNamePlur
      }
    );
    this.fs.copyTpl(
      this.templatePath('test.js'),
      this.destinationPath(this.testPath),
      {
        resourceName: this.resourceName,
        resourceNamePlur: this.resourceNamePlur,
        modelName: this.modelName,
        modelNameSing: this.modelName,
        modelNamePlur: this.resourceNamePlur
      }
    );
  }
});

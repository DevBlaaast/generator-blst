'use strict';

const path = require('path');
const yeoman = require('yeoman-generator');
const prompts = require('./prompts');
const blstutil = require('../util');

blstutil.update();

const debug = require('debug')('generator-blst');

module.exports = yeoman.Base.extend({
  initializing: function () {
    blstutil.banner();
    this.argument('name', { type: String, required: false });
  },

  prompting: {
    askAppNameEarly: function () {
      if (this.name) {
        return;
      }

      var next = this.async();

      // Handle setting the root early, so .yo-rc.json ends up the right place.
      this.prompt([{
        message: 'Name',
        name: 'name',
        validate: function (str) {
          return !!str;
        }
      }], function (props) {
        this.name = props.name;
        next();
      }.bind(this));
    },

    setAppName: function () {
      var oldRoot = this.destinationRoot();
      if (path.basename(oldRoot) !== this.name) {
        this.destinationRoot(path.join(oldRoot, this.name));
      }
    },

    setDefaults: function () {
      // CLI option defaults
      var options = this.options || {};

      // This cannot be done at init time because we have to set our app name and root first.
      this.config.defaults({
        templateModule: options.templateModule,
        componentPackager: options.componentPackager,
        cssModule: options.cssModule,
        jsModule: options.jsModule,
        taskModule: options.taskModule,
        lintModule: options.lintModule,
        i18n: options.i18n
      });

      this.config.set('taskModule', 'grunt'); // There is no other option yet.
      this.config.set('lintModule', 'eslint'); // There is no other option.
    },

    askFor: function askFor() {
      var next = this.async();

      this.prompt(prompts, function (props) {
        for (var key in props) {
          if (props[key] != null) {
            this.config.set(key, props[key]);
          }
        }

        next();
      }.bind(this));
    }
  },

  writing: {

    files: function app() {

      if (this.config.get('appKind') === 'static') {
        this.fs.copyTpl(
          this.templatePath('static/**'),
          this.destinationPath(),
          this._getModel()
        );

        this.fs.copyTpl(
          this.templatePath('static/.*'),
          this.destinationPath(),
          this._getModel()
        );
      }

      if (this.config.get('appKind') === 'api') {
        this.fs.copyTpl(
          this.templatePath('api/**'),
          this.destinationPath(),
          this._getModel()
        );

        this.fs.copyTpl(
          this.templatePath('api/.*'),
          this.destinationPath(),
          this._getModel()
        );
      }
    }
  },

  install: {

    installNpm: function installNpm() {
      if (this.options['skip-install-npm']) {
        return;
      }

      if (this.config.get('appKind') === 'static') {
        this.npmInstall();
        this.bowerInstall();
      }

      if (this.config.get('appKind') === 'api') {
        this.npmInstall();
      }
    }

  },

  _getModel: function getModel() {

    // TODO need real slug here
    var model = {
      slugName: this.name,
      name: this.name
    };

    var conf = this.config.getAll();
    for (var k in conf) {
      model[k] = conf[k];
    }

    return model;
  }

});

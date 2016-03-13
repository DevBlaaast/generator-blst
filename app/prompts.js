'use strict';


module.exports = [{

  message: 'Add a description for your app',
  name: 'description',
  validate: function (str) {
      return !!str;
  }

}, {

  message: 'Who is the author of this app ?',
  name: 'author',
  validate: function (str) {
      return !!str;
  }

}, {

  message: 'What kind of app do you want to build ?',
  type: 'list',
  name: 'appKind',
  choices: [{
    name: 'A static website',
    value: 'static'
  }, {
    name: 'A Koa API',
    value: 'api'
  }]

}];

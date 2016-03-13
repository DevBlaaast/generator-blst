var path = require('path');
var gulp = require('gulp');
var buildPipeline = require('blaaast-build-pipeline');

/**
  Options for the build pipeline

*/
var options = {

  httpRoot: __dirname,

  htmlPages: [
    './index.html'
  ],

  dataPath: path.join(__dirname, 'pages/data.json'),

  locale: path.join(__dirname, 'locale'),

  /**
    HBS only
  */
  webpages: [
    'pages/index.hbs'
  ],
  partials: [
    './pages/partials',
    './pages/homepage'
  ],

  uncssOpts: [
    /hidden/,
    /loader-home/,
    /ball-pulse/
  ],

  /**
    S3 options
  */
  bucketProd: '',
  bucketBeta: ''

}


/**
  Start the pipeline

*/
buildPipeline(gulp, options);

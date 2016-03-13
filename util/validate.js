'use strict';


module.exports = function validate(options) {
  options = options || {};

  var ns = options.namespace && options.namespace.split(':');

  // Ensure `yo blst` was called with a valid sub-generator
  if (ns && ns.length > 1 && ns[1] !== 'app') {
    options.namespace = ns[0];

    console.error('Error: Invalid sub-generator "' + ns[1] + '"');
    process.exit(1);
  }
};

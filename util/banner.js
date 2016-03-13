'use strict';

const chalk = require('chalk');

module.exports = function banner() {
  console.log('');
  console.log(chalk.red.bold('      /\\   /\\   /\\       '));
  console.log(chalk.red.bold('     /  \\ /  \\ /  \\       '));
  console.log(chalk.red.bold('    /    \\    \\    \\      '));
  console.log(chalk.red.bold('   /  /\\  \\/\\  \\/\\  \\  '), chalk.white.bold('Let\'s hack!'));
  console.log(chalk.red.bold('  /  /  \\  \\ \\  \\ \\  \\ '));
  console.log(chalk.red.bold(' /  /____\\  \\_\\  \\_\\  \\  '));
  console.log(chalk.red.bold('/____________\\____\\____\\  '));
  console.log('');
  console.log('Tell me a bit about your application:');
  console.log('');
};

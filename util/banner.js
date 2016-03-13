'use strict';

const chalk = require('chalk');

module.exports = function banner() {
  console.log('');
  console.log(chalk.blue('      /\\   /\\   /\\       '));
  console.log(chalk.blue('     /  \\ /  \\ /  \\       '));
  console.log(chalk.blue('    /    \\    \\    \\      '));
  console.log(chalk.blue('   /  /\\  \\/\\  \\/\\  \\  '), chalk.white.bold('Let\'s hack!'));
  console.log(chalk.blue('  /  /  \\  \\ \\  \\ \\  \\ '));
  console.log(chalk.blue(' /  /____\\  \\_\\  \\_\\  \\  '));
  console.log(chalk.blue('/____________\\____\\____\\  '));
  console.log('');
  console.log('Tell me a bit about your application:');
  console.log('');
};

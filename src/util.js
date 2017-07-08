const { execSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');

const logger = {
  success: buildLogger(chalk.bold.green),
  warn: buildLogger(chalk.bold.yellow),
  info: buildLogger(chalk.bold.blue),
  labelMsg: (label, content) => {
    console.log(chalk.bold.white(label) + ' '  + chalk.cyan(content));
  },
}

function buildLogger(style) {
  return (text) => {
    console.log(style(text));
    return logger;
  }
}

function executeCommand(commandString) {
  execSync(commandString, {stdio: 'inherit'});
}

function getFishHistory(max = 10) {
  return fs.readFileSync(`${process.env['HOME']}/.local/share/fish/fish_history`, 'utf8')
    .split('\n')
    .filter((row) => row.startsWith('- cmd: '))
    .map((row) => row.replace('- cmd: ', ''))
    .slice(max*-1)
    .reverse();
}

module.exports = {
  executeCommand: executeCommand,
  getFishHistory: getFishHistory,
  logger: logger
}

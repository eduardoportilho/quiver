const { execSync } = require('child_process');
const fs = require('fs');

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
}

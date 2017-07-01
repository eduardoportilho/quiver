const { execSync } = require('child_process');

function executeCommand(commandString) {
  execSync(commandString, {stdio: 'inherit'});
}

module.exports = {
  executeCommand: executeCommand,
}

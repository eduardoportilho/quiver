const inquirer = require('inquirer');
const { getCommands, addCommand } = require('../commands');
const { executeCommand } = require('../util');

inquirer.prompt({
  type: 'list',
  name: 'cmd',
  message: 'Run command:',
  choices: getCommands()
}).then(function (result) {
  executeCommand(result.cmd);
});

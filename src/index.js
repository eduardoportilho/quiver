#! /usr/bin/env node
const inquirer = require('inquirer');
const commandsService = require('./commands');
const utilService = require('./util');
var Promise = require('promise');

const logger = utilService.logger;

// register inquirer autocomplete
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

// remove 'node' and 'file.js'
main(process.argv.slice(2));

function main(args) {
  if (args.length === 0) {
    listCommandsAndRun();
  }
  else if (args[0] === 'add') {
    addCommand(args.slice(1));
  }
  else if (args[0] === 'rm') {
    removeCommands(args.slice(1));
  }
  else if (args[0] === 'ls') {
    listCommands();
  }
  else if (args[0].charAt(0) === '!') {
    runPreviousCommand(args[0]);
  }
}

function listCommands() {
  const commands = commandsService.getCommands()
  if(commands.length === 0) {
    logger.warn(`No commands found!`); 
  } else {
    commands.forEach(cmd => logger.labelMsg('>', cmd)); 
  }
}

function listCommandsAndRun() {
  const commands = commandsService.getCommands();
  if(commands.length === 0) {
    logger.warn(`No commands found!`);
    return;
  }
  inquirer.prompt({
    type: 'autocomplete',
    name: 'cmd',
    message: 'Run command:',
    source: function(answersSoFar, input) {
      input = input || '';
      return new Promise(function(resolve) {
        const filtered = commands.filter(function(cmd) {
          return cmd.toLowerCase().includes(input.toLowerCase());
        });
        resolve(filtered);
      });
    },
  }).then(function (result) {
    commandsService.moveToTop(result.cmd);
    utilService.executeCommand(result.cmd);
  });
}

function runPreviousCommand(arg) {
  const commands = commandsService.getCommands();
  if(commands.length === 0) {
    logger.warn(`No commands found!`);
    return;
  }
  let commandIndex = arg.length - 1;
  if (commandIndex => commands.length) {
    commandIndex = commandIndex % commands.length;
  } 
  const command = commands[commandIndex];
  logger.labelMsg('Run command:', command);
  commandsService.moveToTop(command);
  utilService.executeCommand(command);
}

function addCommand(args) {
  if (args.length === 0) {
    askForCommandAndAdd();
  } else if (args[0] === '-h' || args[0] === '--history') {
    showCommandHistoryAndAdd();
  } else {
    const command = args.join(' ');
    commandsService.addCommand(command);
    logger.success(`Command added: "${command}"`);
  }
}

function askForCommandAndAdd() {
  inquirer.prompt({
    type: 'input',
    name: 'cmd',
    message: 'Enter the command to add:'
  }).then(function (result) {
    const command = result.cmd;
    commandsService.addCommand(command);
    logger.success(`Command added: "${command}"`);
  });
}

function showCommandHistoryAndAdd() {
  const history = utilService.getFishHistory();
  inquirer.prompt({
    type: 'list',
    name: 'cmd',
    message: 'Choose a command to add:',
    choices: history
  }).then(function (result) {
    const command = result.cmd;
    commandsService.addCommand(command);
    logger.success(`Command added: "${command}"`);
  });
}

function removeCommands(args) {
  const commands = commandsService.getCommands();
  const commandChoices = commands.map((cmd, i) => ({
    name: cmd,
    value: i,
  }));
  inquirer.prompt({
    type: 'checkbox',
    name: 'commandIndexes',
    message: 'Choose the commands to remove:',
    choices: commandChoices
  }).then(function (result) {
    // Delete from the last index to the first to avoid changing 
    // the position of an element that will be removed.
    const indexes = result.commandIndexes.sort().reverse();
    indexes.forEach((index) => {
      commands.splice(index, 1);
    });
    commandsService.setCommands(commands);
    logger.success('Done!');
  });
}

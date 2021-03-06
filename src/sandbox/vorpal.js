#! /usr/bin/env node
const vorpal = require('vorpal')();
const { executeCommand, getFishHistory } = require('./util');
const { getCommands, addCommand } = require('./commands');

const HISTORY_COUNT = 10
const LOCAL_STORAGE_ID = 'quiver'
const COMMANDS_LOCAL_STORAGE_ID = 'commands'
const SEPARATOR = ':::'

vorpal.localStorage(LOCAL_STORAGE_ID);

/**
 * Unhandled commands: when user type part of the command and hit enter
 * we pass the input to _listAndRun 
 */
vorpal
  .catch('[words...]', 'Executes a command')
  .action(function (args, callback) {
    callback();
    vorpal.ui.input(args.words.join(' '));
    vorpal.exec('_listAndRun');
  });

/**
 * Add commands from history
 */
vorpal
  .command('add', 'Add entries from history')
  .action(function(args, callback) {
    const enterNewCommandOption = '<Enter a new command>';

    let fishHistory = getFishHistory(HISTORY_COUNT);
    fishHistory.unshift(enterNewCommandOption);

    this.prompt({
      type: 'list',
      name: 'cmd',
      message: 'Chose a command to store:',
      choices: fishHistory
    }, function (result) {
      const commandString = result.cmd;
      if (commandString === enterNewCommandOption) {
        promptForCommandToAdd.call(this, callback);
      } else {
        addCommand(commandString);
        return callback(); 
      }
    }.bind(this));
  });

/**
 * Remove commands from history
 */
vorpal
  .command('rm', 'Remove command from list')
  .action(function(args, callback) {
    let commands = getCommands();
    if (commands.length === 0) {
      this.log(`>>> No commands stored, try adding one using "add".`);
      callback();
      return;
    }

    this.prompt({
      type: 'list',
      name: 'cmd',
      message: 'Remove command::',
      choices: commands
    }, function (result) {
      const commandString = result.cmd;
      let index = commands.indexOf(commandString);
      commands.splice(index, 1);
      storeCommands(commands);
      return callback();
    }.bind(this));
  });

/**
 * List stored commands
 */
vorpal
  .command('ls', 'List commands')
  .action(function(args, callback) {
    let commands = getCommands();
    commands.forEach((cmd) => {
      this.log(`> ${cmd}`)
    })
    callback();
  });

/**
 * Run command from list
 */
vorpal
  .command('_listAndRun', 'List executables')
  .hidden()
  .action(function(args, callback) {
    let commands = getCommands();
    if (commands.length === 0) {
      this.log(`>>> No commands stored, try adding one using "add".`);
      return callback();
    }

    const input = vorpal.ui.input();
    let filteredCmds = filterCommandsContaining(commands, input)
    if (!filteredCmds.length) {
      this.log(`No commands with found containing "${input}", listing all...\n`)
      filteredCmds = commands
    }

    this.prompt({
      type: 'list',
      name: 'cmd',
      message: 'Run command:',
      choices: filteredCmds
    }, function (result) {
      const commandString = result.cmd;
      vorpal.hide();
      callback();
      executeCommand(commandString);
    }.bind(this));
  });

/**
 * Handle keypress
 */
vorpal.on('keypress', function (event) {
  const listKeys = ['tab', 'up', 'down']
  if (listKeys.includes(event.key)) {
    var input = event.value
    vorpal.exec('_listAndRun')
  }
})

/**
 * Run quiver
 */
vorpal
  .delimiter('quiver$')
  .show();

/**
 * Helper functions
 */

function promptForCommandToAdd(callback) {
  this.prompt({
      type: 'input',
      name: 'cmd',
      message: 'Enter the command:'
    }, function (result) {
      const commandString = result.cmd;
      addCommand(commandString);
      callback();
    });
}

function filterCommandsContaining(all, text) {
  return all.filter(function(cmd) {
    return cmd.toLowerCase().includes(text.toLowerCase());
  })
}

const LocalStorage = require('node-localstorage').LocalStorage;

const COMMANDS_ITEM_ID = 'commands'
const COMMAND_SEPARATOR = ':::'

const path = require('path');
const os = require('os');
const localStoragePath = path.normalize(path.join(os.tmpdir(), '/.quiver'));
const localStorage = new LocalStorage(localStoragePath);

/**
 * Return all stored commands.
 * @return {string[]} List of commands.
 */
function getCommands() {
  let value = localStorage
    .getItem(COMMANDS_ITEM_ID) || '';
  if (value.length <= 0) {
    return [];
  }
  return value.split(COMMAND_SEPARATOR);
}

/**
 * Add a command to the store.
 * @param {string} commandString - Command to add.
 */
function addCommand(commandString) {
  let commands = getCommands();
  commands.push(commandString);
  setCommands(commands);
}

/**
 * Replace the stored command list by the provided one.
 * @param {string[]} commands - List of commands.
 */
function setCommands(commands) {
  let value = '';
  if (commands.length > 0) {
    value = commands.join(COMMAND_SEPARATOR)
  }
  localStorage.setItem(COMMANDS_ITEM_ID, value);
}

/**
 * Move the command to the first position of the list.
 * @param  {string} command - Command to move.
 */
function moveToTop(command) {
  let commands = getCommands();
  let index = commands.indexOf(command);
  if (index >= 0) {
  commands.splice(index, 1);
  }
  commands.unshift(command);
  setCommands(commands);
}

module.exports = {
  getCommands: getCommands,
  addCommand: addCommand,
  setCommands: setCommands,
  moveToTop: moveToTop,
}

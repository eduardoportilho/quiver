const LocalStorage = require('node-localstorage').LocalStorage;
const COMMAND_SEPARATOR = ':::';

const path = require('path');
const os = require('os');
const localStoragePath = path.normalize(path.join(os.tmpdir(), '/.quiver'));
const localStorage = new LocalStorage(localStoragePath);

let commandEntryKey = 'commands';

/**
 * Set the command group id.
 * @param {string} group
 */
function setCommandGroup(group) {
  commandEntryKey = `commands_${group}`;
}

/**
 * Return all stored commands.
 * @return {string[]} List of commands.
 */
function getCommands() {
  let value = localStorage
    .getItem(commandEntryKey) || '';
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
  localStorage.setItem(commandEntryKey, value);
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
  setCommandGroup: setCommandGroup,
  getCommands: getCommands,
  addCommand: addCommand,
  setCommands: setCommands,
  moveToTop: moveToTop,
}

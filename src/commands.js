const LocalStorage = require('node-localstorage').LocalStorage;

const LOCAL_STORAGE_ID = 'quiver'
const COMMANDS_ITEM_ID = 'commands'
const COMMAND_SEPARATOR = ':::'

const localStorage = new LocalStorage(LOCAL_STORAGE_ID);

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

module.exports = {
  getCommands: getCommands,
  addCommand: addCommand,
}

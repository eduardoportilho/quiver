const LocalStorage = require('node-localstorage').LocalStorage;
const COMMAND_SEPARATOR = ':::';

const path = require('path');
const os = require('os');
const localStoragePath = path.normalize(path.join(os.tmpdir(), '/.quiver'));
const localStorage = new LocalStorage(localStoragePath);
const defaultGroup = 'group_default';

let currentGroup = defaultGroup;

/**
 * Return the path where the commands are stored.
 * @return {string} Storage path.
 */
function getStoragePath() {
  return localStoragePath;
}

/**
 * Set the command group id.
 * @param {string} group
 */
function setCommandGroup(group) {
  currentGroup = `group_${group}`;
}

/**
 * Return all stored commands.
 * @return {string[]} List of commands.
 */
function getCommands(group = currentGroup) {
  let value = localStorage
    .getItem(group) || '';
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
  localStorage.setItem(currentGroup, value);
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

/**
 * List the groups and its commands.
 * @return {Object} Object with the group in the key and an array of commans in the value.
 */
function getCommandGroups() {
  let cmdGroups = {};
  const keyCount = localStorage.length;
  for (let i = 0; i < keyCount; i++) {
    let key = localStorage.key(i);
    let commands = getCommands(key);
    if (key) {
      key = key.replace('group_', '');
    }
    cmdGroups[key] = commands;
  }
  return cmdGroups;
}

module.exports = {
  setCommandGroup: setCommandGroup,
  getCommands: getCommands,
  addCommand: addCommand,
  setCommands: setCommands,
  moveToTop: moveToTop,
  getCommandGroups: getCommandGroups,
  getStoragePath: getStoragePath,
}

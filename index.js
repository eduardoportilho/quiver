var nodecmd = require('node-cmd');
var fs = require('fs');
var vorpal = require('vorpal')();
const { execSync } = require('child_process');

const HISTORY_COUNT = 5

var COMMANDS = [
  'ls -lisa',
  '/Applications/Spotify.app/Contents/MacOS/Spotify --app-directory=./apps',
  '/Applications/Spotify.app/Contents/MacOS/Spotify --app-directory=./apps2',
  '/Applications/Spotify.app/Contents/MacOS/Spotify --app-directory=./apps3',
  '/Applications/Spotify.app/Contents/MacOS/Spotify --app-directory=./apps4',
  'yarn build recently-played',
  'yarn build glue-reference',
];

vorpal
  .catch('[words...]', 'Executes a command')
  .action(function (args, callback) {
    callback();
    vorpal.ui.input(args.words.join(' '));
    vorpal.exec('_list');
  });

vorpal
  .command('hist', 'List entries from history')
  .action(function(args, callback) {
    let fishHistory = fs.readFileSync('/Users/eduardoportilho/.local/share/fish/fish_history', 'utf8')
      .split('\n')
      .filter((row) => row.startsWith('- cmd: '))
      .map((row) => row.replace('- cmd: ', ''))
      .slice(HISTORY_COUNT*-1)
      .reverse();

    this.prompt({
      type: 'list',
      name: 'cmd',
      message: 'Hstory:',
      choices: fishHistory
    }, function (result) {
      callback();
    }.bind(this));
  });

vorpal
  .command('_list', 'List executables')
  .hidden()
  .action(function(args, callback) {
    const input = vorpal.ui.input();
    let filteredCmds = getCommandsContaining(COMMANDS, input)
    if (!filteredCmds.length) {
      this.log(`No commands with found containing "${input}", listing all...\n`)
      filteredCmds = COMMANDS
    }

    this.prompt({
      type: 'list',
      name: 'cmd',
      message: 'Run command:',
      choices: filteredCmds
    }, function (result) {
      const commandString = result.cmd;

      // Set the input:
      // callback();
      // vorpal.ui.input(result.cmd);
      
      //Run and quit
      //this.log(`run "${commandString}"`);
      vorpal.hide();
      
      callback();
      executeCommand(commandString);
    }.bind(this));
  });

vorpal.on('keypress', function (event) {
  const listKeys = ['tab', 'up', 'down']
  if (listKeys.includes(event.key)) {
    var input = event.value
    vorpal.exec('_list')
  }
})

vorpal
  .delimiter('quiver$')
  .show();


function executeCommand(commandString) {
  execSync(commandString, {stdio: 'inherit'});
}

function getCommandsContaining(all, text) {
  return all.filter(function(cmd) {
    return cmd.toLowerCase().includes(text.toLowerCase());
  })
}

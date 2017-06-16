var vorpal = require('vorpal')()

var COMMANDS = [
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
      const cmd = result.cmd;

      // Set the input:
      // callback();
      // vorpal.ui.input(result.cmd);
      
      //Run and quit
      this.log(`run "${cmd}"`);
      vorpal.hide();
      callback();

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


function getCommandsContaining(all, text) {
  return all.filter(function(cmd) {
    return cmd.toLowerCase().includes(text.toLowerCase());
  })
}

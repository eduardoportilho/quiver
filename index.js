var vorpal = require('vorpal')()

var COMMANDS = [
  'yarn build recently-played',
  'yarn build glue-reference',
  '/Applications/Spotify.app/Contents/MacOS/Spotify --app-directory=./apps',
  '/Applications/Spotify.app/Contents/MacOS/Spotify --app-directory=./apps2',
  '/Applications/Spotify.app/Contents/MacOS/Spotify --app-directory=./apps3',
  '/Applications/Spotify.app/Contents/MacOS/Spotify --app-directory=./apps4',
];

COMMANDS.forEach(function(cmd) {
  vorpal
      .command(cmd, 'Help ' + cmd)
      .action(function(args, callback) {
        this.log(cmd);
        callback();
      });
});

vorpal
  .delimiter('quiver$')
  .show();
  
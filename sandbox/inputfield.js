var term = require( 'terminal-kit' ).terminal;

var COMMANDS = [
  'yarn build recently-played',
  'yarn build glue-reference',
  '/Applications/Spotify.app/Contents/MacOS/Spotify --app-directory=./apps',
  '/Applications/Spotify.app/Contents/MacOS/Spotify --app-directory=./apps2',
  '/Applications/Spotify.app/Contents/MacOS/Spotify --app-directory=./apps3',
  '/Applications/Spotify.app/Contents/MacOS/Spotify --app-directory=./apps4',
];

term.bold.green('Type part of your command: ');
term.inputField({
    // autoComplete: commands,
    autoComplete: function (text) {
      var cmdsStartingWith = getCommandsStartingWith(text)
      if (cmdsStartingWith.length > 1) {
        var commonInitialSubstring =  getCommonInitialSubstring(cmdsStartingWith)
        if (commonInitialSubstring !== text) {
          return commonInitialSubstring;
        }
      }
      var cmdsContaining = getCommandsContaining(text)
      if (cmdsContaining.length === 0) {
        return text
      }
      return cmdsContaining.length === 1 ? cmdsContaining[0] : cmdsContaining;
    },
    autoCompleteMenu: true,
    autoCompleteHint: true,
  },
  function(error, input) {
    term.green("\nRun command: '%s'\n" , input);
    process.exit() ;
  }
);

function getCommandsStartingWith(text) {
  return COMMANDS.filter(function(cmd) { 
    return cmd.startsWith(text);
  })
}

function getCommandsContaining(text) {
  return COMMANDS.filter(function(cmd) {
    return cmd.toLowerCase().includes(text.toLowerCase());
  })
}

function getCommonInitialSubstring(commands) {
  if (commands.length === 0) return '';
  if (commands.length === 1) return commands[0];

  var commonInitialSubstring = []
  var index = 0
  for (var index = 0; index < commands[0].length ; index++) {
    var char = commands[0].charAt(index)
    if (commands.some(hasDifferentCharAtIndex(char, index))) {
      break;
    }
    commonInitialSubstring.push(char);
  }
  return commonInitialSubstring.join('');
}

function hasDifferentCharAtIndex(char, index) {
  return function(text) {
    return index >= text.length || text.charAt(index) !== char;
  }
}

/***************************************************
 * Desired behaviour:
 *  - User types (any key but the ones bellow):
 *    - echo the typing
 *    - display the list of filtered commands
 * - UP, DOWN:
 *    - Highlight item on the filtered command list
 * - ENTER:
 *    - Execute highlighted command
 *    
 * Aproaches:
 *  1. inputField
 *     - Implement much of the desired behaviour (with autocomplete)
 *     - Maybe a bit inflexible on the UX:
 *         - TAB for cicling trough the options
 *         - Does not update menu while typing
 *           - autoCompleteHint makes it better
 *         - Single line menu sucks for long commands
 *         
 *  2. grabInput
 *     - Lower level, will require a lot of code
 * 
 * Next steps:
 *  ✔ 1. Implement prototype with autocomplete
 *  2. Implement prototype with grabInput
 *  ?. Implement prototype with vorpal 
 *  
 ***************************************************/
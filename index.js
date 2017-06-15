var term = require( 'terminal-kit' ).terminal;

var commands = [
  'aaa',
  'aab',
  'abb',
  'bbb',
];

term.bold.green('Type part of your command: ');

// - User types (any key but the ones bellow):
//    - echo the typing
//    - display the list of filtered commands
// - UP, DOWN:
//    - Highlight item on the filtered command list
// - ENTER:
//    - Execute highlighted command

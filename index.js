var term = require( 'terminal-kit' ).terminal;

var commands = [
  'aaa',
  'aab',
  'abb',
  'bbb',
];

term.bold.green('Type part of your command: ');

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
 *         
 *  2. grabInput
 *     - Lower level, will require a lot of code
 * 
 * Next steps:
 *  1. Implemt prototype with autocomplete
 *  
 ***************************************************/
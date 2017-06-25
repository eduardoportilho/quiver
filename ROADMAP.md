# Roadmap

## Desired behaviour:
- User types (any key but the ones bellow):
   - echo the typing
   - display the list of filtered commands
- UP, DOWN:
   - Highlight item on the filtered command list
- ENTER:
   - Execute highlighted command
   
## Aproaches:
 1. inputField
    - Implement much of the desired behaviour (with autocomplete)
    - Maybe a bit inflexible on the UX:
        - TAB for cicling trough the options
          - Maybe fixed with keybindings? 
        - Does not update menu while typing
          - autoCompleteHint makes it better
        - Single line menu sucks for long commands
          - PR to fix?
        
 2. grabInput
    - Lower level, will require a lot of code
    
 3. vorpal
    - Don't have menus -> bad UX

 4. Extend fish

## Next steps:
  1. UI
    ✔ 1. Implement prototype with inputField
      - Pretty close
    ✖️ 2. Implement prototype with grabInput
      - Too much work
    ? 3. Implement prototype with vorpal
      - Bad UX on highlevel (no menu?)
      - Test lowlevel implementation with redrw?
    4. Test other libs
    5. Extend fish
    6. Patch inputField
 2. Read commands from bash/fish history
 3. Store commands
 4. Execute commands
    - https://www.npmjs.com/package/node-cmd

## Problems:
* Add /Applications/Spotify.app/Contents/MacOS/Spotify --app-directory=./apps
  -  Error: Invalid option: 'app-'. Showing Help:
* How to cancel an rm? Ctrl-C doesn't work.
  - Implement a inquirer prompt https://github.com/SBoudrias/Inquirer.js/blob/master/lib/prompts/input.js

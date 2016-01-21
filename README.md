# tetris

Like the name says, this is a Tetris Game, built using Angular and ES6.

### How to Play

either open [this link](http://mido22.github.io/tetris/) in new tab or : 
  
 * Download the project and extract it.
 * Open the `index.html` file in either Firefox or chrome.
 * Press Enter key to start game. Also hints can be found on the bottom of the page( can be turned off by pressing 'h' key)

### Dependencies

 * `grunt` - for development automation.
 * `Angular` - for two-way view binding.
 * `Browserify` - for compiling individual JS modules.
 * `Babel` - ES6 to ES5 conversion.
 * `Mocha` - Unit testing the modules.
 * `jade` - Well, I hate the html tags, so pre-processor for that.
 * `scss` - for css preprocessing, not really needed in this project( but was part of my boilerplate so left it as it is).


### Project Structure

 * `prod` - contains code that can be deployed in any server.
 * `test` - contains the unit test files.
 * `server` - contains nodejs server code for hosting all of this, since this is all client-side code, it might as well be any http static file server.
 * `client` - main folder, contains all the application related code.
   * `js` - the javascript files( both for angular controller and Tetris game code( found inside `tetris` folder) ) 
   * `jade` - contains the view related files which will be converted to html.
   * `scss` - the css files
   * `static` - images/ font and other files that needs to be copied for deployment.

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Tetris = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Piece = require('./piece');

// the model holding all the co-ordinates of fixed/immovable pieces, also methods for checking if there are any overlapping pieces.

var Board = function (_Piece) {
  _inherits(Board, _Piece);

  // height- desired board height,
  // width - desired board width

  function Board(height, width) {
    _classCallCheck(this, Board);

    if (!height || !width) throw new Error('Params Missing!!!');
    var coords = [];
    for (var i = 0; i < height; i++) {
      coords[i] = [];
      for (var j = 0; j < width; j++) {
        coords[i].push(0);
      }
    }

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Board).call(this, coords));

    _this.score = 0;
    return _this;
  }
  // 'y' coordinate(height)  topmost fixed block in the board, used for determining if game over

  _createClass(Board, [{
    key: 'addPiece',

    // method for assimilating a mobile piece as immovable blocks in the board
    value: function addPiece(piece) {
      if (this.spaceConflict(piece)) throw new Error('There seems to be a conflict!!!');
      var x = piece.x,
          y = piece.y,
          coords = piece.coords;
      for (var i = 0; i < piece.height; i++) {
        for (var j = 0; j < piece.width; j++) {
          if (this.coords[y - i]) this.coords[y - i][x + j] = coords[i][j] + this.coords[y - i][x + j];
        }
      }this.clearFilled();
    }
    // method for clearing the compeleted rows and updating score, would itself recursively till all completely filled rows are removed.

  }, {
    key: 'clearFilled',
    value: function clearFilled() {
      var clearAgain = false;
      for (var i = 0; i < this.height && !clearAgain; i++) {
        var sum = this.coords[i].reduce(function (prev, val) {
          return prev + val;
        }, 0);
        if (sum == this.width) {
          clearAgain = true;
          var zeroArray = this.coords.splice(i, 1)[0];
          zeroArray = zeroArray.map(function (i) {
            return 0;
          });
          this.coords.push(zeroArray);
          this.score += sum;
        }
      }
      if (clearAgain) this.clearFilled();
    }
    // method for checking if the mobile piece is overlapping with any of the fixed blocks.

  }, {
    key: 'spaceConflict',
    value: function spaceConflict(piece) {
      var conflict = false,
          x = piece.x,
          y = piece.y,
          coords = piece.coords;
      for (var i = 0; i < piece.height; i++) {
        for (var j = 0; j < piece.width; j++) {
          if (coords[i] && coords[i][j] && this.coords[y - i] && this.coords[y - i][x + j]) return true;
        }
      }return conflict;
    }
  }, {
    key: 'peak',
    get: function get() {
      var highestPoint = -1,
          i = 0;
      while (this.coords[i] && this.coords[i].reduce(function (prev, val) {
        return prev + val;
      }, 0)) {
        i++;
        highestPoint++;
      }
      return highestPoint;
    }
  }]);

  return Board;
}(Piece);

module.exports = Board;

},{"./piece":5}],2:[function(require,module,exports){
'use strict';
// Config object that holds the various configuration details...

// move piece down every 300ms

module.exports.moveIntervalTime = 300;

// Tetris board size range...
module.exports.range = {
  height: {
    min: 10,
    max: 21
  },
  width: {
    min: 10,
    max: 21
  }
};

// various block options to choose the random block from.
module.exports.coordOptions = [
// square block
[[1, 1], [1, 1]],
// line block
[[1], [1], [1], [1]],
// L block
[[1, 0], [1, 0], [1, 0], [1, 1]],
// Z block
[[0, 1, 1], [1, 1, 0]],
//T block
[[1, 0], [1, 1], [1, 0]]];

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Piece = require('./piece');

// the moving block which can turn, has co-ordinates

var MobilePiece = function (_Piece) {
  _inherits(MobilePiece, _Piece);

  // cfg -{
  //   tableHeight - height of the board
  //   tableWidth - width of the board
  //   coords - Array of Array having structure of the said block
  // }

  function MobilePiece(cfg) {
    _classCallCheck(this, MobilePiece);

    if (!cfg.tableHeight || !cfg.tableWidth) throw new Error('Params missing');

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MobilePiece).call(this, cfg.coords));

    _this.tableWidth = cfg.tableWidth;
    _this.tableHeight = cfg.tableHeight;
    _this.x = Math.floor((cfg.tableWidth - _this.width) / 2);
    _this.y = cfg.tableHeight + _this.height - 1;
    return _this;
  }
  // for rotating the piece 90 degree clockwise direction.

  _createClass(MobilePiece, [{
    key: 'turn',
    value: function turn() {
      this.save();
      var x = this.coords.length,
          y = this.coords[0].length,
          newCoords = [];
      for (var i = 0; i < y; i++) {
        newCoords[i] = [];
        for (var j = 0; j < x; j++) {
          newCoords[i].push(this.coords[j][i]);
        }newCoords[i].reverse();
      }
      this.coords = newCoords;
    }
    // for retreating the previous saved state of model

  }, {
    key: 'undo',
    value: function undo() {
      var state = this.getState();
      for (var key in state) {
        this[key] = state[key];
      }
    }
    // for saving the current state of the model

  }, {
    key: 'save',
    value: function save() {
      var coords = this.coords.slice(0).map(function (row) {
        return row.slice(0);
      }); // shadow cloning array of arrays.
      _get(Object.getPrototypeOf(MobilePiece.prototype), 'save', this).call(this, {
        coords: coords,
        x: this.x,
        y: this.y
      });
    }
    // moving the piece one column left( as long as no blocks collide with board edge)

  }, {
    key: 'left',
    value: function left() {
      this.save();
      this.x--;
      this.isConflict();
    }
    // moving the piece one column right( as long as no blocks collide with board edge)

  }, {
    key: 'right',
    value: function right() {
      this.save();
      this.x++;
      this.isConflict();
    }
    // moving the piece one row below( as long as no blocks collide with board edge)

  }, {
    key: 'down',
    value: function down() {
      this.save();
      this.y--;
      this.isConflict();
    }
    // returns boolean - for checking if the model collides with board edge

  }, {
    key: 'isConflict',
    value: function isConflict() {
      var conflict = false;
      if (this.x < 0 || this.x + this.width > this.tableWidth) conflict = true;
      if (this.y - this.height + 1 < 0) conflict = true;
      if (conflict) this.undo();
    }
  }]);

  return MobilePiece;
}(Piece);

module.exports = MobilePiece;

},{"./piece":5}],4:[function(require,module,exports){
'use strict';

var Config = require('./config'),
    Utils = require('./utils'),
    MobilePiece = require('./mobilePiece'),

// various block options to choose the random block from.
coordOptions = Config.coordOptions;

// method for creating random mobile block.
function getPiece(tableHeight, tableWidth) {
  if (!tableHeight || !tableWidth) throw new Error('Params Missing!!!');

  var coords = coordOptions[Utils.getRandom(coordOptions.length)],
      piece = new MobilePiece({
    coords: coords,
    tableWidth: tableWidth,
    tableHeight: tableHeight
  }),
      turnCount = Utils.getRandom(4);
  while (turnCount) {
    turnCount--;
    piece.turn();
  }
  return piece;
}

// Factory for creating random mobile block.
module.exports = {
  getPiece: getPiece
};

},{"./config":2,"./mobilePiece":3,"./utils":7}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Utils = require('./utils');

// Super class containing common features of a block

var Piece = function (_Utils$Memento) {
  _inherits(Piece, _Utils$Memento);

  function Piece(coords) {
    _classCallCheck(this, Piece);

    if (!coords) throw new Error('Co-ords Array Missing!!!');

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Piece).call(this));

    _this.coords = coords;
    return _this;
  }

  _createClass(Piece, [{
    key: 'width',
    get: function get() {
      return this.coords[0].length;
    }
  }, {
    key: 'height',
    get: function get() {
      return this.coords.length;
    }
  }]);

  return Piece;
}(Utils.Memento);

module.exports = Piece;

},{"./utils":7}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Config = require('./config'),
    Utils = require('./utils'),
    MobilePieceFactory = require('./mobilePieceFactory'),
    Board = require('./board');

// The controller object that holds all the game logic and models within, extends EventEmitter to notify the view when change occurs

var Tetris = function (_Utils$EventEmitter) {
  _inherits(Tetris, _Utils$EventEmitter);

  function Tetris() {
    _classCallCheck(this, Tetris);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Tetris).call(this));

    _this.status = 'yetToStart'; // flag indicating the game status( yetToStart, started, stopped)
    return _this;
  }
  // method for starting new tetris game, we prodide the table dimensions as parameters to the method

  _createClass(Tetris, [{
    key: 'startNewGame',
    value: function startNewGame(height, width) {
      if (!height || !width) throw new Error('Params Missing');
      this.status = 'started';
      this.height = height;
      this.width = width;
      this.mobile = null; // the piece moving on the table
      this.board = new Board(height, width); // object holding coordinated of the uncleared blocks.
      this.getNextPiece();
      this.moveInterval = setInterval(this.movePieceDown.bind(this), Config.moveIntervalTime);
    }
    // move the mobile piece one row down (if possible)

  }, {
    key: 'movePieceDown',
    value: function movePieceDown() {
      if (this.status == 'stopped') {
        if (this.moveInterval) clearInterval(this.moveInterval);
        if (!this._finishCalled) this.finish();
        return;
      }
      this.mobile.down();
      if (this.board.spaceConflict(this.mobile)) {
        this.mobile.undo();
        this.getNextPiece();
      } else if (this.mobile.y + 1 - this.mobile.height == 0) {
        // the mobile piece has reached the bottom of the floor.
        this.getNextPiece();
      } else {
        this.emit('update UI');
      }
    }
    // move the mobile piece one column left (if possible)

  }, {
    key: 'movePieceLeft',
    value: function movePieceLeft() {
      this.mobile.left();
      this.undoIfConflict();
    }
    // move the mobile piece one column right (if possible)

  }, {
    key: 'movePieceRight',
    value: function movePieceRight() {
      this.mobile.right();
      this.undoIfConflict();
    }
    // rotate the mobile piece 90 degree clockwise (if possible)

  }, {
    key: 'rotatePiece',
    value: function rotatePiece() {
      this.mobile.turn();
      this.undoIfConflict();
    }
    // restore previous state of mobile piece if current state overlaps with table wall or fixed blocks

  }, {
    key: 'undoIfConflict',
    value: function undoIfConflict() {
      if (this.board.spaceConflict(this.mobile)) this.mobile.undo();
    }
    // method for retriving next random mobile block also for checking if the game has finished.

  }, {
    key: 'getNextPiece',
    value: function getNextPiece() {
      if (this.status == 'stopped') {
        if (!this._finishCalled) this.finish();
        return;
      }
      try {
        if (this.mobile) {
          if (this.mobile.y >= this.height) return this.finish();
          this.board.addPiece(this.mobile);
          this.mobile = null;
          if (this.board.peak >= this.height) return this.finish();
        }
      } catch (e) {
        return this.finish();
      }
      if (!this.nextPiece) this.nextPiece = MobilePieceFactory.getPiece(this.height, this.width);
      this.mobile = this.nextPiece;
      this.nextPiece = MobilePieceFactory.getPiece(this.height, this.width);
      if (this.board.spaceConflict(this.mobile)) return this.finish();
      this.emit('update UI');
    }
    // method to signal view tha the game has finished.

  }, {
    key: 'finish',
    value: function finish() {
      this.status = 'stopped';
      this._finishCalled = true;
      this.emit('game over', this.board.score);
    }
    // method to retrieve table details(  fixed blocks as 1 and mobile blocks as 2) to be displayed to the user.

  }, {
    key: 'getViewCoords',
    value: function getViewCoords() {
      if (!this.mobile) return;
      var viewCoords = undefined,
          x = this.mobile.x,
          y = this.mobile.y,
          coords = this.mobile.coords,
          height = this.mobile.height,
          width = this.mobile.width;
      viewCoords = this.board.coords.map(function (ele) {
        return ele.slice(0);
      }); // cloning array of arrays
      for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
          if (viewCoords[y - i] && (viewCoords[y - i][x + j] == 0 || viewCoords[y - i][x + j])) viewCoords[y - i][x + j] = viewCoords[y - i][x + j] + coords[i][j] * 2;
        }
      }return viewCoords.reverse();
    }
  }]);

  return Tetris;
}(Utils.EventEmitter);

module.exports = Tetris;

},{"./board":1,"./config":2,"./mobilePieceFactory":4,"./utils":7}],7:[function(require,module,exports){
'use strict';
// the mini helper functions encapsulated in Utils object

// method that return random number, with ceil+1 passed as 'max' parameter

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getRandom(max) {
  if (!max) throw new Error('Param Missing');
  var num = Math.round(max * Math.random() - .5);
  if (num == max) num--;
  return num;
}

// kind of observer pattern for notifying observers when a certain event occurs...

var EventEmitter = function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this._emitters = new Map();
  }

  _createClass(EventEmitter, [{
    key: 'emit',
    value: function emit(channel, data) {
      if (!this._emitters.has(channel)) throw new Error('But nobody is listening!!!');
      this._emitters.get(channel).forEach(function (fn) {
        return fn(data);
      });
    }
  }, {
    key: 'addListener',
    value: function addListener(channel, listener) {
      if (!this._emitters.has(channel)) this._emitters.set(channel, []);
      this._emitters.get(channel).push(listener);
    }
  }, {
    key: 'removeListeners',
    value: function removeListeners(channel) {
      this._emitters.delete(channel);
    }
  }]);

  return EventEmitter;
}();

// for holding previous states to return to when new state doesn't work out.

var Memento = function () {
  function Memento(maxStates) {
    _classCallCheck(this, Memento);

    this.states = [];
    this.maxStates = maxStates || 10;
  }

  _createClass(Memento, [{
    key: 'getState',
    value: function getState(steps) {
      steps = steps || 1;
      var state = null;
      while (steps && this.states.length) {
        steps--;
        state = this.states.pop();
      }
      return state;
    }
  }, {
    key: 'save',
    value: function save(state) {
      if (!state) throw new Error('Param Missing');
      this.states.push(state);
      if (this.states.length > this.maxStates) this.states.shift();
    }
  }]);

  return Memento;
}();

module.exports = {
  getRandom: getRandom,
  EventEmitter: EventEmitter,
  Memento: Memento
};

},{}]},{},[6])(6)
});
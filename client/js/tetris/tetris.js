'use strict';

let Config = require('./config'),
    Utils = require('./utils'),
    MobilePieceFactory = require('./mobilePieceFactory'),
    Board = require('./board');

// The controller object that holds all the game logic and models within, extends EventEmitter to notify the view when change occurs
class Tetris extends Utils.EventEmitter{
  constructor(){
    super();
    this.status = 'yetToStart'; // flag indicating the game status( yetToStart, started, stopped)
  }
  // method for starting new tetris game, we prodide the table dimensions as parameters to the method
  startNewGame(height, width){
    if(!height || !width) throw new Error('Params Missing');
    this.status = 'started';
    this.height = height;
    this.width = width;
    this.mobile = null;     // the piece moving on the table
    this.board =  new Board(height, width);  // object holding coordinated of the uncleared blocks.
    this.getNextPiece();
    this.moveInterval = setInterval(this.movePieceDown.bind(this), Config.moveIntervalTime);
  }
  // move the mobile piece one row down (if possible)
  movePieceDown(){
    if(this.status == 'stopped'){
      if(this.moveInterval) clearInterval(this.moveInterval);
      if(!this._finishCalled) this.finish();
      return; 
    }
    this.mobile.down();
    if(this.board.spaceConflict(this.mobile)){
      this.mobile.undo();
      this.getNextPiece();
    }else if(this.mobile.y+1-this.mobile.height== 0){ // the mobile piece has reached the bottom of the floor.
      this.getNextPiece();
    }else{
      this.emit('update UI');
    }
  }
  // move the mobile piece one column left (if possible)
  movePieceLeft(){
    this.mobile.left();
    this.undoIfConflict();
  }
  // move the mobile piece one column right (if possible)
  movePieceRight(){
    this.mobile.right();
    this.undoIfConflict();
  }
  // rotate the mobile piece 90 degree clockwise (if possible)
  rotatePiece(){
    this.mobile.turn();
    this.undoIfConflict();
  }
  // restore previous state of mobile piece if current state overlaps with table wall or fixed blocks
  undoIfConflict(){
    if(this.board.spaceConflict(this.mobile))
      this.mobile.undo();
  }
  // method for retriving next random mobile block also for checking if the game has finished.
  getNextPiece(){
    if(this.status == 'stopped'){
      if(!this._finishCalled) this.finish();
      return;
    }
    try{
      if(this.mobile){
        if(this.mobile.y>=this.height)  return this.finish();
        this.board.addPiece(this.mobile);
        this.mobile = null;
        if(this.board.peak >= this.height)  return this.finish();
      }
    }catch(e){
      return this.finish();
    }
    if(!this.nextPiece)  this.nextPiece = MobilePieceFactory.getPiece(this.height, this.width);
    this.mobile = this.nextPiece;
    this.nextPiece = MobilePieceFactory.getPiece(this.height, this.width);
    if(this.board.spaceConflict(this.mobile))
      return this.finish();
    this.emit('update UI');
  }
  // method to signal view tha the game has finished.
  finish(){
    this.status = 'stopped';
    this._finishCalled = true;    
    this.emit('game over', this.board.score);
  }
  // method to retrieve table details(  fixed blocks as 1 and mobile blocks as 2) to be displayed to the user.
  getViewCoords(){
    if(!this.mobile)  return;
    let viewCoords,
      x = this.mobile.x,
      y = this.mobile.y,  
      coords = this.mobile.coords,
      height = this.mobile.height,
      width = this.mobile.width;
    viewCoords = this.board.coords.map(ele => ele.slice(0)); // cloning array of arrays
    for(let i=0;i<height;i++)
      for(let j=0;j<width;j++)
        if(viewCoords[y-i] && (viewCoords[y-i][x+j]==0 || viewCoords[y-i][x+j]))
          viewCoords[y-i][x+j] = viewCoords[y-i][x+j] + coords[i][j]*2;
    return viewCoords.reverse();
  }
}

module.exports = Tetris;
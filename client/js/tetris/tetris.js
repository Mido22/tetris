
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
  movePieceDown(){
    if(this.status == 'stopped'){
      if(this.moveInterval) clearInterval(this.moveInterval);
      if(!this._finishCalled) finish();
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
  movePieceLeft(){
    this.mobile.left();
    this.undoIfConflict();
  }
  movePieceRight(){
    this.mobile.right();
    this.undoIfConflict();
  }
  rotatePiece(){
    this.mobile.turn();
    this.undoIfConflict();
  }
  undoIfConflict(){
    if(this.board.spaceConflict(this.mobile))
      this.mobile.undo();
  }
  getNextPiece(){
    if(this.status == 'stopped'){
      if(!this._finishCalled) finish();
      return;
    }
    try{
      if(this.mobile){
        if(this.mobile.y>=this.height)  return finish();
        this.board.addPiece(this.mobile);
        this.mobile = null;
        if(this.board.peak >= this.height)  return finish();
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
  finish(){
    this.status = 'stopped';
    this._finishCalled = true;
    this.emit('game over', this.board.score);
  }
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
        if(viewCoords[y-i])
        viewCoords[y-i][x+j] = coords[i][j]*2;
    return viewCoords.reverse();
  }
}

module.exports = Tetris;
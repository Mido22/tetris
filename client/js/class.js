// Config object that holds the various configuration details...
var Config = {
  moveIntervalTime: 10, // move piece down every 300ms
  coordOptions: [
      // square block
        [
          [1,1],
          [1,1]
        ],
      // line block
        [
          [1],
          [1],
          [1],
          [1]
        ],
      // L block
        [
          [1, 0],
          [1, 0],
          [1, 0],
          [1, 1]
        ],
      // Z block
        [
          [0, 1, 1],
          [1, 1, 0]
        ],
      //T block
        [
          [1, 0],
          [1, 1],
          [1, 0]
        ]
      ]
};

// the mini helper functions encapsulated in Utils object
var Utils = (function(){

  // method that return random number, with ceil+1 passed as 'max' parameter
  function getRandom(max) {
    if(!max)  throw new Error('Param Missing');
    let num = Math.round(max*Math.random()-.5);
    if(num==max)  num--;
    return num;
  }


  // kind of observer pattern for notifying observers when a certain event occurs...
  class EventEmitter{
    constructor(){
      this._emitters = new Map();
    }
    emit(channel, data){
      if(!this._emitters.has(channel)) return console.log('Nobody Lisetening, silently ignoring...', channel, data);
      this._emitters.get(channel).forEach(fn => fn(data));
    }
    addListener(channel, listener){
      if(!this._emitters.has(channel))  this._emitters.set(channel, []);
      this._emitters.get(channel).push(listener);
    }
    removeListeners(channel){
      this._emitters.delete(channel);
    }
  }

  // for holding previous states to return to when new state doesn't work out.
  class Memento{
    constructor(maxStates=10){
      this.states = [];
      this.maxStates = maxStates;
    }
    getState(steps=1){
      let state;
      while(steps && this.states.length){
        steps--;
        state = this.states.pop();
      }
      return state;
    }
    save(state){
      this.states.push(state);
      if(this.states.length>this.maxStates)
        this.states.shift();
    }
  }

  return {
    getRandom,
    EventEmitter,
    Memento
  };
})();

// The controller object that holds all the game logic and models within, extends EventEmitter to notify the view when change occurs
class Board extends Utils.EventEmitter{
  constructor(height=15, width=10){
    super();
    this.height = height;
    this.width = width;
    this.gameOver = false;  // boolean flag indicating the game status
    this.mobile = null;     // the piece moving on the table
    this.fixed =  new FixedPiece(height, width);  // object holding coordinated of the uncleared blocks.
    this.getNextPiece();
    this.moveInterval = setInterval(this.movePieceDown.bind(this), Config.moveIntervalTime);
  }
  movePieceDown(){
    if(this.gameOver){
      if(this.moveInterval) clearInterval(this.moveInterval);
      if(!this._finishCalled) finish();
      return; 
    }
    this.mobile.down();
    if(this.fixed.spaceConflict(this.mobile)){
      this.mobile.undo();
      this.getNextPiece();
    }else if(this.mobile.y+1-this.mobile.height== 0){ // the mobile piece has reached the bottom of the floor.
      this.getNextPiece();
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
    if(this.fixed.spaceConflict(this.mobile))
      this.mobile.undo();
  }
  getNextPiece(){
    if(this.gameOver){
      if(!this._finishCalled) finish();
      return;
    }
    try{
      if(this.mobile){
        if(this.mobile.y>=this.height)  return finish();
        this.fixed.addPiece(this.mobile);
        this.mobile = null;
        if(this.fixed.peak >= this.height)  return finish();
      }
    }catch(e){
      return this.finish();
    }
    if(!this.nextPiece)  this.nextPiece = MobilePieceFactory.getPiece(this.height, this.width);
    this.mobile = this.nextPiece;
    this.nextPiece = MobilePieceFactory.getPiece(this.height, this.width);
    if(this.fixed.spaceConflict(this.mobile))
      return this.finish();
    this.emit('update UI');
  }
  finish(){
    this.gameOver = true;
    this._finishCalled = true;
    this.emit('game over', this.fixed.score);
  }
  getViewCoords(){
    let viewCoords,
      x = this.mobile.x,
      y = this.mobile.y,  
      coords = this.mobile.coords,
      height = this.mobile.height,
      width = this.mobile.width;
    viewCoords = this.fixed.coords.map(ele => ele.slice(0)); // cloning array of arrays
    for(let i=0;i<height;i++)
      for(let j=0;j<width;j++)
        if(viewCoords[y-i])
        viewCoords[y-i][x+j] = coords[i][j]*2;
    return viewCoords.reverse();
  }
}

// Super class containing common features of a block
class Piece extends Utils.Memento{
  constructor(coords){
    if(!coords) throw new Error('Co-ords Array Missing!!!');
    super();
    this.coords = coords;
  }
  get width(){
    return this.coords[0].length;
  }
  get height(){
    return this.coords.length;
  }
}

// the moving block which can turn, has co-ordinates
class MobilePiece extends Piece{
  constructor({coords, tableHeight, tableWidth}){
    if(!tableHeight || !tableWidth) throw new Error('Params missing');
    super(coords);
    this.tableWidth = tableWidth;
    this.tableHeight = tableHeight;
    this.x=Math.floor((tableWidth - this.width)/2);
    this.y=tableHeight+this.height-1;
  }
  turn(){
    this.save();
    let x = this.coords.length, y=this.coords[0].length, newCoords=[];
    for(let i=0;i<y;i++){
      newCoords[i] = [];
      for(let j=0;j<x;j++)
        newCoords[i].push(this.coords[j][i]);
      newCoords[i].reverse();
    }
    this.coords = newCoords;
  }
  undo(){
    let state = this.getState();
    for(let key in state) this[key] = state[key];
  }
  save(){
    super.save({
      coords: this.coords,
      x:this.x,
      y:this.y
    });
  }
  left(){
    this.save();
    this.x--;
    this.isConflict();
  }
  right(){
    this.save();
    this.x++;
    this.isConflict();
  }
  down(){
    this.save();
    this.y--;
    this.isConflict();
  }
  isConflict(){
    let conflict = false; 
    if( this.x < 0 || (this.x + this.width )>= this.tableWidth )  conflict=true;
    if( (this.y - this.height + 1) < 0 )  conflict=true;
    if(conflict)  this.undo();
  }
}

// the model holding all the co-ordinates of fixed/immovable pieces, also methods for checking if there are any overlapping pieces. 
class FixedPiece extends Piece{
  constructor(height, width){
    let coords = [];
    for(let i=0;i<height;i++){
      coords[i]=[];
      for(let j=0;j<width;j++)
        coords[i].push(0);
    }
    super(coords);
    this.score = 0;
  }
  get peak(){
    let highestPoint = -1, i=0;
    while(this.coords[i].reduce((prev, val) => prev+val, 0)){
      i++;
      highestPoint++;
    }
    return highestPoint;
  }
  addPiece(piece){
    if(this.spaceConflict(piece)) throw new Error('There seems to be a conflict!!!');
    let x = piece.x, y = piece.y, coords = piece.coords;
    for(let i=0;i<piece.height;i++)
      for(let j=0;j<piece.width;j++)
        if(this.coords[y-i])
          this.coords[y-i][x+j] = coords[i][j] + this.coords[y-i][x+j];
    this.clearFilled();
  }
  clearFilled(){
    let clearAgain = false;
    for(let i=0;i<this.height && !clearAgain;i++){
      let sum = this.coords[i].reduce((prev, val) => prev+val, 0);
      if(sum == this.width){
        clearAgain = true;
        let zeroArray = this.coords.splice(i, 1);
        zeroArray = zeroArray.map(i => 0);
        this.coords.push(zeroArray);
        this.score+=sum;
      }
    }
    if(clearAgain)  this.clearFilled();
  }
  spaceConflict(piece){
    let conflict = false, x = piece.x, y = piece.y, coords = piece.coords;
    for(let i=0;i<piece.height;i++)
      for(let j=0;j<piece.width;j++)
        if(coords[i][j] && this.coords[y-i] && this.coords[y-i][x+j])
          return true;    
    return conflict;
  }
} 

// Factory for creating random mobile block.
class MobilePieceFactory{
  static getPiece(tableHeight, tableWidth){
    if(!tableHeight || !tableWidth) throw new Error('Params Missing!!!');
    
    let coordOptions = Config.coordOptions,   // various block options to choose the random block from.
      coords = coordOptions[Utils.getRandom(coordOptions.length)],
      piece = new MobilePiece({
        coords,
        tableWidth,
        tableHeight
      }),
      turnCount = Utils.getRandom(4);
    while(turnCount){
      turnCount--;
      piece.turn();
    }
    return piece;
  }
}

window.b = new Board();
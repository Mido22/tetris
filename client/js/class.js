// Config object that holds the various configuration details...
var Config = {
  moveIntervalTime: 300, // move piece down every 300ms
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

// The controller object that holds all the game logic and models within, extends EventEmitter to notify the view when change occurs
class Board extends EventEmitter{
  constructor(height=15, width=10){
    super();
    this.height = height;
    this.width = width;
    let table = [];
    for(let i=0;i<length;i++){
      table[i]=[];
      for(let j=0;j<width;j++)
        table[i].push(0);
    }
    this.gameOver = false;  // boolean flag indicating the game status
    this.mobile = null;     // the piece moving on the table
    this.fixed =  new FixedPiece(table);  // object holding coordinated of the uncleared blocks.
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
    }else if(this.mobile.y-this.mobile.height == 0){ // the mobile piece has reached the bottom of the floor.
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
        this.fixed.addPiece(this.mobile);
        this.mobile = null;
        if(this.fixed.peak >= this.height)  return finish();
      }
    }catch(e){
      console.error('caught error: ', e);
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
    let coords = this.fixed.coords(),
      x = piece.x,
      y = piece.y,
      mobileCoords = this.mobile.coords,
      height = this.mobile.height,
      width = this.mobile.width;
    for(let i=0;i<height;i++)
      for(let j=0;j<width;j++)
        coords[x-i][y+j] = coords[i][j] + mobileCoords[x-i][y+j]*2;
    return coords;
  }
}

// Super class containing common features of a block
class Piece extends Memento{
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
    if( (this.y - this.height) < 0 )  conflict=true;
    if(conflict)  this.undo();
  }
}

function Utils(){


  // various block options to choose the random block from.
  let coordOptions = Config.coordOptions;

  // method that return random number, with ceil+1 passed as 'max' parameter
  function getRandom(max) {
    if(!max)  throw new Error('Param Missing');
    let num = Math.floor(max*Math.random());
    if(num==max)  num--;
    return num;
  }

  // Factory for creating random mobile block.
  function MobilePieceFactory(tableWidth, tableHeight){
    if(!tableHeight || !tableWidth) throw new Error('Params Missing!!!');
    let coords = coordOptions[getRandom(coordOptions.length)],
      piece = new MobilePiece({
        coords,
        tableWidth,
        tableHeight
      }),
      turnCount = getRandom(4);
    while(turnCount){
      turnCount--;
      piece.turn();
    }
    return piece;
  }


  return {
    getRandom,
    coordOptions,
    MobilePieceFactory
  };
}

class FixedPiece extends Piece{
  constructor(coords){
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
        this.coords[x-i][y+j] = coords[i][j] + this.coords[x-i][y+j];
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
        if(coords[i][j] && this.coords[x-i][y+j])
          return true;    
    return conflict;
  }
}
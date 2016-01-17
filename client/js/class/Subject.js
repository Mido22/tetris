// observer pattern for notifying observers when subject value changes...
class Subject{
  constructor(){
    this.observers = new Map();
    this.observersArray = [];
  }
  notify(context){
    this.observersArray.forEach(fn => fn(context));
    Array.from(this.observers.values()).forEach(fn => fn(context));
  }
  addObserver(fn, key){
    if(!key)
      this.observersArray.push(fn);
    else if( this.observers.has(key))
      throw new Error('Key already used');
    else
      this.observers.set(key, fn);
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

class Board extends Subject{
  constructor(length=15, width=10){
    super();
    let table = [];
    for(let i=0;i<length;i++){
      table[i]=[];
      for(let j=0;j<width;j++)
        table[i].push(0);
    }

  }

}

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

class MobilePieceFactory{
  static getPiece(tableWidth, tableHeight){
    let coords = Utils.coordOptions[Utils.getRandom(Utils.coordOptions.length)],
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

function Utils(){

  function getRandom(max) {
    let num = Math.floor(max*Math.random());
    if(num==max)  num--;
    return num;
  }

  let coordOptions = [
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
      ];


  return {
    getRandom,
    coordOptions
  };
} 

class FixedPiece extends Piece{
  constructor(coords){
    super(coords);
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
        // TODO: could also add pushing blocks down...
      }
    }
    if(clearAgain)  this.clearFilled();
  }
  spaceConflict(piece){
    let conflict = false, x = piece.x, y = piece.y, coords = piece.coords;
    for(let i=0;i<piece.height;i++)
      for(let j=0;j<piece.width;j++)
        if(coords[i][j] && this.coords[x-i][y+j])
          conflict = true;    
    return conflict;
  }
}
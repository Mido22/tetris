'use strict';

let Piece = require('./piece');

// the model holding all the co-ordinates of fixed/immovable pieces, also methods for checking if there are any overlapping pieces. 
class Board extends Piece{
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

module.exports = Board;
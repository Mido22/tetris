'use strict';

let Piece = require('./piece');

// the moving block which can turn, has co-ordinates
class MobilePiece extends Piece{
  // cfg -{
  //   tableHeight - height of the board
  //   tableWidth - width of the board
  //   coords - Array of Array having structure of the said block
  // }
  constructor(cfg){
    if(!cfg.tableHeight || !cfg.tableWidth) throw new Error('Params missing');
    super(cfg.coords);
    this.tableWidth = cfg.tableWidth;
    this.tableHeight = cfg.tableHeight;
    this.x=Math.floor((cfg.tableWidth - this.width)/2);
    this.y=cfg.tableHeight+this.height-1;
  }
  // for rotating the piece 90 degree clockwise direction.
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
  // for retreating the previous saved state of model
  undo(){
    let state = this.getState();
    for(let key in state) this[key] = state[key];
  }
  // for saving the current state of the model
  save(){
    let coords = this.coords.slice(0).map(row => row.slice(0)); // shadow cloning array of arrays.
    super.save({
      coords,
      x:this.x,
      y:this.y
    });
  }
  // moving the piece one column left( as long as no blocks collide with board edge)
  left(){
    this.save();
    this.x--;
    this.isConflict();
  }
  // moving the piece one column right( as long as no blocks collide with board edge)
  right(){
    this.save();
    this.x++;
    this.isConflict();
  }
  // moving the piece one row below( as long as no blocks collide with board edge)
  down(){
    this.save();
    this.y--;
    this.isConflict();
  }
  // returns boolean - for checking if the model collides with board edge
  isConflict(){
    let conflict = false; 
    if( this.x < 0 || (this.x + this.width )> this.tableWidth )  conflict=true;
    if( (this.y - this.height + 1) < 0 )  conflict=true;
    if(conflict)  this.undo();
  }
}

module.exports = MobilePiece;

'use strict';

let Piece = require('./piece');

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

module.exports = MobilePiece;

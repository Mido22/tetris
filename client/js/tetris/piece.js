'use strict';

let Utils = require('./utils');

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

module.exports = Piece;

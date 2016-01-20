'use strict';

let Config = require('./config'),
    Utils = require('./utils'),
    MobilePiece = require('./mobilePiece'),
    // various block options to choose the random block from.
    coordOptions = Config.coordOptions;

// method for creating random mobile block.
function getPiece(tableHeight, tableWidth){
  if(!tableHeight || !tableWidth) throw new Error('Params Missing!!!');
  
  let coords = coordOptions[Utils.getRandom(coordOptions.length)],
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

// Factory for creating random mobile block.
module.exports = {
  getPiece
};

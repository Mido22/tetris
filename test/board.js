'use strict';

let Board = require('./../client/js/tetris/board');
let MobilePiece = require('./../client/js/tetris/mobilePiece');

describe('Tetris - board.js',  () => {

  it('Has all methods', () => {
    let obj = new Board(10, 10);
    obj.should.have.property('peak');
    obj.should.have.property('addPiece');
    obj.should.have.property('clearFilled');
    obj.should.have.property('spaceConflict');
  });

  it('Has inherited methods from Piece', () => {
    let obj = new Board(10, 10);
    obj.should.have.property('width');
    obj.should.have.property('height');
    obj.should.have.property('coords');
  });

  it('throws error if params are missing in constructor', () => {
    let coords = '111,111'.split(',').map(s=> s.split('').map(n=>+n));
    (() => new Board()).should.throw();
    (() => new Board(10) ).should.throw();
    (() => new Board(10, 10) ).should.not.throw();
  });

  it('check attribute - peak', () => {
    let obj = new Board(10, 10);
    let coords = '111,111'.split(',').map(s=> s.split('').map(n=>+n));
    obj.peak.should.be.exactly(-1);
    obj.coords = coords;
    obj.peak.should.be.exactly(1);
  });

  it('check method - clearFilled()', () => {
    let obj = new Board(10, 10);
    let coords = '111,111'.split(',').map(s=> s.split('').map(n=>+n));
    obj.peak.should.be.exactly(-1);
    obj.coords = coords;
    obj.peak.should.be.exactly(1);
    obj.clearFilled();
    obj.peak.should.be.exactly(-1);
    obj.height.should.be.exactly(2);
    obj.width.should.be.exactly(3);
  });

  it('check method - spaceConflict()', () => {
    let obj = new Board(2, 3);
    let coords = '111,111'.split(',').map(s=> s.split('').map(n=>+n));
    let piece = getPiece();
    obj.spaceConflict(piece).should.not.be.ok();
    obj.coords = coords;
    obj.spaceConflict(piece).should.be.ok();
    obj.clearFilled();
    obj.spaceConflict(piece).should.not.be.ok();
  });

  it('check method - addPiece()', () => {
    let obj = new Board(2, 3);
    let coords = toArray('111,111');
    let coords2 = toArray('000,000');
    let piece = getPiece();
    obj.peak.should.be.exactly(-1);
    obj.addPiece(piece);
    obj.peak.should.be.exactly(1);
    (() => obj.addPiece(piece) ).should.throw();
    obj.coords = coords2;
    obj.peak.should.be.exactly(-1);
    obj.addPiece(piece);
    obj.peak.should.be.exactly(1);
  });

});

function getPiece(){
  let obj = new MobilePiece({
    tableHeight: 2,
    tableWidth: 3,
    coords: [[1,1], [1,1]]
  });
  obj.x = 1; 
  obj.y = 1;
  return obj;
}

function toArray(s){
  return s.split(',').map(s=> s.split('').map(n=>+n));
}
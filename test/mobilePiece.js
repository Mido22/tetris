'use strict';

let MobilePiece = require('./../client/js/tetris/mobilePiece'),
  MobilePieceFactory = require('./../client/js/tetris/mobilePieceFactory');

describe('Tetris - mobilePiece.js',  () => {


  it('Has all methods', () => {
    let obj = getRandomPiece();
    obj.should.have.property('turn');
    obj.should.have.property('undo');
    obj.should.have.property('save');
    obj.should.have.property('width');
    obj.should.have.property('left');
    obj.should.have.property('right');
    obj.should.have.property('down');
    obj.should.have.property('isConflict');
  });

  it('Has inherited methods from Piece', () => {
    let obj = getRandomPiece();
    obj.should.have.property('width');
    obj.should.have.property('height');
    obj.should.have.property('coords');
  });

  it('throws error if params are missing in constructor', () => {
    let coords = '111,111'.split(',').map(s=> s.split('').map(n=>+n));
    (() => new MobilePiece()).should.throw();
    (() => new MobilePiece({coords})).should.throw();
    (() => new MobilePiece({coords, tableHeight:10 })).should.throw();
    (() => new MobilePiece({coords, tableHeight:10, tableWidth: 10 })).should.not.throw();
  });

  it('check method - turn()', () => {
    let obj = new getRandomPiece(), 
      height = obj.height,
      width = obj.width;
    obj.width.should.be.exactly(width);
    obj.height.should.be.exactly(height);
    obj.turn();
    obj.width.should.be.exactly(height);
    obj.height.should.be.exactly(width);
    obj.turn();
    obj.width.should.be.exactly(width);
    obj.height.should.be.exactly(height);
    obj.turn();
    obj.width.should.be.exactly(height);
    obj.height.should.be.exactly(width);
    obj.turn();
    obj.width.should.be.exactly(width);
    obj.height.should.be.exactly(height);
  });

  it('check method - save/ undo()', () => {
    let obj = new getRandomPiece(), 
      height = obj.height,
      width = obj.width, 
      coords = obj.coords;
    obj.coords.should.equal(coords);
    obj.save();
    obj.coords.should.equal(coords);
    obj.coords[0][0] = 199;
    obj.undo();
    obj.coords.should.not.equal(coords);    
  });

  it('check method - left()', () => {
    let obj = new getRandomPiece(),
      x = obj.x;
    obj.x.should.be.exactly(x);
    obj.left();
    obj.x.should.be.exactly(x-1);
    obj.left();
    obj.x.should.be.exactly(x-2);
  });

  it('check method - right()', () => {
    let obj = new getRandomPiece(),
      x = obj.x;
    obj.x.should.be.exactly(x);
    obj.right();
    obj.x.should.be.exactly(x+1);
    obj.right();
    obj.x.should.be.exactly(x+2);
  });

  it('check method - down()', () => {
    let obj = new getRandomPiece(),
      y = obj.y;
    obj.y.should.be.exactly(y);
    obj.down();
    obj.y.should.be.exactly(y-1);
    obj.down();
    obj.y.should.be.exactly(y-2);
  });

});

function getRandomPiece(){
  return MobilePieceFactory.getPiece(10, 15);
}
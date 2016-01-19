'use strict';

let Piece = require('./../client/js/tetris/piece');

describe('Tetris - piece.js',  () => {


  it('Has all methods', () => {
    let obj = new Piece('111,111'.split(',').map(s=> s.split('').map(n=>+n)));
    obj.should.have.property('width');
    obj.should.have.property('height');
    obj.should.have.property('coords');
  });

  it('Has inherited methods from Memento', () => {
    let obj = new Piece('111,111'.split(',').map(s=> s.split('').map(n=>+n)));
    obj.should.have.property('getState');
    obj.should.have.property('save');
  });

  it('throws error if params are missing in constructor', () => {
    (() => new Piece()).should.throw();
  });

  it('correct dimensions are retrived', () => {
    let obj = new Piece('111,111'.split(',').map(s=> s.split('').map(n=>+n)));
    obj.width.should.be.exactly(3);
    obj.height.should.be.exactly(2);
  });

});
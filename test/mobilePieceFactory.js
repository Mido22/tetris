'use strict';

let MobilePiece = require('./../client/js/tetris/mobilePiece'),
  MobilePieceFactory = require('./../client/js/tetris/mobilePieceFactory');

describe('Tetris - mobilePieceFactory.js',  () => {


  it('Has all methods', () => {
    MobilePieceFactory.should.have.property('getPiece');
  });


  it('check method - getPiece()', () => {
    (() => getPiece()).should.throw();
    (() => getPiece(10)).should.throw();
    (() => getPiece(10, 10)).should.not.throw();
  });

  it('getPiece() returns random MobilePiece object', () => {
    for(let i=0;i<10;i++) getPiece(10, 10).should.be.an.instanceof(MobilePiece);
  });

});

function getPiece(h,w){
  return MobilePieceFactory.getPiece(h, w);
}
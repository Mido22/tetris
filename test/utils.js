'use strict';

let Utils = require('./../client/js/tetris/utils');

describe('Tetris - utils.js',  () => {
  it('Has all methods', () => {
    Utils.should.have.property('getRandom');
    Utils.should.have.property('EventEmitter');
    Utils.should.have.property('Memento');
  });

  describe('method - getRandom',  () => {

    it('return number when called', () => {
      let num;
      for(let i=0;i<20;i++){
        num = Utils.getRandom(10);
        num.should.be.within(0, 9).and.be.a.Number;
      }
    });

    it('throws error if max parameter is missing', () => {
      (() => Utils.getRandom()).should.throw();
    });

  });


  describe('class - Memento',  () => {

    it('objects should have save and getState method', () => {
      let obj = new Utils.Memento();
      obj.should.have.property('getState');
      obj.should.have.property('save');
    });

    it('state should be retrivable', () => {
      let obj = new Utils.Memento();
      obj.save(1);
      obj.save(2);
      obj.save(3);
      obj.getState().should.be.exactly(3);
      obj.getState().should.be.exactly(2);
      obj.getState().should.be.exactly(1);
      (obj.getState() === null).should.be.true;
      (obj.getState() === null).should.be.true;
      obj.save(3);
      obj.getState().should.be.exactly(3);
      (obj.getState() === null).should.be.true;
      (obj.getState() === null).should.be.true;
      (obj.getState() === null).should.be.true;
    });

  });

  describe('class - EventEmitter',  () => {

    it('objects should have right methods', () => {
      let obj = new Utils.EventEmitter();
      obj.should.have.property('emit');
      obj.should.have.property('addListener');
      obj.should.have.property('removeListeners');
    });

    it('right data should be emitted and caught', () => {
      let obj = new Utils.EventEmitter(), message = {data: 'dummy Message'};
      obj.addListener('dummy channel', data => {
        data.should.be.exactly(message);
      });
      obj.emit('dummy channel', message);
    });

    it('error is thrown even when there are no listeners', () => {
      let obj = new Utils.EventEmitter();
      (() => obj.emit('dummy channel', {data: 'dummy Message'})).should.throw();
    });

  });

});
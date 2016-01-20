'use strict';
// the mini helper functions encapsulated in Utils object

// method that return random number, with ceil+1 passed as 'max' parameter
function getRandom(max) {
  if(!max)  throw new Error('Param Missing');
  let num = Math.round(max*Math.random()-.5);
  if(num==max)  num--;
  return num;
}

// kind of observer pattern for notifying observers when a certain event occurs...
class EventEmitter{
  constructor(){
    this._emitters = new Map();
  }
  emit(channel, data){
    if(!this._emitters.has(channel)) throw new Error('But nobody is listening!!!');
    this._emitters.get(channel).forEach(fn => fn(data));
  }
  addListener(channel, listener){
    if(!this._emitters.has(channel))  this._emitters.set(channel, []);
    this._emitters.get(channel).push(listener);
  }
  removeListeners(channel){
    this._emitters.delete(channel);
  }
}

// for holding previous states to return to when new state doesn't work out.
class Memento{
  constructor(maxStates){
    this.states = [];
    this.maxStates = maxStates || 10;
  }
  getState(steps){
    steps = steps || 1;
    let state = null;
    while(steps && this.states.length){
      steps--;
      state = this.states.pop();
    }
    return state;
  }
  save(state){
    if(!state)  throw new Error('Param Missing');
    this.states.push(state);
    if(this.states.length>this.maxStates)
      this.states.shift();
  }
}

module.exports = {
  getRandom,
  EventEmitter,
  Memento
};

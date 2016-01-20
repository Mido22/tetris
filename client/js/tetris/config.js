'use strict';
// Config object that holds the various configuration details...


// move piece down every 300ms
module.exports.moveIntervalTime = 300;

// Tetris board size range...
module.exports.range= {
  height:{
    min: 10,
    max:21
  },
  width:{
    min: 10,
    max: 21
  }
}

// various block options to choose the random block from.
module.exports.coordOptions = [       
// square block
  [
    [1,1],
    [1,1]
  ],
// line block
  [
    [1],
    [1],
    [1],
    [1]
  ],
// L block
  [
    [1, 0],
    [1, 0],
    [1, 0],
    [1, 1]
  ],
// Z block
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
//T block
  [
    [1, 0],
    [1, 1],
    [1, 0]
  ]
];
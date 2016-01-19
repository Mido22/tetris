
theModule.controller('mainCtrl', ['$scope', '$timeout', '$document'
  , ($scope, $timeout, $document) => {
  window.s = $scope; // for Debug, remove THIS.

  
  function onKeyPress(event){
    if(!$scope.tetris || !$scope.tetris.status)  return;

    switch(event.key){
      case 'ArrowUp': onArrowUp(); break;
      case 'ArrowDown': onArrowDown(); break;
      case 'ArrowLeft': onArrowLeft(); break;
      case 'ArrowRight': onArrowRight(); break;
      case 'Enter': startNewGame(); break;
    }
    updateUI();
  }

  function onArrowUp(){
    if($scope.tetris.status == 'started')
      $scope.tetris.rotatePiece();
    else
      $scope.boardHeight++;
    if($scope.boardHeight>31) $scope.boardHeight = 31;
  }

  function onArrowDown(){
    if($scope.tetris.status == 'started')
      $scope.tetris.movePieceDown();
    else
      $scope.boardHeight--;
    if($scope.boardHeight<9) $scope.boardHeight = 9;
  }

  function onArrowRight(){
    if($scope.tetris.status == 'started')
      $scope.tetris.movePieceRight();
    else
      $scope.boardWidth++;
    if($scope.boardWidth>15) $scope.boardWidth = 15;
  }

  function onArrowLeft(){
    if($scope.tetris.status == 'started')
      $scope.tetris.movePieceLeft();
    else
      $scope.boardWidth--;
    if($scope.boardWidth<6) $scope.boardWidth = 6;
  }

  function startNewGame(){
    if(!$scope.tetris || $scope.tetris.status=='started') return;
    $scope.tetris.startNewGame($scope.boardHeight, $scope.boardWidth);
  }

  function init(){
    let tetris = new Tetris();
    tetris.addListener('update UI', updateUI);
    tetris.addListener('game over', updateUI);
    $scope.tetris = tetris;   
    $scope.boardHeight = 15;
    $scope.boardWidth = 10;
    $document.on('keypress', onKeyPress) ;
  }  

  function updateUI(){ 
    var phase = $scope.$root.$$phase;
    if(phase !== '$apply' && phase !== '$digest') {
      $scope.coords = $scope.tetris.getViewCoords();
      try{$scope.$apply();}catch(e){}
    }else{
      delayUIUpdate();
    }  
  }
  
  function delayUIUpdate(){
    if($scope.uiUpdateWaiting)  return;    
    $scope.uiUpdateWaiting = true;
    setTimeout(() => {
      updateUI();
      $scope.uiUpdateWaiting = false;
    }, 100);
  } 

  init();

}]);

theModule.controller('mainCtrl', ['$scope', '$timeout', '$document'
  , ($scope, $timeout, $document) => {
  window.s = $scope; // for Debug, remove THIS.

  
  function onKeyPress(event){
    if(!$scope.tetris || !$scope.tetris.status)  return;

    switch(event.which){
      case 38: onArrowUp(); break;
      case 40: onArrowDown(); break;
      case 37: onArrowLeft(); break;
      case 39: onArrowRight(); break;
      case 13: startNewGame(); break;
      case 72: $scope.showHints = !$scope.showHints; break;
    }
    updateUI();
  }

  function onArrowUp(){
    if($scope.tetris.status == 'started')
      $scope.tetris.rotatePiece();
    else
      $scope.boardHeight++;
    if($scope.boardHeight>21) $scope.boardHeight = 21;
  }

  function onArrowDown(){
    if($scope.tetris.status == 'started')
      $scope.tetris.movePieceDown();
    else
      $scope.boardHeight--;
    if($scope.boardHeight<11) $scope.boardHeight = 11;
  }

  function onArrowRight(){
    if($scope.tetris.status == 'started')
      $scope.tetris.movePieceRight();
    else
      $scope.boardWidth++;
    if($scope.boardWidth>21) $scope.boardWidth = 21;
  }

  function onArrowLeft(){
    if($scope.tetris.status == 'started')
      $scope.tetris.movePieceLeft();
    else
      $scope.boardWidth--;
    if($scope.boardWidth<11) $scope.boardWidth = 11;
  }

  function startNewGame(){
    if(!$scope.tetris || $scope.tetris.status=='started') return;
    $scope.tetris.startNewGame($scope.boardHeight, $scope.boardWidth);
  }

  function init(){
    let tetris = new Tetris();
    tetris.addListener('update UI', updateUI);
    tetris.addListener('game over', ()=>{
      setTimeout(updateUI, 100); // keeping a delay not to clash with the other update UI;
    });
    $scope.tetris = tetris;   
    $scope.boardHeight = 15;
    $scope.boardWidth = 10;
    $document.on('keydown', onKeyPress);
    $scope.showHints = true;
  }  

  function updateUI(){ 
    var phase = $scope.$root.$$phase;
    if(phase !== '$apply' && phase !== '$digest') {
      $scope.coords = $scope.tetris.getViewCoords();
      try{
        $scope.uiUpdateWaiting = false;
        $scope.$apply();
      }catch(e){console.log('error caught: ', e);}
    }else{
      delayUIUpdate();
    }  
  }
  
  function delayUIUpdate(){
    if($scope.uiUpdateWaiting)  return;    
    $scope.uiUpdateWaiting = true;
    setTimeout(() => {
      $scope.uiUpdateWaiting = false;
      updateUI();
    }, 100);
  } 

  init();

}]);
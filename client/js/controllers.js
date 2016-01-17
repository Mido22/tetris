
theModule.controller('mainCtrl', ['$scope', '$timeout'
  , ($scope, $timeout) => {

  function updateUI(){ 
    var phase = $scope.$root.$$phase;
    if(phase !== '$apply' && phase !== '$digest') {
        $scope.$apply();  
    }      
  }
  
}]);
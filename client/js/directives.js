
theModule.directive('angTestDir', ['partialsDir'
  , (partialsDir) => {



  function link($scope, element, attrs) {  
    console.log('hit directive...');
  }  

  return { 
    scope: false,
    link,
    templateUrl: `${partialsDir}angTestDir.html`
  };  
}]);

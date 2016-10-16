appControllers.controller('HeaderCtrl', ['$scope', '$state',
  function($scope, $state) {
    // This is hacky but don't worry about it
    $scope.$state = $state;
}]);

appControllers.controller('LanguageCtrl', ['$scope', '$state', 'LanguageService',
  function($scope, $state, LanguageService) {
    $scope.languages = LanguageService.getSupportedLanguages();
    $scope.currentLanguage = LanguageService.getLanguageName(LanguageService.getLanguage());
    
    $scope.changeLanguage = function(language) {
      LanguageService.setLanguage(language);
      $scope.currentLanguage = LanguageService.getLanguageName(LanguageService.getLanguage());
      $state.reload();
    }
}]);

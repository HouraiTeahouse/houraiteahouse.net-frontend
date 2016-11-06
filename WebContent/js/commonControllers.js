import appControllers from './commonControllersModule.js';

appControllers.controller('HeaderCtrl', ['$scope', '$state', 'AuthService',
  function($scope, $state, AuthService) {
    // This is hacky but don't worry about it
    $scope.$state = $state;
    $scope.canManagePermissions = AuthService.allowAccess('admin');
}]);

appControllers.controller('LanguageCtrl', ['$scope', '$state', 'LanguageService',
  function($scope, $state, LanguageService) {
    $scope.languages = LanguageService.getSupportedLanguages();
    $scope.currentLanguage = LanguageService.getLanguageName(LanguageService.getLanguage());
    
    $scope.changeLanguage = function(language) {
      LanguageService.setLanguage(language.code);
      $scope.currentLanguage = language.name;
      $state.reload();
    }
}]);

import appControllers from '../appControllersModule.js';

appControllers.controller('HeaderCtrl', ['$rootScope', '$scope', '$state', 'AuthService',
  function($rootScope, $scope, $state, AuthService) {
    $scope.listeners = [];
    $scope.navCollapsed = true;

    // This is hacky but don't worry about it
    $scope.$state = $state;

    $scope.canManagePermissions = AuthService.allowAccess('admin');

    $scope.toggleNav = function () {
      $scope.navCollapsed = !$scope.navCollapsed;
    };

    $scope.listeners.push(
      $rootScope.$on('$stateChangeStart', function () {
        $scope.navCollapsed = true;
      })
    );

    $scope.$on('$destroy', function () {
      $scope.listeners.forEach(cancelFn => cancelFn());
    });
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

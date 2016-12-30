import appControllers from '../appControllersModule.js';

appControllers.controller('LoginNavCtrl', ['$scope', 'AuthService',
  function($scope, AuthService) {
    $scope.isLoggedIn = false;
    $scope.$watch(function() { return AuthService.isLoggedIn() }, function (status) {
      $scope.isLoggedIn = status;
    });
}]);


appControllers.controller('LoginCtrl', ['$scope', '$state', 'AuthService',
  function($scope, $state, AuthService) {
    $scope.login = function() {
      $scope.error = false;
      $scope.disabled = true;

      AuthService.login($scope.loginForm.username, $scope.loginForm.password, $scope.loginForm.remember_me)
        .then(function() {
          $state.go('home');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        .catch(function(err) {
          $scope.error = true;
          $scope.errorMessage = err.message;
          $scope.disabled = false;
          $scope.loginForm = {};
        });
    };
}]);

appControllers.controller('RegisterCtrl', ['$scope', '$state', 'AuthService',
  function($scope, $state, AuthService) {
    $scope.register = function() {
      $scope.error = false;
      $scope.disabled = true;

      AuthService.register($scope.registerForm.username,
                           $scope.registerForm.email,
                           $scope.registerForm.password)
        .then(function() {
          $state.go('login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        .catch(function() {
          $scope.error = true;
          $scope.errorMessage = "Registration has failed, please wait and then try again. If this problem persists, please let us know.";
          $scope.disabled = false;
          $scope.registerForm = {};
        });
    };
}]);

appControllers.controller('PermissionCtrl', ['$scope', '$state', 'AuthService',
  function($scope, $state, AuthService) {
    $scope.error = false;
    $scope.disabled = false;
    $scope.username = null;
    $scope.permissions = null;
    $scope.loaded = false;

    $scope.getPermissions = function() {
      $scope.error = false;
      $scope.disabled = true;

      AuthService.getPermissions($scope.usernameEntry)
        .then(function(data) {
          $scope.username = data.username;
          $scope.permissions = data.permissions;
          $scope.loaded = true;
          $scope.disabled = false;
        })
        .catch(function(message) {
          $scope.error = true;
          $scope.errorMessage = message;
          $scope.disabled = false;
          // Do not clear any loaded permissions
        })
    }

    $scope.setPermissions = function() {
      $scope.error = false;
      $scope.disabled = true;

      AuthService.setPermissions($scope.username, $scope.permissions)
        .then(function(data) {
          $scope.disabled = false;
          // TODO: success message?
        })
        .catch(function(error) {
          $scope.error = true;
          $scope.errorMessage = error.message;
          $scope.disabled = false;
          // Do not clear any loaded permissions
        })
    }
}]);

appServices.factory('AuthService', ['$q', '$timeout', 'HttpService',
  function ($q, $timeout, HttpService) {
  
    var user = null;
    
    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }
    
    function getUserStatus() {
      return HttpService.get('auth/status', null)
        .success(function(data) {
          if(data.status) {
            user = true;
          } else {
            user = false;
          }
        })
        .error(function(data) {
          user = false;
        });
    }
    
    function login(username, password) {
      var deferred = $q.defer();

      HttpService.post('auth/login', null, {username: username, password: password})
        .success(function(data, status) {
          if(status === 200 && data.result) {
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        .error(function(data) {
          user = false;
          deferred.reject();
        });
        
      return deferred.promise;
    }
    
    function logout() {
      var deferred = $q.defer();
      
      HttpService.post('auth/logout')
        .success(function(data) {
          user = false;
          deferred.resolve();
        })
        .error(function(data) {
          user = false; // Always assume unauth!
          deferred.reject();
        });
      
      return deferred.promise;
    }
    
    function register(username, email, password) {
      var deferred = $q.defer();
      
      HttpService.post('auth/register', null, {username: username, email: email, password: password})
        .success(function(data, status) {
          if(status === 200) {
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        .error(function(data) {
          deferred.reject();
        });
      
      return deferred.promise;
    }
    
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
    })
}]);

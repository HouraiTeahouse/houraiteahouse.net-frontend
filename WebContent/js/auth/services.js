appServices.factory('AuthService', ['$q', '$timeout', '$cookies', 'HttpService',
  function ($q, $timeout, $cookies, HttpService) {
  
    var user = null;
    var permissions = null; // We cache this for performance.  The backend will still do a final check that can override this.
    
    function getSessionId() {
      return $cookies.get('htsessionid');
    }
    
    function setSessionId(sessionId, expiration) {
      if(expiration == null){
        expiration = 8640000000000000; // forever for all intents & purposes
      }
      $cookies.put('htsessionid', sessionId, {'expires': new Date(expiration)});
    }
    
    function clearSessionId(){
      $cookies.remove('htsessionid');
    }
    
    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }
    
    function getUserStatus() {
      var deferred = $q.defer();
      
      sessionId = getSessionId();
      if(sessionId == null) {
        user = false;
        permissions = null;
        deferred.resolve();
      } else {
        if(user) {
          deferred.resolve();
        } else {
          HttpService.get('auth/status', null, {'session_id': sessionId})
            .success(function(data) {
              if(data.status) {
                user = true;
                permissions = data.permissions;
                deferred.resolve();
              } else {
                permissions = null;
                user = false;
                clearSessionId(); // If the cookie is present, it's invalid. Drop it.
                deferred.resolve();
              }
            })
            .error(function(data) {
              permissions = null;
              user = false;
              deferred.reject();
            });
        }
      }

      return deferred.promise;
    }
    
    function login(username, password, remember_me) {
      var deferred = $q.defer();

      HttpService.post('auth/login', null, {username: username, password: password, remember_me: remember_me})
        .success(function(data, status) {
          if(status === 200 && data.session_id != null) {
            setSessionId(data.session_id, data.expiration);
            permissions = data.permissions;
            user = true;
            deferred.resolve();
          } else {
            permissions = null;
            user = false;
            deferred.reject(data);
          }
        })
        .error(function(data) {
          permissions = null;
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
          permissions = null;
          deferred.resolve();
        })
        .error(function(data) {
          user = false; // Always assume unauth!
          permissions = null;
          deferred.reject();
          clearSessionId(); // No point in keeping the cookie - it will just trigger false status checks from now on.
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
    
    function getPermissions(username) {
      var deferred = $q.defer();
      
      HttpService.get('auth/permissions', username, {session_id: getSessionId()})
        .success(function(data, status) {
          if(status === 200) {
            deferred.resolve(data);
          } else {
            deferred.reject(data);
          }
        })
        .error(function(data) {
          deferred.reject();
        })
        
      return deferred.promise;
    }
    
    function setPermissions(username, permissions) {
      var deferred = $q.defer();
      
      HttpService.post('auth/permissions', username, {session_id: getSessionId(), permissions: permissions})
        .success(function(data, status) {
          if(status === 200) {
            deferred.resolve();
          } else {
            deferred.reject(data)
          }
        })
        .error(function(data) {
          deferred.reject();
        })
        
      return deferred.promise;
    }
    
    // Utilities for Auth versions of HTTP calls
    
    function httpGetWithAuth(path, id, params) {
      params['session_id'] = getSessionId()
      return HttpService.get(path, id, params);
    }
    
    function httpPutWithAuth(path, id, params) {
      params['session_id'] = getSessionId()
      return HttpService.put(path, id, params);
    }

    function httpPostWithAuth(path, id, params) {
      params['session_id'] = getSessionId()
      return HttpService.post(path, id, params);
    }
    
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register,
      getPermissions: getPermissions,
      setPermissions: setPermissions,
      httpGetWithAuth: httpGetWithAuth,
      httpPutWithAuth: httpPutWithAuth,
      httpPostWithAuth: httpPostWithAuth
    })
}]);

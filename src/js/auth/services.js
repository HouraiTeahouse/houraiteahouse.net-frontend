import appServices from '../appServicesModule.js';

appServices.factory('AuthService', ['$rootScope', '$q', '$timeout', '$cookies', 'HttpService', '$location',
  function ($rootScope, $q, $timeout, $cookies, HttpService, $location) {

    var permissions = null; // We cache this for performance.  The backend will still do a final check that can override this.

    function getAccessToken() {
      let cookie = $cookies.get('access_token');
      if (typeof cookie != 'undefined') {
        return cookie.split("#")[3];
      }
    }

    function getWikiId(username) {
      return username.replace(/(\w)(\w*)[^\w]*/g, function(g0,g1,g2){
        return g1.toUpperCase() + g2.toLowerCase();
      })
    }

    function setCookie(accessToken, username, email, expiration) {
      let params = {};
      if(expiration != null) {
        params['expires'] = new Date(expiration);

        let host = $location.host().split('.');
        let dom1 = "";
        if (typeof (host[host.length - 2]) != 'undefined') dom1 = host[host.length - 2] + '.';
        let domain = dom1 + host[host.length - 1];

        //In RFC 2109, a domain without a leading dot meant that it could not be
        //used on subdomains, and only a leading dot (.mydomain.com) would allow
        //it to be used across subdomains.
        //
        //However, modern browsers respect the newer specification RFC 6265, and
        //will ignore any leading dot, meaning you can use the cookie on
        //subdomains as well as the top-level domain.
        //
        //This is required for the SSO to work with other related sites like the
        //wiki. For full compatibility, we are using the leading dot.
        params['domain'] = ((domain === 'localhost') ? "" : ".") + domain;
      }
      let wikiId= getWikiId(username);
      $cookies.put('htlogin', wikiId+ "#" + email + "#" + username + "#" + accessToken, params);
    }

    function clearAccessToken() {
      $cookies.remove('htlogin');
    }

    function isLoggedIn() {
      if($rootScope.user) {
        return true;
      } else {
        return false;
      }
    }

    // FIXME: this should load permissions if they're not already
    // Problem mainly effects HeaderCtrl since it's initialized on page load
    function allowAccess(accessGroup) {
      if(accessGroup == null) {
        return true;
      }
      // Must be explicit since permissions may not contain accessGroup (and hence permissions[accessGroup] would be undefined)
      if(permissions != null && permissions[accessGroup]) {
        return true;
      }
      return false;
    }

    function getUserStatus() {
      var deferred = $q.defer();

      var accessToken = getAccessToken();
      if(accessToken == null) {
        $rootScope.user = false;
        permissions = null;
        deferred.resolve();
      } else {
        if($rootScope.user) {
          deferred.resolve();
        } else {
          httpGetWithAuth('user/status')
            .success(function(data) {
              if(data.status) {
                $rootScope.user = true;
                permissions = data.permissions;
                deferred.resolve();
              } else {
                permissions = null;
                $rootScope.user = false;
                clearAccessToken(); // If the cookie is present, it's invalid. Drop it.
                deferred.resolve();
              }
            })
            .error(function(data) {
              permissions = null;
              $rootScope.user = false;
              deferred.reject();
            });
        }
      }

      return deferred.promise;
    }

    function login(username, password, remember_me) {
      var deferred = $q.defer();

      HttpService.post('auth', null, {username: username, password: password})
        .success(function(data, status) {
          if(status === 200 && data.access_token != null) {
            var expiration = new Date();
            expiration.setDate(expiration.getTime() + 24*60*60*1000);
            setCookie(data.access_token,
                username,
                data.email,
                expiration);
            permissions = data.permissions;
            $rootScope.user = true;
            deferred.resolve();
          } else {
            permissions = null;
            $rootScope.user = false;
            deferred.reject(data);
          }
        })
        .error(function(data) {
          permissions = null;
          $rootScope.user = false;
          deferred.reject(data);
        });

      return deferred.promise;
    }

    function logout() {
      $rootScope.user = false;
      permissions = null;
      clearAccessToken();
    }

    function register(username, email, password) {
      var deferred = $q.defer();

      HttpService.post('user', null, {username: username, email: email, password: password})
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

    // Administrative actions

    function getPermissions(username) {
      var deferred = $q.defer();

      httpGetWithAuth('user/permissions', username)
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

      httpPostWithAuth('user/permissions', username, {permissions: permissions})
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

    // Utilities for Auth'd versions of HTTP calls

    function httpGetWithAuth(path, id, params, language) {
      if (params == null) {
        params = {};
      }
      params['access_token'] = getAccessToken();
      return HttpService.get(path, id, params, language);
    }

    function httpPutWithAuth(path, id, params, language) {
      if (params == null) {
        params = {};
      }
      params['access_token'] = getAccessToken();
      return HttpService.put(path, id, params, language);
    }

    function httpPostWithAuth(path, id, params, language) {
      if (params == null) {
        params = {};
      }
      params['access_token'] = getAccessToken();
      return HttpService.post(path, id, params, language);
    }

    return ({
      isLoggedIn: isLoggedIn,
      allowAccess: allowAccess,
      getUserStatus: getUserStatus,
      getWikiId: getWikiId,
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

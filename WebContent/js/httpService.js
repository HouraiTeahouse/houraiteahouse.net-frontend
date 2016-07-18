appServices.factory('HttpService', function($http) {
  httpInvoke = function(call, path, id, params) {
    if(id == null) {
      return call(options.api.base_url + '/' + path, params)
    }
    return call(options.api.base_url + '/' + path + '/' + id, params)
  }
  
  return {

    get: function(path, id, params) {
      return httpInvoke($http.get, path, id, {params: params});
    },

    post: function(path, id, params) {
      return httpInvoke($http.post, path, id, params);
    },

    put: function(path, id, params) {
      return httpInvoke($http.put, path, id, params);
    }
  }
})

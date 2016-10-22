appServices.factory('LanguageService', ['$cookies',
  function($cookies) {
    // Yes, this needs to be kept in sync manually versus the backend.
    // However, this way we do not need to request the supported language list from the backend.
    // As for why it's in this format, it's ngRepeat friendly
    var languages = [
      {
        "code": "en",
        "name": "English"
      },
      {
        "code": "ja",
        "name": "日本語"
      }
    ];
    
    function getSupportedLanguages() {
      return languages;
    }
    
    function getLanguageName(languageCode) {
      var ret = null;
      languages.forEach(function(language, index, arr) {
        if(languageCode == language.code) {
          ret = language.name
        }
      });
      return ret;
    }
    
    function getLanguage() {
      var lang = $cookies.get('htlanguage');
      if(lang == null) {
        setLanguage('en');
        return 'en';
      }
      return lang;
    }

    function setLanguage(languageCode) {
      languages.forEach(function(language, index, arr) {
        if(languageCode == language.code) {
          $cookies.put('htlanguage', languageCode);          
        }
      });
      // If it's not recognized, don't update the cookie
    }
    
    return {
      getSupportedLanguages: getSupportedLanguages,
      getLanguageName: getLanguageName,
      getLanguage: getLanguage,
      setLanguage: setLanguage
    }
}]);

appServices.factory('HttpService', ['$http', 'LanguageService',
  function($http, LanguageService) {
    httpInvoke = function(call, path, id, params) {
      if(id == null) {
        return call(options.api.base_url + '/' + path, params)
      }
      return call(options.api.base_url + '/' + path + '/' + id, params)
    }
    
    function injectLanguage(params, language) {
      if(params == null) {
        params = {};
      }
      if(language == null) {
        // Only a handful of calls specify language, most use the current setting
        language = LanguageService.getLanguage();
      }
      params['language'] = language;
      return params;
    }
    
    return {      
      get: function(path, id, params, language) {
        params = injectLanguage(params, language);
        return httpInvoke($http.get, path, id, {params: params});
      },
  
      post: function(path, id, params, language) {
        params = injectLanguage(params, language);
        return httpInvoke($http.post, path, id, params);
      },
  
      put: function(path, id, params, language) {
        params = injectLanguage(params, language);
        return httpInvoke($http.put, path, id, params);
      }
    }
}]);

import { options } from '../app.js';
import appServices from '../appServicesModule.js';

appServices.factory('LanguageService', ['$translate',
  function($translate) {
    // Yes, this needs to be kept in sync manually versus the backend.
    // However, this way we do not need to request the supported language list from the backend.
    // As for why it's in this format, it's ngRepeat friendly
    var languages = [
      {
        "code": "en",
        "name": "English"
      },
      {
        "code": "es",
        "name": "Español"
      },
      {
        "code": "fr",
        "name": "Français"
      },
      {
        "code": "de",
        "name": "Deutsch"
      },
      {
        "code": "ja",
        "name": "日本語"
      },
      {
        "code": "sr",
        "name": "Srpski"
      }
    ];

    function getSupportedLanguages() {
      return languages;
    }

    function getDefaultLanguage() {
      return 'en';
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
      return $translate.use();
    }

    function setLanguage(languageCode) {
      return $translate.use(languageCode);
    }

    return {
      getSupportedLanguages: getSupportedLanguages,
      getLanguageName: getLanguageName,
      getDefaultLanguage: getDefaultLanguage,
      getLanguage: getLanguage,
      setLanguage: setLanguage
    }
}]);

appServices.factory('HttpService', ['$http', 'LanguageService',
  function($http, LanguageService) {
    var httpInvoke = function(call, path, id, params) {
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

import angular from 'angular';
import angularCookies from 'angular-cookies';
import angularUiRouter from 'angular-ui-router';
import angularUiBootstrap from 'angular-ui-bootstrap';

import 'angulartics';
import angularticsGA from 'angulartics-google-analytics';

import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';

import 'ng-meta';

import './appControllersModule.js';
import './appServicesModule.js';
import './appDirectivesModule.js';

import './common/controllers.js';
import './common/services.js';
import './auth/controllers.js';
import './auth/services.js';
import './news/controllers.js';
import './projects/controllers.js';
import './projects/services.js';
import './projects/directives.js';

// Main module declaration
var app = angular.module('houraiteahouse', [
    angularUiRouter,
    angularUiBootstrap,
    angularCookies,
    'angulartics',
    angularticsGA,
    'ngMeta',
    'pascalprecht.translate',
    'appControllers',
    'appDirectives',
    'appServices'
])


var options = (function() {
  var base_url;

  // @ifdef DEVELOPMENT_MODE
  // Local testing backend
  base_url = "/* @echo DEVELOPMENT_URL */";
  // @endif

  // @ifdef PRODUCTION_MODE
  // Production backend
  base_url = "/* @echo PRODUCTION_URL */";
  // @endif

  if (!base_url) {
    throw new Error('API url is not configured!!!');
  }

  return {
    "api":{
      "base_url": base_url
    }
  };
})();

// Main app configuration
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$translateProvider',
    'ngMetaProvider',
  function($stateProvider,
      $urlRouterProvider,
      $locationProvider,
      $httpProvider,
      $translateProvider,
      ngMetaProvider) {

    // Remove unnecessary and ugly '#' characters in URL
    // for browsers that support HTML5 mode.
    $locationProvider.html5Mode(true);

    // Load language information only when needed
    // Cache the language information so that it isn't repeatedly fetched
    $translateProvider.useStaticFilesLoader({
        prefix: '/i18n/',
        suffix: '.json'
      });

    $translateProvider.useLocalStorage();
    $translateProvider.determinePreferredLanguage();
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escape');

    ngMetaProvider.setDefaultTitle('Hourai Teahouse | ');
    ngMetaProvider.useTitleSuffix(true);
    ngMetaProvider.setDefaultTitleSuffix('Doujin Development');

    // State configuration
    $stateProvider.decorator('data', ngMetaProvider.mergeNestedStateData);
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'partials/home.html',
        requireLogin: false
      })
      .state('about', {
        url: '/about',
        templateUrl: 'partials/under_construction.html',
        requireLogin: false,
        data: {
          'meta': {
            'titleSuffix': 'About Us'
          }
        }
      })
      .state('about.team', {
        url: '/team',
        templateUrl: 'partials/under_construction.html',
        requireLogin: false,
        data: {
          'meta': {
            'titleSuffix': 'The Team'
          }
        }
      })
      .state('wiki', {
        url: '/wiki',
        templateUrl: 'partials/under_construction.html',
        requireLogin: false,
        data: {
          'meta': {
            'titleSuffix': 'Wiki'
          }
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'partials/auth/login.html',
        controller: 'LoginCtrl',
        requireLogin: false,
        data: {
          'meta': {
            'titleSuffix': 'Login'
          }
        }
      })
      .state('logout', {
        url: '/logout',
        requireLogin: true
      })
      .state('register', {
        url: '/register',
        templateUrl: 'partials/auth/register.html',
        controller: 'RegisterCtrl',
        requireLogin: false,
        data: {
          'meta': {
            'titleSuffix': 'Register'
          }
        }
      })
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        requireLogin: true,
        permission: 'admin'
      })
      .state('admin.permissions', {
        url: '/permissions',
        templateUrl: 'partials/auth/permissions.html',
        controller: 'PermissionCtrl',
        requireLogin:false,
        data: {
          'meta': {
            'titleSuffix': 'Permissions Dashboard'
          }
        }
      })
      .state('news', {
        abstract: true,
        url: '/news',
        template: '<ui-view/>',
        requireLogin: false,
        data: {
          'meta': {
            'titleSuffix': 'News'
          }
        }
      })
      .state('news.list', {
        url: '',
        templateUrl: 'partials/news/news-list.html',
        controller: 'NewsListCtrl',
        requireLogin:false
      })
      .state('news.tags', {
        url: '/tags/:tag',
        templateUrl: 'partials/news/news-list.html',
        controller: 'NewsListCtrl',
        requireLogin:false
      })
      .state('news.post', {
        url: '/post/:id',
        templateUrl: 'partials/news/news-post.html',
        controller: 'NewsPostCtrl',
        requireLogin:false
      })
      .state('news.create', {
        url: '/create',
        templateUrl: 'partials/news/news-create.html',
        controller: 'NewsCreateCtrl',
        requireLogin: true,
        permission: 'news',
        data: {
          'meta': {
            'titleSuffix': 'Create Post'
          }
        }
      })
      .state('news.translate', {
        url: '/translate/:id',
        templateUrl: 'partials/news/news-translate.html',
        controller: 'NewsTranslateCtrl',
        requireLogin: true,
        permission: 'translate',
        data: {
          'meta': {
            'titleSuffix': 'Translate Post'
          }
        }
      })
      .state('projects', {
        abstract: true,
        url: '/projects',
        template: '<ui-view />',
      })
      .state('projects.list', {
        url: '',
        templateUrl: 'partials/projects/projects-list.html',
        controller: 'ProjectsListCtrl',
        requireLogin: false,
        data: {
          'meta': {
            'titleSuffix': 'Projects'
          }
        }
      })
      .state('project', {
        abstract: true,
        url: '/project',
        template: '<ui-view />'
      })
      .state('project.detail', {
        url: '/{code}',
        templateUrl: 'partials/projects/project.html',
        controller: 'ProjectDetailCtrl',
        requireLogin: false
      })
      .state('project.detail.about', {
        url: '/about',
        views: {
          about: {
            templateUrl: function (params) {
              return 'partials/projects/' + params.code + '/about.html';
            }
          }
        },
        requireLogin: false
      })
      .state('project.detail.characters', {
        url: '/characters',
        views: {
          characters: {
            templateUrl: function (params) {
              return 'partials/projects/' + params.code + '/characters.html';
            }
          }
        },
        requireLogin: false
      })
      .state('project.detail.downloads', {
        url: '/downloads',
        views: {
          downloads: {
            templateUrl: function (params) {
              return 'partials/projects/' + params.code + '/downloads.html';
            }
          }
        },
        requireLogin: false
      })
      .state('404', {
        templateUrl: 'partials/404.html',
        requireLogin:false,
        data: {
          'meta': {
            'title': "Not Found"
          }
        }
      })

      $urlRouterProvider.otherwise(function($injector, $location) {
        var state = $injector.get('$state');
        state.go('404');
        return $location.path();
      });

      // Prevent unauthorized requests to restricted pages & trigger login
      $httpProvider.interceptors.push(['$timeout', '$q', '$injector',
        function($timeout, $q, $injector) {
          var $state;

          $timeout(function() {
            $state = $injector.get('$state');
          });

          return {
            responseError: function(rejection) {
              if (rejection.status !== 403) {
                return $q.reject(rejection);
              }

              $state.go('login');
            }
          };
        }
      ]);
    }
]);

app.run(['$rootScope', '$state', 'AuthService', 'ngMeta', '$location',
  function ($rootScope, $state, AuthService, ngMeta, $location) {
    ngMeta.init();
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if(toState.name == 'login' && fromState.name !== '') {
        $location.search('redirect_uri', fromState.name);
      }
    });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      AuthService.getUserStatus()
        .then(function() {
          if (toState.requireLogin) {
            if (!AuthService.isLoggedIn()) {
              $state.go('login');
            }
            else if (!AuthService.allowAccess(toState.permission)) {
              $state.go('home');
            }
          }
          if (toState.name == 'logout') {
            AuthService.logout();
            $state.go('login');
          }
        });
    });
  }
]);

export { options };
export default app.name;

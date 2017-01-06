import angular from 'angular';
import angularCookies from 'angular-cookies';
import angularUiRouter from 'angular-ui-router';
import angularUiBootstrap from 'angular-ui-bootstrap';
import 'angulartics';
import angularticsGA from 'angulartics-google-analytics';

import './appControllersModule.js';
import './appServicesModule.js';
import './appDirectivesModule.js';

import './common/controllers.js';
import './common/services.js';
import './auth/controllers.js';
import './auth/services.js';
import './news/controllers.js';

// Main module declaration
var app = angular.module('houraiteahouse', [
    angularUiRouter,
    angularUiBootstrap,
    angularCookies,
    'angulartics',
    angularticsGA,
    'appControllers',
    'appDirectives',
    'appServices'
])

var options = {
  "api":{
    "base_url": "http://localhost:5000"
  }
};

// Main app configuration
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
  function($stateProvider,
      $urlRouterProvider,
      $locationProvider,
      $httpProvider) {

    // Remove unnecessary and ugly '#' characters in URL
    // for browsers that support HTML5 mode.
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/404');

    // State configuration
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'partials/home.html',
        requireLogin: false
      })
      .state('about', {
        url: '/about',
        templateUrl: 'partials/under_construction.html',
        requireLogin: false
      })
      .state('about.team', {
        url: '/team',
        templateUrl: 'partials/under_construction.html',
        requireLogin: false
      })
      .state('wiki', {
        url: '/wiki',
        templateUrl: 'partials/under_construction.html',
        requireLogin: false
      })
      .state('login', {
        url: '/login',
        templateUrl: 'partials/auth/login.html',
        controller: 'LoginCtrl',
        requireLogin: false
      })
      .state('logout', {
        url: '/logout',
        requireLogin: true
      })
      .state('register', {
        url: '/register',
        templateUrl: 'partials/auth/register.html',
        controller: 'RegisterCtrl',
        requireLogin: false
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
        requireLogin:false
      })
      .state('news', {
        abstract: true,
        url: '/news',
        template: '<ui-view/>',
        requireLogin: false
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
        permission: 'news'
      })
      .state('news.translate', {
        url: '/translate/:id',
        templateUrl: 'partials/news/news-translate.html',
        controller: 'NewsTranslateCtrl',
        requireLogin: true,
        permission: 'translate'
      })
      .state('404', {
        url: '/404',
        templateUrl: 'partials/404.html',
        requireLogin:false
      })

      // Prevent unauthorized requests to restricted pages & trigger login
      $httpProvider.interceptors.push(['$timeout', '$q', '$injector',
        function($timeout, $q, $injector) {
          var $http, $state;

          $timeout(function() {
            $http = $injector.get('$http');
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

app.run(['$rootScope', '$state', 'AuthService',
  function ($rootScope, $state, AuthService) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
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

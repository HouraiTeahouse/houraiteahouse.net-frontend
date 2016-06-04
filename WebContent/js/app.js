'use strict';

// Module declarations
var appControllers = angular.module('appControllers', []);
var appDirectives = angular.module('appDirectives', []);
var appServices = angular.module('appServices', []);
var app = angular.module('houraiteahouse', ['ui.router', 'ui.bootstrap', 'appControllers', 'appDirectives', 'appServices'])

var options = {};
options.api = {};
options.api.base_url = "http://localhost:5000";

// Main app configuration
app.config(function($stateProvider, $urlRouterProvider, $httpProvider){

  $urlRouterProvider.otherwise('/home');
  
  // State configuration
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'partials/home.html',
      requireLogin: false
    })
    .state('about', {
      url: '/about',
      templateUrl: 'partials/about.html',
      requireLogin: true
    })
    .state('login', {
      url: '/login',
      templateUrl: 'partials/auth/login.html',
      controller: 'LoginCtrl',
      requireLogin: false
    })
    .state('logout', {
      url: '/logout',
      controller: 'LogoutCtrl',
      requireLogin: true
    })
    .state('register', {
      url: '/register',
      templateUrl: 'partials/auth/register.html',
      controller: 'RegisterCtrl',
      requireLogin: false
    })
    .state('newslist', {
      url: '/news',
      templateUrl: 'partials/news/news-list.html',
      controller: 'NewsListCtrl',
      requireLogin: false
    })
    .state('newstags', {
      url: '/news/tags/:tag',
      templateUrl: '/partials/news/tags.html',
      controller: 'NewsListCtrl',
      requireLogin: false
    })
    .state('newspost', {
      url: '/news/:id',
      templateUrl: 'partials/news/news-post.html',
      controller: 'NewsPostCtrl',
      requireLogin: false
    })
    
    // Prevent unauthorized requests to restricted pages & trigger login modal
    $httpProvider.interceptors.push(function($timeout, $q, $injector) {
      var $http, $state;
      
      $timeout(function() {
        $http = $injector.get('$http');
        $state = $injector.get('$state');
      });
      
      return {
        responseError: function(rejection) {
          if (rejection.status !== 401) {
            return rejection;
          }
  
          $state.go('login')
        }
      };
    });
});

app.run(function ($rootScope, $state, AuthService) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
    AuthService.getUserStatus()
      .then(function() {
        if (toState.requireLogin && !AuthService.isLoggedIn()) {
          $state.go('login');
        }
      });
  });
})
;

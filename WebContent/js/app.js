'use strict';

// Module declarations
var appControllers = angular.module('appControllers', []);
var appDirectives = angular.module('appDirectives', []);
var appServices = angular.module('appServices', ['ngCookies']);
var app = angular.module('houraiteahouse', ['ui.router', 'ui.bootstrap', 'ngCookies', 'appControllers', 'appDirectives', 'appServices'])

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
      requireLogin: false
    })
    .state('news.tags', {
      url: '/tags/:tag',
      templateUrl: 'partials/news/news-list.html',
      controller: 'NewsListCtrl',
      requireLogin: false
    })
    .state('news.post', {
      url: '/post/:id',
      templateUrl: 'partials/news/news-post.html',
      controller: 'NewsPostCtrl',
      requireLogin: false
    })
    .state('news.create', {
      url: '/create',
      templateUrl: 'partials/news/news-create.html',
      controller: 'NewsCreateCtrl',
      requireLogin: true
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
          if (rejection.status !== 403) {
            return rejection;
          }
  
          $state.go('login')
        }
      };
    });
});

app.run(function ($rootScope, $state, AuthService) {
  
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
    console.log($state.href('news.list',{},{absolute:true}))
    AuthService.getUserStatus()
      .then(function() {
        if (toState.requireLogin && !AuthService.isLoggedIn()) {
          $state.go('login');
        }
      });
  });
});

appControllers.controller('HeaderCtrl', ['$scope', '$state',
  function($scope, $state) {
    $scope.$state = $state;
  }
])
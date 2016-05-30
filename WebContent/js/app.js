'use strict';

// Module declarations
var app = angular.module('houraiteahouse', ['ui.router', 'appControllers', 'appDirectives', 'appServices'])

var appControllers = angular.module('appControllers', []);
var appDirectives = angular.module('appDirectives', []);
var appServices = angular.module('appServices', []);

var options = {};
options.api = {};
options.api.base_url = "http://localhost:5000";

// Main app configuration
app.config(function($stateProvider, $urlRouterProvider, $controllerProvider){

  $urlRouterProvider.otherwise('/home');
  
  $stateProvider
    // Home states & nested views
    .state('home', {
      url: '/home',
      templateUrl: 'partials/home.html'
    })
    // About page & named views
    .state('about', {
      url: '/about',
      templateUrl: 'partials/about.html'
    })
    .state('newslist', {
      url: '/news',
      templateUrl: 'partials/news/news-list.html',
      controller: 'NewsListCtrl'
    })
    .state('newstags', {
      url: '/news/tags/:tag',
      templateUrl: '/partials/news/tags.html',
      controller: 'NewsListCtrl'
    })
    .state('newspost', {
      url: '/news/:id',
      templateUrl: 'partials/news/news-post.html',
      controller: 'NewsPostCtrl'
    })
});

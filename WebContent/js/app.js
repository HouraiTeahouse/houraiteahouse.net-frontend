'use strict';

// Module declarations
var app = angular.module('houraiteahouse', ['ui.router', 'appControllers', 'appDirectives'])

var appControllers = angular.module('appControllers', []);
var appDirectives = angular.module('appDirectives', []);

var options = {};

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
      url: '/news/tags',
      templateUrl: '/partials/news/tags.html'
    })
    .state('newspost', {
      url: '/news/:id',
      templateUrl: 'partials/news/news-post.html',
      controller: 'NewsPostCtrl',
      controllerAs: 'postCtrl'
    })
});

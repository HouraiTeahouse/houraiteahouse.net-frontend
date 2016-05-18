'use strict';

var app = angular.module('houraiteahouse', ['ui.router'])

app.config(function($stateProvider, $urlRouterProvider){

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
    .state('news', {
      url: '/news',
      templateUrl: 'partials/news/news-list.html'
    })
});

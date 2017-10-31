'use strict';

angular.module('autodealerApp')
  .config(function ($stateProvider) {
	  $stateProvider
	    .state('app.dashboard', {
	      url: '/',
	      templateUrl: 'app/dashboard/dashboard.html',
	      controller: 'DashboardCtrl',
	      authenticate: true
	    });
	  /*$routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });*/
  });

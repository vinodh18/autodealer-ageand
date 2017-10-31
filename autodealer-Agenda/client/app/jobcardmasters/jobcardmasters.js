'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.jobcardmasters', {
	      url: '/jobcardmasters',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.jobcardmasters.list', {
	      url: '/',
	      templateUrl: 'app/jobcardmasters/jobcardmasters.html',
	      controller: 'JobcardmastersCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.jobcardmasters.create', {
		      url: '/create',
		      templateUrl: 'app/jobcardmasters/create_jobcardmaster.html',
		      controller: 'JobcardmastersCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})
		.state('app.jobcardmasters.edit', {
		      url: '/:jobcardmasterId/edit',
		      templateUrl: 'app/jobcardmasters/edit_jobcardmaster.html',
		      controller: 'JobcardmastersCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN']
		})
		.state('app.jobcardmasters.view', {
		      url: '/:jobcardmasterId/view',
		      templateUrl: 'app/jobcardmasters/view_jobcardmaster.html',
		      controller: 'JobcardmastersCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		});
});

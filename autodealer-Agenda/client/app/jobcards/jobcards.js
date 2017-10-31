  'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.jobcards', {
	      url: '/jobcards',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.jobcards.list', {
	      url: '/',
	      templateUrl: 'app/jobcards/jobcards.html',
	      controller: 'JobcardsCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.jobcards.create', {
		      url: '/create',
		      templateUrl: 'app/jobcards/create_jobcard.html',
		      controller: 'JobcardsCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})
		.state('app.jobcards.edit', {
		      url: '/:jobcardId/edit',
		      templateUrl: 'app/jobcards/edit_jobcard.html',
		      controller: 'JobcardsCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		})
		.state('app.jobcards.view', {
		      url: '/:jobcardId/view',
		      templateUrl: 'app/jobcards/view_jobcards.html',
		      controller: 'JobcardsCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		})
		.state('app.jobcards.feedbacklist', {
	      url: '/feedback',
	      templateUrl: 'app/jobcards/feedback.html',
	      controller: 'JobcardsCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
	    })		
		.state('app.jobcards.Inprogresslist', {
	      url: '/inprogress',
	      templateUrl: 'app/jobcards/inprogress.html',
	      controller: 'JobcardsCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
	    })
	    .state('app.jobcards.paymentduelist', {
	      url: '/paymentdue',
	      templateUrl: 'app/jobcards/paymentdue.html',
	      controller: 'JobcardsCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
	    })
	    .state('app.jobcards.scheduledlist', {
	      url: '/scheduled',
	      templateUrl: 'app/jobcards/scheduled.html',
	      controller: 'JobcardsCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
	    });
});

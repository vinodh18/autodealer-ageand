  'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.newsevents', {
	      url: '/news-event',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.newsevents.list', {
	      url: '/',
	      templateUrl: 'app/newsevents/newsevents.html',
	      controller: 'NewseventsCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.newsevents.create', {
		      url: '/create',
		      templateUrl: 'app/newsevents/create_newsevents.html',
		      controller: 'NewseventsCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})
		.state('app.newsevents.edit', {
		      url: '/:newseventsId/edit',
		      templateUrl: 'app/newsevents/edit_newsevents.html',
		      controller: 'NewseventsCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN']
		})
		.state('app.newsevents.view', {
		      url: '/:newseventsId/view',
		      templateUrl: 'app/newsevents/view.html',
		      controller: 'NewseventsCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		});
});

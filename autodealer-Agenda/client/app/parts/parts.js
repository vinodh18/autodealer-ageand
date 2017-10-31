'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.parts', {
	      url: '/parts',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.parts.list', {
	      url: '/',
	      templateUrl: 'app/parts/parts.html',
	      controller: 'PartsCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.parts.create', {
		      url: '/create',
		      templateUrl: 'app/parts/create_parts.html',
		      controller: 'PartsCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})
		.state('app.parts.edit', {
		      url: '/:partId/edit',
		      templateUrl: 'app/parts/edit_parts.html',
		      controller: 'PartsCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN']
		})
		.state('app.parts.view', {
		      url: '/:partId/view',
		      templateUrl: 'app/parts/view_part.html',
		      controller: 'PartsCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		});
});

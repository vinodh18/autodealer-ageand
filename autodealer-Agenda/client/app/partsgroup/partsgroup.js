  'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.partsgroup', {
	      url: '/partsgroup',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.partsgroup.list', {
	      url: '/',
	      templateUrl: 'app/partsgroup/partsgroup.html',
	      controller: 'PartsgroupCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.partsgroup.create', {
		      url: '/create',
		      templateUrl: 'app/partsgroup/create_partsgroup.html',
		      controller: 'PartsgroupCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})
		.state('app.partsgroup.edit', {
		      url: '/:partsgroupId/edit',
		      templateUrl: 'app/partsgroup/edit_partsgroup.html',
		      controller: 'PartsgroupCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN']
		})
		.state('app.partsgroup.view', {
		      url: '/:partsgroupId/view',
		      templateUrl: 'app/partsgroup/view_partsgroup.html',
		      controller: 'PartsgroupCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		});
});

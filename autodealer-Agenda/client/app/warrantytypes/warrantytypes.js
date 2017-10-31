       'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.warrantytypes', {
	      url: '/warranty-types',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.warrantytypes.list', {
	      url: '/',
	      templateUrl: 'app/warrantytypes/warrantytypes.html',
	      controller: 'WarrantytypesCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.warrantytypes.create', {
		      url: '/create',
		      templateUrl: 'app/warrantytypes/create_warrantytype.html',
		      controller: 'WarrantytypesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})
		.state('app.warrantytypes.edit', {
		      url: '/:warrantytypeId/edit',
		      templateUrl: 'app/warrantytypes/edit_warrantytype.html',
		      controller: 'WarrantytypesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})
		.state('app.warrantytypes.view', {
		      url: '/:warrantytypeId/view',
		      templateUrl: 'app/warrantytypes/view.html',
		      controller: 'WarrantytypesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		});
});

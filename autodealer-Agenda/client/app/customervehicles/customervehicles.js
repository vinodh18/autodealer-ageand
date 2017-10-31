      'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.customervehicles', {
	      url: '/customer-vehicles',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.customervehicles.list', {
	      url: '/',
	      templateUrl: 'app/customervehicles/customervehicles.html',
	      controller: 'CustomervehiclesCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.customervehicles.create', {
		      url: '/create',
		      templateUrl: 'app/customervehicles/create_customervehicles.html',
		      controller: 'CustomervehiclesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		})
		.state('app.customervehicles.edit', {
		      url: '/:customervehicleId/edit',
		      templateUrl: 'app/customervehicles/edit_customervehicles.html',
		      controller: 'CustomervehiclesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		});
});

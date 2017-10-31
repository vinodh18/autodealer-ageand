 'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.vehicles', {
	      url: '/vehicles',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.vehicles.list', {
	      url: '/',
	      templateUrl: 'app/vehicles/vehicles.html',
	      controller: 'VehiclesCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.vehicles.create', {
		      url: '/create',
		      templateUrl: 'app/vehicles/create_vehicles.html',
		      controller: 'VehiclesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})
		.state('app.vehicles.edit', {
		      url: '/:vehiclesId/edit',
		      templateUrl: 'app/vehicles/edit_vehicles.html',
		      controller: 'VehiclesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})
		.state('app.vehicles.view', {
		      url: '/:vehiclesId/view',
		      templateUrl: 'app/vehicles/view.html',
		      controller: 'VehiclesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		});
});

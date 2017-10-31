         'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.vehicletypes', {
	      url: '/vehicle-types',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.vehicletypes.list', {
	      url: '/',
	      templateUrl: 'app/vehicletypes/vehicletypes.html',
	      controller: 'VehicletypesCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.vehicletypes.create', {
		      url: '/create',
		      templateUrl: 'app/vehicletypes/create_vehicletype.html',
		      controller: 'VehicletypesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		})
		.state('app.vehicletypes.edit', {
		      url: '/:vehicletypeId/edit',
		      templateUrl: 'app/vehicletypes/edit_vehicletype.html',
		      controller: 'VehicletypesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN']
		});
});

  'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.labourcharges', {
	      url: '/labourcharges',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.labourcharges.list', {
	      url: '/',
	      templateUrl: 'app/labourcharges/labourcharges.html',
	      controller: 'LabourchargesCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.labourcharges.create', {
		      url: '/create',
		      templateUrl: 'app/labourcharges/create_labourcharge.html',
		      controller: 'LabourchargesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})
		.state('app.labourcharges.edit', {
		      url: '/:labourchargeId/edit',
		      templateUrl: 'app/labourcharges/edit_labourcharge.html',
		      controller: 'LabourchargesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN']
		})
		.state('app.labourcharges.view', {
		      url: '/:labourchargeId/view',
		      templateUrl: 'app/labourcharges/view_labourcharge.html',
		      controller: 'LabourchargesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		});
});

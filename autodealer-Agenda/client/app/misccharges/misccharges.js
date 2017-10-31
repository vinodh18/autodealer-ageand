 'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.misccharges', {
	      url: '/misccharges',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.misccharges.list', {
	      url: '/',
	      templateUrl: 'app/misccharges/misccharges.html',
	      controller: 'MiscchargesCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.misccharges.create', {
		      url: '/create',
		      templateUrl: 'app/misccharges/create_misccharge.html',
		      controller: 'MiscchargesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})
		.state('app.misccharges.edit', {
		      url: '/:miscchargeId/edit',
		      templateUrl: 'app/misccharges/edit_misccharge.html',
		      controller: 'MiscchargesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN']
		})
		.state('app.misccharges.view', {
		      url: '/:miscchargeId/view',
		      templateUrl: 'app/misccharges/view_misccharge.html',
		      controller: 'MiscchargesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		});
});

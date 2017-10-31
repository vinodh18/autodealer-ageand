    'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.adsmedia', {
	      url: '/ads-media',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.adsmedia.list', {
	      url: '/',
	      templateUrl: 'app/adsmedia/adsmedia.html',
	      controller: 'AdsmediaCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.adsmedia.create', {
		      url: '/create',
		      templateUrl: 'app/adsmedia/create_adsmedia.html',
		      controller: 'AdsmediaCtrl',
		      authenticate: true,		      
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})
		.state('app.adsmedia.edit', {
		      url: '/:adsmediaId/edit',
		      templateUrl: 'app/adsmedia/edit_adsmedia.html',
		      controller: 'AdsmediaCtrl',
		      authenticate: true,
	      	  role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN']
		})
		.state('app.adsmedia.view', {
		      url: '/:adsmediaId/view',
		      templateUrl: 'app/adsmedia/view.html',
		      controller: 'AdsmediaCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		});
});

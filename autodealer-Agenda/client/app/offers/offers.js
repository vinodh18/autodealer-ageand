  'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.offers', {
	      url: '/offers',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.offers.list', {
	      url: '/',
	      templateUrl: 'app/offers/offers.html',
	      controller: 'OffersCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.offers.create', {
		      url: '/create',
		      templateUrl: 'app/offers/create_offers.html',
		      controller: 'OffersCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})
		.state('app.offers.edit', {
		      url: '/:offersId/edit',
		      templateUrl: 'app/offers/edit_offers.html',
		      controller: 'OffersCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN']
		})
		.state('app.offers.view', {
		      url: '/:offersId/view',
		      templateUrl: 'app/offers/view.html',
		      controller: 'OffersCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		});
});

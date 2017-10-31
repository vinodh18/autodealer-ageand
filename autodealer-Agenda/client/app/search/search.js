  'use strict';

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  .state('app.searhvehicles', {
	      url: '/search-customervehicles',
	      template: '<ui-view/>',
	       abstract: true,
	     })
	  .state('app.searchservices', {
	      url: '/search-services',
	      template: '<ui-view/>',
	    
	    })
	   .state('app.searchservices.servicelist', {
	      url: '/',
	      templateUrl: 'app/search/services.html',
	      controller: 'SearchCtrl',
	       authenticate: true,
	       role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
	    })

	 // services

	   .state('app.searchservices.edit', {
		  url: '/:serviceId/edit',
	      templateUrl: 'app/services/edit_service.html',
	      controller: 'ServicesCtrl',
	       authenticate: true,
	       role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})

	   .state('app.searchservices.view', {
	      url: '/:serviceId/view',
	      templateUrl: 'app/services/view.html',
	      controller: 'ServicesCtrl',
	       authenticate: true,
	       role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
	    })

	
	 .state('app.searchservices.list', {
	     url: '/',
	     templateUrl: 'app/services/services.html',
	     controller: 'ServicesCtrl'
	  })
	 .state('app.searchservices.create', {
		    url: '/create',
		    templateUrl: 'app/services/create_service.html',
		    controller: 'ServicesCtrl',
		    authenticate: true,
	       	role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
		});


});

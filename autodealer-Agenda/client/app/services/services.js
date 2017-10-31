              'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.services', {
	      url: '/services',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.services.feedbacklist', {
	      url: '/feedback',
	      templateUrl: 'app/services/feedback.html',
	      controller: 'ServicesCtrl',
	      authenticate: true/*,
	      role: ['MANAGER', 'STAFF', 'ENGINEER']*/
	    })
	    .state('app.services.list', {
	      url: '/',
	      templateUrl: 'app/services/services.html',
	      controller: 'ServicesCtrl',
	      authenticate: true/*,
	      role: ['MANAGER' , 'ENGINEER' , 'STAFF']*/
	    })
	    .state('app.services.create', {
		      url: '/create',
		      templateUrl: 'app/services/create_service.html',
		      controller: 'ServicesCtrl',
		      authenticate: true/*,
		      role: 'CUSTOMER'*/
		})
		.state('app.services.edit', {
		      url: '/:serviceId/edit',
		      templateUrl: 'app/services/edit_service.html',
		      controller: 'ServicesCtrl',
		      authenticate: true/*,
		      role: ['STAFF', 'CUSTOMER',  'MANAGER']*/
		})

		.state('app.services.view', {
		      url: '/:serviceId/view',
		      templateUrl: 'app/services/view.html',
		      controller: 'ServicesCtrl',
		      authenticate: true/*,
	      role: ['STAFF', 'CUSTOMER', 'ENGINEER', 'MANAGER']*/
		})
		// sub menu
		 .state('app.services.Requestlist', {
	      url: '/request',
	      templateUrl: 'app/services/request.html',
	      controller: 'ServicesCtrl',
	      authenticate: true/*,
	      role: ['STAFF', 'CUSTOMER', 'ENGINEER', 'MANAGER']*/
	    })

		.state('app.services.Schedulelist', {
	      url: '/schedule',
	      templateUrl: 'app/services/scheduled.html',
	      controller: 'ServicesCtrl',
	      authenticate: true/*,
	      role: ['STAFF' , 'ENGINEER', 'MANAGER']*/
	    })

	    .state('app.services.Pendinglist', {
	      url: '/pending',
	      templateUrl: 'app/services/pending.html',
	      controller: 'ServicesCtrl',
	      authenticate: true/*,
	      role: ['CUSTOMER', 'MANAGER' , 'STAFF']*/
	    })
	     .state('app.services.Completedlist', {
	      url: '/completed',
	      templateUrl: 'app/services/completed.html',
	      controller: 'ServicesCtrl',
	      authenticate: true/*,
	      role: ['MANAGER' , 'CUSTOMER' , 'STAFF']*/
	    });
});

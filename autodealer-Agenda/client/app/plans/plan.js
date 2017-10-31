'use strict';

angular.module('autodealerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.plans', {
        url: '/plans',
        template: '<ui-view/>',
        controller: function($state) {
	    	  if($state.is('app.plans')) {
	    		  $state.go('.list');
	    	  }
	      }
      })
      .state('app.plans.list', {
	      url: '/',
	      templateUrl: 'app/plans/plans.html',
	      controller: 'PlansCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
	    })
      .state('app.plans.create', {
		      url: '/create',
		      templateUrl: 'app/plans/create_plan.html',
		      controller: 'PlansCtrl',
		      authenticate: true,
		      role: 'SUPER_ADMIN'
		})
		.state('app.plans.edit', {
		      url: '/:planId/edit',
		      templateUrl: 'app/plans/edit_plan.html',
		      controller: 'PlansCtrl',
		      authenticate: true,
		      role: 'SUPER_ADMIN'
		});
  });
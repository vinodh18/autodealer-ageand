        'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.dealers', {
	      url: '/dealers',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.dealers.list', {
	      url: '/',
	      templateUrl: 'app/dealers/dealers.html',
	      controller: 'DealersCtrl',
	      authenticate: true
	    })
	   /* .state('app.dealers.create', {
		      url: '/create',
		      templateUrl: 'app/dealers/create_dealers.html',
		      controller: 'DealersCtrl',
		      authenticate: true
		})*/
		.state('app.dealers.edit', {
		      url: '/:dealerId/edit',
		      templateUrl: 'app/dealers/edit_dealers.html',
		      controller: 'DealersCtrl',
		      authenticate: true,		   
	      	  role: 'DEALER_ADMIN'
		});
		/*.state('app.dealers.view', {
		      url: '/:dealerId/view',
		      templateUrl: 'app/dealers/view.html',
		      controller: 'DealersCtrl',
		      authenticate: true
		});*/
});

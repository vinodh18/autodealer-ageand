 'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.users', {
	      url: '/users',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.users.list', {
	      url: '/',
	      templateUrl: 'app/users/users.html',
	      controller: 'UsersCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
	    })
	    .state('app.users.create', {
		      url: '/create',
		      templateUrl: 'app/users/create_user.html',
		      controller: 'UsersCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN']
		})
		.state('app.users.edit', {
		      url: '/:userId/edit',
		      templateUrl: 'app/users/edit_user.html',
		      controller: 'UsersCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN']
		});
});

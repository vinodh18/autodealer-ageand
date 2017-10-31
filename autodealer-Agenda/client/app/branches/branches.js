    'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.branches', {
	      url: '/branches',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.branches.list', {
	      url: '/',
	      templateUrl: 'app/branches/branches.html',
	      controller: 'BranchesCtrl',
	      authenticate: true
	    })
	    .state('app.branches.create', {
		      url: '/create',
		      templateUrl: 'app/branches/create_branch.html',
		      controller: 'BranchesCtrl',
		      authenticate: true/*,
		      role: ['MANAGER', 'SALES']*/
		})
		.state('app.branches.edit', {
		      url: '/:branchId/edit',
		      templateUrl: 'app/branches/edit_branch.html',
		      controller: 'BranchesCtrl',
		      authenticate: true/*,
		      role: ['MANAGER', 'SALES']*/
		})
		.state('app.branches.view', {
		      url: '/:branchId/view',
		      templateUrl: 'app/branches/view.html',
		      controller: 'BranchesCtrl',
		      authenticate: true/*,
		      role: ['STAFF', 'ENGINEER',  'CUSTOMER']*/
		});
});

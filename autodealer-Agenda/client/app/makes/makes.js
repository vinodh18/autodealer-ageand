          'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.makes', {
	      url: '/makes',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.makes.list', {
	      url: '/',
	      templateUrl: 'app/makes/makes.html',
	      controller: 'MakesCtrl',
	      authenticate: true/*,
	      role: ['MANAGER', 'SALES']*/
	    })
	    .state('app.makes.create', {
		      url: '/create',
		      templateUrl: 'app/makes/create_make.html',
		      controller: 'MakesCtrl',
		      authenticate: true/*,
	      role: ['MANAGER', 'SALES']*/
		})
		.state('app.makes.edit', {
		      url: '/:makeId/edit',
		      templateUrl: 'app/makes/edit_make.html',
		      controller: 'MakesCtrl',
		      authenticate: true/*,
	      role: ['MANAGER', 'SALES']*/
		});
});

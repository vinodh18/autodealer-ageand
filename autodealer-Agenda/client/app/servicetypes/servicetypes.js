        'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.servicetypes', {
	      url: '/service-types',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.servicetypes.list', {
	      url: '/',
	      templateUrl: 'app/servicetypes/servicetypes.html',
	      controller: 'ServicetypesCtrl',
	      authenticate: true/*,
	      role: ['MANAGER', 'STAFF', 'ENGINEER', 'CUSTOMER']*/
	    })
	    .state('app.servicetypes.create', {
		      url: '/create',
		      templateUrl: 'app/servicetypes/create_servicetype.html',
		      controller: 'ServicetypesCtrl',
		      authenticate: true/*,
		      role: ['MANAGER', 'STAFF']*/
		})
		.state('app.servicetypes.edit', {
		      url: '/:servicetypeId/edit',
		      templateUrl: 'app/servicetypes/edit_servicetype.html',
		      controller: 'ServicetypesCtrl',
		      authenticate: true/*,
		      role: ['MANAGER', 'STAFF']*/
		})
		.state('app.servicetypes.view', {
		      url: '/:servicetypeId/view',
		      templateUrl: 'app/servicetypes/view.html',
		      controller: 'ServicetypesCtrl',
		      authenticate: true/*,
		      role: ['ENGINEER', 'CUSTOMER']*/
		});
});

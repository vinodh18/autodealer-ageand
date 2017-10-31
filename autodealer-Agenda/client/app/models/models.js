            'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.models', {
	      url: '/models',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.models.list', {
	      url: '/',
	      templateUrl: 'app/models/models.html',
	      controller: 'ModelsCtrl',
	      authenticate: true
	    })
	    .state('app.models.create', {
		      url: '/create',
		      templateUrl: 'app/models/create_model.html',
		      controller: 'ModelsCtrl',
		      authenticate: true/*,
		      role: ['MANAGER', 'SALES']*/
		})
		.state('app.models.edit', {
		      url: '/:modelId/edit',
		      templateUrl: 'app/models/edit_model.html',
		      controller: 'ModelsCtrl',
		      authenticate: true/*,
		      role: ['MANAGER', 'SALES']*/
		});
});

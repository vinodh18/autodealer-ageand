/*'use strict';

angular.module('autodealerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('accessories', {
        url: '/accessories',
        templateUrl: 'app/accessories/accessories.html',
        controller: 'AccessoriesCtrl'
      });
  });*/

 'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.accessories', {
	      url: '/accessories',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.accessories.list', {
	      	url: '/',
	      	templateUrl: 'app/accessories/accessories.html',
	      	controller: 'AccessoriesCtrl',
	      	authenticate: true,
	      	role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.accessories.create', {
		    url: '/create',
		    templateUrl: 'app/accessories/create_accessories.html',
		    controller: 'AccessoriesCtrl',
		    authenticate: true,
		    role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})
		.state('app.accessories.edit', {
		    url: '/:accessoriesId/edit',
	      	templateUrl: 'app/accessories/edit_accessories.html',
	      	controller: 'AccessoriesCtrl',
	      	authenticate: true,
	      	role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN']
		});
});

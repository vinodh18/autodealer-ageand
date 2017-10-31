/*'use strict';

angular.module('autodealerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('devicetokens', {
        url: '/devicetokens',
        templateUrl: 'app/devicetokens/devicetokens.html',
        controller: 'DevicetokensCtrl'
      });
  });*/

  'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.devicetokens', {
	      url: '/devicetokens',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.devicetokens.list', {
	      url: '/',
	      templateUrl: 'app/devicetokens/devicetokens.html',
	      controller: 'DevicetokensCtrl',
	      authenticate: true/*,
	      role: ['MANAGER', 'SALES']*/
	    })
	    .state('app.devicetokens.create', {
		      url: '/create',
		      templateUrl: 'app/devicetokens/create_devicetoken.html',
		      controller: 'DevicetokensCtrl',
		      authenticate: true/*,
	    	  role: ['MANAGER', 'SALES']*/
		})
		.state('app.devicetokens.edit', {
		      url: '/:devicetokenId/edit',
		      templateUrl: 'app/devicetokens/edit_devicetoken.html',
		      controller: 'DevicetokensCtrl',
		      authenticate: true/*,
	      role: ['MANAGER', 'SALES']*/
		})
		.state('app.devicetokens.view', {
		      url: '/:devicetokenId/view',
		      templateUrl: 'app/devicetokens/view_devicetoken.html',
		      controller: 'DevicetokensCtrl',
		      authenticate: true/*,
	    	  role: ['MANAGER', 'SALES']*/
		});
});

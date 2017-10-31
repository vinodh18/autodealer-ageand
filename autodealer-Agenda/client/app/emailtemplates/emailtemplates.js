'use strict';

angular.module('autodealerApp')
  .config(function ($stateProvider) {
    /*$stateProvider
      .state('emailtemplates', {
        url: '/emailtemplates',
        templateUrl: 'app/emailtemplates/emailtemplates.html',
        controller: 'EmailtemplatesCtrl'
      });*/

   $stateProvider
	  	.state('app.emailtemplates', {
	      url: '/emailtemplates',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.emailtemplates.list', {
	      url: '/',
	      templateUrl: 'app/emailtemplates/emailtemplates.html',
	      controller: 'EmailtemplatesCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.emailtemplates.create', {
		      url: '/create',
		      templateUrl: 'app/emailtemplates/create_emailTemplate.html',
		      controller: 'EmailtemplatesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
		})
		.state('app.emailtemplates.edit', {
		      url: '/:emailTemplateId/edit',
		      templateUrl: 'app/emailtemplates/edit_emailTemplate.html',
		      controller: 'EmailtemplatesCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN']
		});
  });
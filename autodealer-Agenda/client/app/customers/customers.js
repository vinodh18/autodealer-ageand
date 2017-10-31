  'use strict'; 

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  	.state('app.customers', {
	      url: '/customers',
	      template: '<ui-view/>',
	      abstract: true,
	    })
	    .state('app.customers.list', {
	      url: '/',
	      templateUrl: 'app/customers/customers.html',
	      controller: 'CustomersCtrl',
	      authenticate: true,
	      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF', 'CUSTOMER']
	    })
	    .state('app.customers.create', {
		      url: '/create',
		      templateUrl: 'app/customers/create_customer.html',		      
		      /*resolve: {
		        validateCustomerLimit: function(Auth, Restangular, $q) {
		        	console.log('customer state create');
		        	var def = $q.defer();
					var baseValidateCustomerLimit = Restangular.one('plans/limit/customer');
					return baseValidateCustomerLimit.get().then(function(data){
						console.log('data', data);	
						//def.resolve(data);					
						return true;
					}, function(err){
						console.log('err',err);
						//def.resolve(err);						
						return false;
					});
					return def.promise;
		        }		           		  
		      },*/
		      controller: 'CustomersCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN']
		})
		.state('app.customers.edit', {
		      url: '/:customerId/edit',
		      templateUrl: 'app/customers/edit_customer.html',
		      controller: 'CustomersCtrl',
		      authenticate: true,
		      role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN']
		});
});

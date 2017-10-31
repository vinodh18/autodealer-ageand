'use strict'; 

angular.module('autodealerApp')
		.controller('CustomersCtrl', function($scope, $state, Restangular, dialogs, $stateParams, Auth) {				
		//console.log("validateCustomerLimit", $scope.validateCustomerLimit);
		$scope.init = function() {						
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
		};
		
		$scope.initCustomers = function(){
			$scope.init();

			$scope.filterOptions = {
				filterText : "",
				useExternalFilter : true
			};
			$scope.currentPage = 1;
			$scope.numPerPage = 20;
			$scope.maxPages = 4;

			var baseCustomers = Restangular.all('customers');
				baseCustomers.getList().then(function(customers){
					
				$scope.customers = customers;
				$scope.totalCustomers = customers.total;
				
				$scope.$watch('currentPage + numPerPage', function(){
					if($scope.currentPage > 0){
						var filters = {};
						$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
						filters.offset = $scope.offset;
						filters.limit = $scope.numPerPage;

						var baseCustomers = Restangular.all('customers');
						baseCustomers.getList(filters).then(function(customers){
							$scope.customers = customers;
							return customers;
						})
					}
				})
			})
		};
									
		$scope.initCreateCustomer = function() {
			console.log("validateCustomerLimit Create", $scope.validateCustomerLimit);			
			$scope.init();
			$scope.customer = {};
			$scope.access = true;
			$scope.LimitExceeds = false;
			
			// Begin of checkLimit Exceeds
			var planLimit = Auth.getCurrentUser().dealer.plan.plan_limits;			
			var baseCustomers = Restangular.all('customers');
			baseCustomers.getList().then(function(customers){				
				if(customers.total < planLimit.customers){
					$scope.LimitExceeds = false;
				}else{
					$scope.LimitExceeds = true;
					$scope.alerts.push({type: 'danger',msg: 'Plan Limit Exceeds To Create New Customer'});
				}	
			});			
			// End of checkLimit Exceeds
			
			$scope.customer.phone = [];
			$scope.add = 0;			

			$scope.addNewPhone = function() {
				$scope.customer.phone.push("");
				$scope.add++;
			};
			$scope.deletePhone = function(index) {					
					$scope.customer.phone.splice(index, 1);												
			};

			// initialize with one empty phone input box
			$scope.addNewPhone();

			$scope.addCustomer = function() {
				var baseUsers = Restangular.all('customers');								
				baseUsers.post($scope.customer).then(function(data) {
					$scope.data = data;					
					if (data.meta.status == 201) {						
						$scope.alerts = [];
						$scope.alerts.push({type: 'success',
								msg: data.meta.msg});
						
						} else {
							$scope.alerts = [];
							$scope.alerts.push({type: 'danger',
								msg: data.meta.msg});
						}
				}, function(response) {					
					$scope.alerts = [];
					$scope.alerts.push({type: 'danger',
						msg: "Unable to add!"});
				});
										
			};
		};


						
		$scope.initEditCustomer = function() {			
			var customerId = $stateParams.customerId;
			$scope.init();
			$scope.access = false;
			$scope.getCustomer = function(customerId) {
				var baseCustomer = Restangular.one('customers', customerId);
				baseCustomer.get().then(function(customer){
					console.log('customer', customer);
					$scope.customer = customer;
				},function(rsp) {
					console.log(rsp);
				});
			};

			$scope.addNewPhone = function() {
				$scope.customer.phone.push("");
				$scope.add++;
			};
			$scope.deletePhone = function(index) {					
				$scope.customer.phone.splice(index, 1);												
			};

			$scope.updateCustomer = function() {
				var editUser = Restangular.copy($scope.customer);				
				editUser.put().then(function(data) {					
					$scope.data = data;
					if (data.meta.status == 200) {
							$scope.alerts = [];
							$scope.alerts.push({
								type : 'success',
								msg : data.meta.msg
							});
					} else {
						$scope.alerts = [];
						$scope.alerts.push({
							type : 'danger',
							msg : data.meta.msg
						});
					}
				}, function(response) {
					console.log(response);
					$scope.alerts = [];
					$scope.alerts.push({type: 'danger',
						msg: "Unable to update!"});
				});
			};

			$scope.getCustomer(customerId);
				
		};


		$scope.deleteCustomer = function(row){
			var id = row;			
			dialogs.confirm('Confirm', 'Are you sure you want to delete?').result
			.then(function(btn){
				console.log('yes');
				var baseCustomer = Restangular.one('customers', id);
				baseCustomer.remove().then(function(rsp){
					if(rsp.meta.status == 200){
						$scope.alerts = [];
						$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
						$scope.initCustomers();
					}else{
						$scope.alerts = [];
						$scope.alerts.push({type: 'danger', msg: rsp.meta.msg});
					}
				});
			});
		};


		$scope.initAllUsers = function(role) {
			$scope.init();
			console.log("role", role);
			var baseusers = Restangular.all('users/all');
			return baseusers.getList({role: role}).then(function(users) {
				console.log("users list", users);
				$scope.allUsers = users;
				return users;
			});
		};

	
				
		$scope.initAllBranches = function() {
			$scope.init();
			var baseBranches = Restangular.all('dealers/branches/all');
			return baseBranches.getList().then(function(branches) {				
				$scope.allBranches = branches;
				return branches;
			});
		};


				
		$scope.initAllDealers = function() {
			$scope.init();
			var basedealers = Restangular.all('dealers/all');
			return basedealers.getList({
				dealer : $scope.dealer
			}).then(function(dealers) {
				console.log("dealer list", dealers);
				$scope.allDealers = dealers;
				return dealers;
			});
		};
});
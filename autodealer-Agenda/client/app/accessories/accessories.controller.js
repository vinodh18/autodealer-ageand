'use strict';

angular.module('autodealerApp')
  .controller('AccessoriesCtrl', function ($scope, Restangular, $stateParams, Auth, dialogs) {
				$scope.init = function() {					
					$scope.alerts = [];
					$scope.closeAlert = function(index) {
						$scope.alerts.splice(index, 1);
					};
				};

		if(Auth.isBranchAdmin() || Auth.isStaff() || Auth.isCustomer()){
			$scope.deleteAction = false;
		}else{
			$scope.deleteAction = true;
		}		
    	
    	$scope.initAccessories = function(){
    		$scope.init();
    			$scope.filterOptions = {
					filterText : "",
					useExternalFilter : true
				};

				$scope.currentPage = 1;
				$scope.numPerPage = 20;
				$scope.maxPages = 4;

				var baseaccessories = Restangular.all('accessories');
				baseaccessories.getList().then(function(accessories){
					$scope.accessories = accessories;
					$scope.totalAccessories = $scope.accessories.length;

					$scope.$watch('currentPage + numPerPage', function(){
						if($scope.currentPage > 0){
							var filters = {};
							$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
							filters.offset = $scope.offset;
							filters.limit = $scope.numPerPage;
							var baseaccessories = Restangular.all('accessories');
							baseaccessories.getList(filters).then(function(accessories){
								$scope.accessories = accessories;
								return accessories;
							})
						}
					})

				})
    		}

    			// single delete
			$scope.deleteAccessories = function(row){
				var id = row;
				console.log("id", row);
				dialogs.confirm('Confirm', 'Are you want to delete?').result
				.then(function(btn){
					console.log('yes');
					var accessories = Restangular.one('accessories', id);
					accessories.remove().then(function(rsp){
						if(rsp.meta.status == 200){
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
							$scope.initAccessories();
						}else{
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
						}
					});
				});
			}

			// Branch dropdown

			$scope.initAllBranches = function() {
				$scope.init();
				var baseAllBranches = Restangular.all('dealers/branches/all');
				return baseAllBranches.getList().then(function(branches) {					
					$scope.allBranches = branches;
					return branches;
				});
			  };

			   // create function

				$scope.initcreateAccessories = function(){
					$scope.init();
					$scope.accessories = {};
					$scope.index = 0;
					$scope.accessories.rates = [];

						$scope.addNewRates = function() {
							$scope.accessories.rates.push({});
							$scope.index++;
						};
						$scope.deleteRates = function(index){
							$scope.accessories.rates.splice(index, 1);
						}

					$scope.addAccessories = function(){
						var baseAccessories = Restangular.all('accessories');
						baseAccessories.post($scope.accessories).then(function(data){
							$scope.data = data;
							if(data.meta.status == 201){
								$scope.alerts = [];
								$scope.alerts.push({type:'success', msg: data.meta.msg});
							}else{
								$scope.alerts = [];
								$scope.alerts.push({type:'danger', msg: data.meta.msg});
							}
						}, function(response){
							$scope.alerts = [];
								$scope.alerts.push({type:'danger', msg: "Unable to add!"});
						});
					}
					$scope.addNewRates();
				}

				// Edit function
				$scope.initEditAccessories = function() {
					$scope.init();
					console.log("accessorieId :", $stateParams);
					var accessorieId = $stateParams.accessoriesId;
					
							
						/*$scope.index = 0;
						$scope.labourcharge.rates = [];*/

						$scope.addNewRates = function() {
							$scope.accessories.rates.push({});
							$scope.index++;
						};
						$scope.deleteRates = function(index){
							$scope.accessories.rates.splice(index, 1);
						}					
						
						$scope.getAccessories = function(accessorieId) {
						var baseAccessories = Restangular.one('accessories', accessorieId);
						 baseAccessories.get().then(
								function(accessories){
									/*console.log("customer", customer);*/
									$scope.accessories = accessories;
								}, function(rsp) {
									console.log(rsp);
								});
						};
//							update updateLabourCharge
							$scope.updateAccessories = function() {
							var editAccessories = Restangular.copy($scope.accessories);
							
							editAccessories.put().then(
									function(data) {
										console.log("data...", data);
										$scope.data = data;
//											$scope.status = data.meta.status + ": " + data.meta.msg;

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
						$scope.getAccessories(accessorieId);
					};
  });

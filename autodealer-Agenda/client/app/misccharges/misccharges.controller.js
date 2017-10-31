'use strict';

angular.module('autodealerApp')
  .controller('MiscchargesCtrl', function ($scope, Restangular, $stateParams, Auth, dialogs) {
    		
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

				$scope.initmiscCharge = function(){
					$scope.init();
					
					$scope.filterOptions = {
						filterText : "",
						useExternalFilter : true
					};

					$scope.currentPage = 1;
					$scope.numPerPage = 20;
					$scope.maxPages = 4;

					var basemiscCharge = Restangular.all('misc-charges');
					basemiscCharge.getList().then(function(misccharge){
						$scope.misccharge = misccharge;
						$scope.totalMisc = $scope.misccharge.length;

						$scope.$watch('currentPage + numPerPage', function(){
							if($scope.currentPage > 0){
								var filters = {};
								$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
								filters.offset = $scope.offset;
								filters.limit = $scope.numPerPage;
								var misccharge = Restangular.all('misc-charges');
								misccharge.getList(filters).then(function(misccharge){
									$scope.misccharge = misccharge;
									return misccharge;
								})
							}
						})

					})
				}

				// single delete
			$scope.deleteMisc = function(row){
				var id = row;
				console.log("id", row);
				dialogs.confirm('Confirm', 'Are you want to delete?').result
				.then(function(btn){
					console.log('yes');
					var misccharge = Restangular.one('misc-charges', id);
					misccharge.remove().then(function(rsp){
						if(rsp.meta.status == 200){
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
							$scope.initmiscCharge();
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

				$scope.initcreateMiscCharge = function(){
					$scope.init();
					$scope.misccharge = {};
					$scope.index = 0;
					$scope.misccharge.rates = [];

						$scope.addNewRates = function() {
							$scope.misccharge.rates.push({});
							$scope.index++;
						};
						$scope.deleteRates = function(index){
							$scope.misccharge.rates.splice(index, 1);
						}

					$scope.addmiscCharge = function(){
						var basemisccharge = Restangular.all('misc-charges');
						basemisccharge.post($scope.misccharge).then(function(data){
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
				$scope.initEditMiscCharge = function() {
					$scope.init();
					var miscId = $stateParams.miscchargeId;
					console.log("miscId :", miscId);
							
						/*$scope.index = 0;
						$scope.labourcharge.rates = [];*/

						$scope.addNewRates = function() {
							$scope.misccharge.rates.push({});
							$scope.index++;
						};
						$scope.deleteRates = function(index){
							$scope.misccharge.rates.splice(index, 1);
						}					
						
						$scope.getMiscCharge = function(miscId) {
						var basemiscCharge = Restangular.one('misc-charges', miscId);
						 basemiscCharge.get().then(
								function(misccharge){
									/*console.log("customer", customer);*/
									$scope.misccharge = misccharge;
								}, function(rsp) {
									console.log(rsp);
								});
						};
//							update updateLabourCharge
							$scope.updateMiscCharge = function() {
							var editMisccharge = Restangular.copy($scope.misccharge);
							
							editMisccharge.put().then(
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
						$scope.getMiscCharge(miscId);
					};

  });

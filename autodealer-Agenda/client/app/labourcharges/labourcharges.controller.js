'use strict';

angular.module('autodealerApp')
  .controller('LabourchargesCtrl', function ($scope, Restangular, Auth, $stateParams, dialogs) {
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
					
				$scope.initlabourCharges = function(){
					$scope.init();

					$scope.filterOptions = {
						filterText : "",
						useExternalFilter : true
					};
					
					$scope.currentPage = 1;
					$scope.numPerPage = 20;
					$scope.maxPages = 4;

					var baselabourcharge = Restangular.all('labour-charges');
						baselabourcharge.getList().then(function(labourcharges){
						$scope.labourcharges = labourcharges;
						$scope.totalLabourCharges = $scope.labourcharges.length;

						$scope.$watch('currentPage + numPerPage', function(){
							if($scope.currentPage > 0){
								var filters = {};
								$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
								filters.offset = $scope.offset;
								filters.limit = $scope.numPerPage;

								var baselabourcharges = Restangular.all('labour-charges');
								baselabourcharges.getList(filters).then(function(labourcharges){
									$scope.labourcharges = labourcharges;
									return labourcharges;
								});
							}
						});
					});
				}

				// single delete
			$scope.deleteLabourCharge = function(row){
				var id = row;
				console.log("id", row);
				dialogs.confirm('Confirm', 'Are you want to delete?').result
				.then(function(btn){
					console.log('yes');
					var offers = Restangular.one('labour-charges', id);
					offers.remove().then(function(rsp){
						if(rsp.meta.status == 200){
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
							$scope.initlabourCharges();
						}else{
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
						}
					});
				});
			}
				// create function

				$scope.initcreateLabourCharge = function(){
					$scope.init();
					$scope.labourcharge = {};
					$scope.index = 0;
					$scope.labourcharge.rates = [];

						$scope.addNewRates = function() {
							$scope.labourcharge.rates.push({});
							$scope.index++;
						};
						$scope.deleteRates = function(index){
							$scope.labourcharge.rates.splice(index, 1);
						}

					$scope.addlaburCharge = function(){
						var baselabourcharge = Restangular.all('labour-charges');
						baselabourcharge.post($scope.labourcharge).then(function(data){
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
				$scope.initEditLabourCharge = function() {
					$scope.init();
					var labourId = $stateParams.labourchargeId;
					console.log("labourId :", labourId);
							
						/*$scope.index = 0;
						$scope.labourcharge.rates = [];*/

						$scope.addNewRates = function() {
							$scope.labourcharge.rates.push({});
							$scope.index++;
						};
						$scope.deleteRates = function(index){
							$scope.labourcharge.rates.splice(index, 1);
						}					
						
						$scope.getLabourCharge = function(labourId) {
						var baselabourCharge = Restangular.one('labour-charges', labourId);
						 baselabourCharge.get().then(
								function(labourcharge){
									/*console.log("customer", customer);*/
									$scope.labourcharge = labourcharge;
								}, function(rsp) {
									console.log(rsp);
								});
						};
//							update updateLabourCharge
							$scope.updateLabourCharge = function() {
							var editLabourcharge = Restangular.copy($scope.labourcharge);
							
							editLabourcharge.put().then(
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
						$scope.getLabourCharge(labourId);
					};

				// branch drop down
				$scope.initAllBranches = function() {
					$scope.init();
					var baseAllBranches = Restangular.all('dealers/branches/all');
					return baseAllBranches.getList().then(function(branches) {					
						$scope.allBranches = branches;
						return branches;
					});
				  };
  });


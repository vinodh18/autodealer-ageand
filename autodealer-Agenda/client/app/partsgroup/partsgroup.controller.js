'use strict';

angular.module('autodealerApp')
  .controller('PartsgroupCtrl', function ($scope, Restangular, Auth, $stateParams, dialogs) {
    	
    		$scope.init = function() {
    			$scope.params = {};
					/*$scope.access = Auth.isManager();
					$scope.accessSales = Auth.isSales();
					$scope.customer = Auth.isCustomer();
					$scope.staff = Auth.isStaff();
					$scope.engineer = Auth.isEngineer();*/
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

		$scope.getList = function(){
			$scope.initViewPartgroup($scope.params);
		}
		$scope.reset = function(){
			$scope.params = "";
			$scope.initViewPartgroup($scope.params);
		}

		$scope.initPartsgroup = function(){
    		$scope.init();
    			$scope.filterOptions = {
					filterText : "",
					useExternalFilter : true
				};
			$scope.initViewPartgroup = function(){
				$scope.currentPage = 1;
				$scope.numPerPage = 20;
				$scope.maxPages = 4;

				var basePartsgroup = Restangular.all('parts-groups');
				basePartsgroup.getList($scope.params).then(function(partsgroup){
					$scope.partsgroup = partsgroup;
					$scope.totalpartsgroup = $scope.partsgroup.length;

					$scope.$watch('currentPage + numPerPage', function(){
						if($scope.currentPage > 0){
							var filters = {};
							$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
							filters.offset = $scope.offset;
							filters.limit = $scope.numPerPage;
							$scope.params.offset = filters.offset;
							$scope.params.limit = filters.limit;
							var basePartsgroup = Restangular.all('parts-groups');
							basePartsgroup.getList($scope.params).then(function(partsgroup){
								$scope.partsgroups = partsgroup;
								return partsgroup;
							});
						}
					});

				});
			  }
    		}

    			// single delete
			$scope.deletePartsgroup = function(row){
				var id = row;
				console.log("id", row);
				dialogs.confirm('Confirm', 'Are you want to delete?').result
				.then(function(btn){
					console.log('yes');
					var basepartsgroup = Restangular.one('parts-groups', id);
					basepartsgroup.remove().then(function(rsp){
						if(rsp.meta.status == 200){
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
							$scope.initViewPartgroup();
						}else{
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
						}
					});
				});
			}

			// create function

				$scope.initcreatePartsgroup = function(){
					$scope.init();
					$scope.partsgroup = {};
					
					$scope.addpartsgroup = function(){
						var basePartsgroup = Restangular.all('parts-groups');
						basePartsgroup.post($scope.partsgroup).then(function(data){
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
				}

				// Edit function
				$scope.initEditPartsgroup = function() {
					$scope.init();
					
					var partsgroupId = $stateParams.partsgroupId;
						/*$scope.index = 0;
						$scope.labourcharge.rates = [];*/

						
						$scope.getPartsgroup = function(partsgroupId) {
						var basePartsgroup = Restangular.one('parts-groups', partsgroupId);
						 basePartsgroup.get().then(
								function(partsgroup){
									/*console.log("customer", customer);*/
									$scope.partsgroup = partsgroup;
								}, function(rsp) {
									console.log(rsp);
								});
						};
//							update updatePartsgroup
							$scope.updatePartsgroup = function() {
							var editPartsgroup = Restangular.copy($scope.partsgroup);
							
							editPartsgroup.put().then(
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
						$scope.getPartsgroup(partsgroupId);
					};
  });

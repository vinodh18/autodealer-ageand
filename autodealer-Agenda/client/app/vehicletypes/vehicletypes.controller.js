'use strict'; 

angular.module('autodealerApp')
		.controller('VehicletypesCtrl',
				function($scope, Restangular, dialogs, $stateParams, Auth) {

					$scope.init = function() {		
						$scope.params = {};				
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
			console.log($scope.params);
			$scope.initVehiclesTypes($scope.params);
		}

		$scope.reset = function(){
		$scope.params = "";
		$scope.initVehiclesTypes($scope.params);
		}

		$scope.initVehicletypes = function(){
			$scope.init();

			$scope.filterOptions = {
				filterText : "",
				useExternalFilter : true
			};
			$scope.initVehiclesTypes = function(){
				$scope.currentPage = 1;
				$scope.numPerPage = 20;
				$scope.maxPages = 4;

				var baseVehicletypes = Restangular.all('vehicle-types');
				baseVehicletypes.getList().then(function(vehicletypes){
					
				$scope.vehicletype = vehicletypes;
				$scope.totalVehcileTypes = $scope.vehicletype.length;
				
				$scope.$watch('currentPage + numPerPage', function(){
					if($scope.currentPage > 0){
						var filters = {};
						$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
						filters.offset = $scope.offset;
						filters.limit = $scope.numPerPage;
						$scope.params.offset = filters.offset;
						$scope.params.limit = filters.limit;

						var baseVehicletype = Restangular.all('vehicle-types');
						baseVehicletype.getList($scope.params).then(function(vehicletypes){
							$scope.vehicletypes = vehicletypes;
							return vehicletypes;
						})
					}
				})
			})
		}
}
		$scope.deleteVehicleType = function(row){
			var id = row;
			console.log("id", id);
			dialogs.confirm('Confirm', 'Are you sure you want to delete?').result
			.then(function(btn){
				console.log('yes');
				var baseVehicletype = Restangular.one('vehicle-types', id);
				baseVehicletype.remove().then(function(rsp){
					if(rsp.meta.status == 200){
						$scope.alerts = [];
						$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
						$scope.initVehiclesTypes();
					}else{
						$scope.alerts = [];
						$scope.alerts.push({type: 'danger', msg: rsp.meta.msg});
					}
				});
			});
		}
		
		/*
					$scope.initVehicletypes = function() {
						$scope.init();

						$scope.filterOptions = {
							filterText : "",
							useExternalFilter : true
						};
						$scope.getList = function() {
						 $scope.getVehicletypesPagedDataAsync($scope.params);
						};

						$scope.totalServerItems = 0;

						$scope.pagingOptions = {
							pageSizes : [ 15, 25, 50 ],
							pageSize : 15,
							currentPage : 1
						};
						
						$scope.maxPages = function() {
							return parseInt(Math.ceil($scope.totalServerItems / $scope.pagingOptions.pageSize));
						};
						
						$scope.validateCurrentPage = function() {
							if($scope.pagingOptions.currentPage > $scope.maxPages()) {
								$scope.pagingOptions.currentPage = $scope.maxPages();
							}
							if($scope.pagingOptions.currentPage < 1) {
								$scope.pagingOptions.currentPage = 1;
							}
							$scope.pagingOptions.currentPage = parseInt($scope.pagingOptions.currentPage);
								
						};
						$scope.$watch('totalServerItems', function(newVal, oldVal) {
							if(newVal !== oldVal) {
								$scope.validateCurrentPage();
							}
						}, true);
						
						$scope.$watch('pagingOptions', function(newVal, oldVal) {
								if(newVal.currentPage !== oldVal.currentPage) {
									$scope.validateCurrentPage();
								}
								
								$scope.getVehicletypesPagedDataAsync($scope.params);
							}, true);

						$scope.mySelection = [];

						$scope.gridOptions = {
							data : 'vehicletypes',
							enablePaging : true,
							showFooter : true,
							totalServerItems : 'totalServerItems',
							pagingOptions : $scope.pagingOptions,
							filterOptions : $scope.filterOptions,
							selectedItems : $scope.mySelection,
							keepLastSelected: false,
							multiSelect: Auth.isManager(),
							selectWithCheckboxOnly :Auth.isManager(),
							showSelectionCheckbox :Auth.isManager(),
							
						};
						if(Auth.isManager()){
						$scope.gridOptions.columnDefs = [
								{
									field : 'name',
									displayName : 'Name'
								},
								{
									field : '',
									displayName : 'Actions',
									sortable : false,
									cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
											+ '<a href="javascript:void(0)"  ui-sref="^.edit({vehicletypeId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a>'
											+ '<a href="javascript:void(0)"'
											+ ' ng-click="deleteRow(row)"  data-toggle="tooltip" title=""'
											+ ' class="btn btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'
								} ];
						}else if(Auth.isSales()){						
							$scope.gridOptions.columnDefs = [
								{
									field : 'name',
									displayName : 'Name'
								},{
									field : '',
									displayName : 'Actions',
									sortable : false,
									cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
											+ '<a href="javascript:void(0)" ui-sref="^.edit({vehicletypeId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a></div></div>'
								}];
						}else if(Auth.isCustomer()){						
							$scope.gridOptions.columnDefs = [
								{
									field : 'name',
									displayName : 'Name'
								}];
						}
						
//						delete function
						
						$scope.deleteRow = function(row) {
							console.log(row.entity);
							dialogs.confirm('Confirm',
									'Are you sure you want to delete?').result
									.then(function(btn) {
										console.log('yes');
										var vehicletypeToDelete = row.entity;
										vehicletypeToDelete.remove({
											
										}).then(function(rsp) {
											// var index =
											// $scope.customers.indexOf(customerToDelete);
											console.log(rsp);
											// remove from scope customers so
											// that table is updated
											
											if (rsp.meta.status == 200) {
												$scope.alerts = [];
												$scope.alerts.push({type: 'success',
														msg: rsp.meta.msg});
												
												$scope.loadVehicletypesTable();
											} else {
												// display error msg
												// rsp.meta.msg
												$scope.alerts = [];
												$scope.alerts.push({type: 'danger',
													msg: rsp.meta.msg});
											}

										});
									}, function(btn) {
										console.log('no');
									});
							// row.entity.$deleteData({ testId:
							// row.entity.testId });
						};
						
		//			multiple deletions
						
						$scope.multiDelete = function(){
						if($scope.mySelection.length >= 1){
						dialogs.confirm('Confirm',
						'Are you sure you want to delete?').result
						.then(function(btn) {
							$scope.init();
							$scope.mySelectionIds = [];
							for(var i=0; i < $scope.mySelection.length; i++){
								$scope.mySelectionIds[i] = $scope.mySelection[i]._id;
							}
							var baseVehicletypes = Restangular.all('vehicle-types');
							baseVehicletypes.customDELETE('', '', {'Content-Type': 'application/json'},
									{ids: $scope.mySelectionIds}).then(function(data) {
							    $scope.data = data;
							    $scope.status = data.meta.status + ": " + data.meta.msg;    
					    		
							    if (data.meta.status == 200) {
								    $scope.alerts = [];
							    	$scope.alerts.push({type: 'success',
										msg: data.meta.msg});
							    	$scope.loadVehicletypesTable();
							    	$scope.gridOptions.selectAll(false);
							    } else {
							    	$scope.alerts = [];
							    	$scope.alerts.push({type: 'danger',
										msg: data.meta.msg});
							    }						
							  }, function(response) {
							    console.log(response);
							    $scope.alerts = [];
							    $scope.alerts.push({type: 'danger',
									msg: "Unable to delete!"});
							  });
							},
							function(btn) {
								console.log('no');
							});
						}else{
						$scope.alerts = [];
						$scope.alerts.push({type: 'danger',
									msg: "Select Vehicletypes to delete"});
					}
				};
					
//				get customer in index page
						
						$scope.getVehicletypesPagedDataAsync = function(filters) {
							var pageSize = $scope.pagingOptions.pageSize;
							var page = $scope.pagingOptions.currentPage;
							var offset = (page - 1) * pageSize;
							var limit = $scope.pagingOptions.pageSize;
							$scope.getVehicletypes(filters, offset, limit).then(
									function(vehicletypes) {
										$scope.setPagingData(vehicletypes, page,
												pageSize, vehicletypes.total);
									});
						};

						$scope.getVehicletypes = function(filters, offset, limit) {
							var baseVehicletypes = Restangular.all('vehicle-types');
							filters = filters ? filters : {};
							filters.offset = offset;
							filters.limit = limit;
							return baseVehicletypes.getList(filters).then(
									function(vehicletypes) {
										console.log(vehicletypes);
										return vehicletypes;
									});
						};

						$scope.setPagingData = function(data, page, pageSize,
								total) {
							$scope.vehicletypes = data;
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};

						$scope.loadVehicletypesTable = function() {
							$scope.getVehicletypesPagedDataAsync($scope.params);
						};

						

						$scope.loadVehicletypesTable();
					};
		*/	
						
//					create vehicletypes					
						$scope.initCreateVehicletype = function() {
						$scope.init();
						$scope.vehicletype = {};
						
						
						$scope.addVehicletype = function() {
							var baseVehicletype = Restangular.all('vehicle-types');
							
							console.log($scope.vehicletype);
							baseVehicletype.post($scope.vehicletype).then(
									function(data) {
										$scope.data = data;
//										$scope.status = data.meta.status + ": " + data.meta.msg;
										
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
										console.log(response);
										$scope.alerts = [];
										$scope.alerts.push({type: 'danger',
											msg: "Unable to add!"});
									});
														
							};
						};
						
//						edit vehicletye
						
						$scope.initEditVehicletype = function() {
//							console.log(row.entity);
							var vehicletypeId = $stateParams.vehicletypeId;
							console.log("vehicletype id :", $scope.vehicletypeId);
							$scope.init();
												
							
							$scope.getVehicletype = function(vehicletypeId) {
							var baseVehicletype = Restangular.one('vehicle-types', vehicletypeId);
							 baseVehicletype.get().then(
									function(vehicletype){
										console.log("Vehicletype", vehicletype);
										$scope.vehicletype = vehicletype;
									}, function(rsp) {
										console.log(rsp);
									});
							};
//							update vehicletype
								$scope.updateVehicletype = function() {
								var editVehicletype = Restangular.copy($scope.vehicletype);
								
								editVehicletype.put().then(
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
							$scope.getVehicletype(vehicletypeId);
								
						};
				});
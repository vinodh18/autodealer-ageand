'use strict'; 

angular.module('autodealerApp').controller('BranchesCtrl',
				function($scope, Restangular, dialogs, $stateParams, Auth) {
					$scope.init = function() {
						$scope.access = Auth.isManager();
						$scope.accessSales = Auth.isSales();
						$scope.staff = Auth.isStaff();
						$scope.engineer = Auth.isEngineer();
						$scope.customer = Auth.isCustomer();
						$scope.alerts = [];
						$scope.closeAlert = function(index) {
							$scope.alerts.splice(index, 1);
						};
					};

					$scope.initBranches = function() {
						$scope.init();
						$scope.filterOptions = {
							filterText : "",
							useExternalFilter : true
						};
						$scope.totalServerItems = 0;
						$scope.pagingOptions = {
							pageSizes : [ 15, 25, 50 ],
							pageSize : 15,
							currentPage : 1
						};
						$scope.getList = function() {
						  $scope.getBranchesPagedDataAsync($scope.params);
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
						
						$scope.$watch('pagingOptions',
										function(newVal, oldVal) {
											console.log(newVal);
											console.log(oldVal);
											if(newVal.currentPage !== oldVal.currentPage) {
												$scope.validateCurrentPage();
											}
											
											$scope.getBranchesPagedDataAsync($scope.params);
										}, true);

					
						$scope.mySelection = [];

						$scope.gridOptions = {
							data : 'branches',
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
						/*if(Auth.isManager()){*/
						$scope.gridOptions.columnDefs = [
								{
									field : 'dealer.name',
									displayName : 'Dealer'
								},{
									field : 'name',
									displayName : 'Branch Name'
								},{
									field : 'phone[0]',
									displayName : 'Phone'
								},{
									field : 'email',
									displayName : 'Email'
								},{
									field : 'address.city',
									displayName : 'City'
								},{
									field : '',
									displayName : 'Actions',
									sortable : false,
									cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
											+ '<a href="javascript:void(0)" ng-show="access || accessSales" ui-sref="^.edit({branchId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a>'
											
											+ '<a href="javascript:void(0)" ng-show="customer || staff || engineer" ui-sref="^.view({branchId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-primary" data-original-title="Edit">View</a>'

											+ '<a href="javascript:void(0)"'
											+ ' ng-click="deleteRow(row)" ng-show="access" data-toggle="tooltip" title=""'
											+ ' class="btn btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'
								} ];
						/*}else if(Auth.isSales()){						
							$scope.gridOptions.columnDefs = [
								{
									field : 'name',
									displayName : 'Branch Name'
								},{
									field : 'phone[0]',
									displayName : 'Phone'
								},{
									field : 'email',
									displayName : 'Email'
								},{
									field : 'address.city',
									displayName : 'City'
								},{
									field : '',
									displayName : 'Actions',
									sortable : false,
									cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
											+ '<a href="javascript:void(0)" ng-show="accessSales" ui-sref="^.edit({branchId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a></div></div>'
								}];
						}else {						
							$scope.gridOptions.columnDefs = [
								{
									field : 'dealer.name',
									displayName : 'Dealer'
								},{
									field : 'name',
									displayName : 'Branch Name'
								},{
									field : 'phone[0]',
									displayName : 'Phone'
								},{
									field : 'email',
									displayName : 'Email'
								}];
						}
						*/
//						delete function
						
						$scope.deleteRow = function(row) {
							dialogs.confirm('Confirm',
									'Are you sure you want to delete?').result
									.then(function(btn) {
										console.log('yes');
										var branchToDelete = row.entity;
										branchToDelete.remove({
											
										}).then(function(rsp) {
											// var index 
											// $scope.customers.indexOf(customerToDelete);
											console.log(rsp);
											// remove from scope customers so
											// that table is updated
											/*
											 * if (index > -1)
											 * $scope.customers.splice(index,
											 * 1);
											 */
											if (rsp.meta.status == 200) {
												$scope.alerts = [];
												
												$scope.alerts.push({type: 'success',
														msg: rsp.meta.msg});
												
												/*$scope.alert.msg = rsp.meta.msg;
												$scope.alert.type = 'info';*/ 
												$scope.loadBranchesTable();
											} else {
												// display error msg
												// rsp.meta.msg
												/*$scope.alert = {};
												$scope.alert.msg = rsp.meta.msg;
												$scope.alert.type = 'danger';*/
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
							console.log("Array of ids:", $scope.mySelectionIds);
							
							var baseBranches = Restangular.all('branches');
							baseBranches.customDELETE('', '', {'Content-Type': 'application/json'},
									{ids: $scope.mySelectionIds}).then(function(data) {
							    console.log("data:",data);
							    $scope.data = data;
							    $scope.status = data.meta.status + ":" + data.meta.msg;    
					    		
							    if (data.meta.status == 200) {
								    $scope.alerts = [];
							    	$scope.alerts.push({type: 'success',
										msg: data.meta.msg});
							    	$scope.loadBranchesTable();
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
						msg: "Select Branches to delete"});
					}
				};
						
//				get Branch in index page
						
						$scope.getBranchesPagedDataAsync = function(filters) {
							var pageSize = $scope.pagingOptions.pageSize;
							var page = $scope.pagingOptions.currentPage;
							var offset = (page - 1) * pageSize;
							var limit = $scope.pagingOptions.pageSize;
							$scope.getBranches(filters, offset, limit).then(
									function(branches) {
										$scope.setPagingData(branches, page,
												pageSize, branches.total);
									});
						};

						$scope.getBranches = function(filters, offset, limit) {
							var baseBranches = Restangular.all('branches');
							filters = filters ? filters : {};
							filters.offset = offset;
							filters.limit = limit;
							return baseBranches.getList(filters).then(
									function(branches) {
										console.log(branches);
										return branches;
									});
						};

						$scope.setPagingData = function(data, page, pageSize, total) {
							/*
							 * var pagedData = data.slice((page - 1) * pageSize,
							 * page pageSize);
							 */
							$scope.branches = data;
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};

						$scope.loadBranchesTable = function() {
							$scope.getBranchesPagedDataAsync($scope.params);
						};

						$scope.loadBranchesTable();
					};
	  			
						
//					create Branch	

						$scope.initCreateBranch = function() {
						$scope.init();
						$scope.branch = {};
						$scope.branch.address = {};
						$scope.branch.phone = [];
						$scope.branch.working_hours = [];
						$scope.branch.serviceable_vehicles = [];
						$scope.branch.makes = [];
						$scope.index = 0;
						$scope.count = 0;
						$scope.add = 0;

						$scope.addNewWorking_hours = function() {
							$scope.branch.working_hours.push({});
							$scope.index++;
							$scope.newWorking_hours=null;
						};
						$scope.deleteWorking_hours = function(index) {
							/*if (index > 0){*/
								$scope.branch.working_hours.splice(index, 1);							
							/*$scope.index--;
							}*/
						};

						$scope.addNewPhone = function() {
							$scope.branch.phone.push("");
							$scope.add++;
							$scope.newPhone=null;
						};
						$scope.deletePhone = function(index) {
							/*if (index > 0){*/
								$scope.branch.phone.splice(index, 1);							
							/*$scope.index--;
							}*/
						};

						$scope.addNewServiceable_vehicles = function() {
							$scope.branch.serviceable_vehicles.push({});
							$scope.count++;
							$scope.newServiceable_vehicles=null;
						};

						$scope.deleteServiceable_vehicles = function(index) {
							if (index > 0){
								$scope.branch.serviceable_vehicles.splice(index, 1);							
							$scope.count--;
							}
						};

						$scope.addBranch = function() {
							var makes = [];
							$scope.branch.makes = $scope.selectedMakes;
							var baseBranches = Restangular.all('branches');
							baseBranches.post($scope.branch).then(
									function(data) {
										console.log(data);
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
							$scope.addNewWorking_hours();
							$scope.addNewServiceable_vehicles();
							$scope.addNewPhone();

						};

				
					//		get dropdown in dealers
					
					$scope.initAllDealers = function() {
						$scope.init();
						var basedealers = Restangular.all('dealers/all');
						return basedealers.getList(/*{
							dealer : $scope.dealer
						}*/).then(function(dealers) {
							$scope.allDealers = dealers;
							return dealers;
						});
					};

					$scope.initAllMakes = function() {
						$scope.init();
						var basemakes = Restangular.all('makes/all');
						return basemakes.getList().then(function(makes) {
							$scope.allMakes = makes;
							return makes;
						});
					};

					
					$scope.initAllVehicleTypes = function() {
						$scope.init();
						var basevehicletypes = Restangular.all('vehicle-types/all');
						return basevehicletypes.getList(/*{
							vehicle_types : $scope.vehicle_types
						}*/).then(function(vehicletypes) {
							$scope.allVehicletypes = vehicletypes;
							return vehicletypes;
						});
					};
						

			$scope.selectedMakes = [];

			$scope.makeSelection = function(makeId) {
				console.log("selected" , makeId);
				var index = $scope.searchMake(makeId);
				
				if(index > -1) {
					$scope.selectedMakes.splice(index, 1);
				} else {					
					$scope.selectedMakes.push(makeId);
				}

				if($scope.selectedMakes.length > 0){
					$scope.invalid = false;
					$scope.makesRequired = false;
				}else if(index == 0){
					$scope.invalid = true;
					$scope.makesRequired = true;
				}
			};

			console.log("selectedMakes.. :", $scope.selectedMakes);
			if ($scope.selectedMakes.length == 0){
				$scope.invalid = true;	
			}


			$scope.searchMake = function(makeId) {				
				if($scope.selectedMakes.length > 0) {
					for(var i = 0; i < $scope.selectedMakes.length; i++) {						
						if($scope.selectedMakes[i]){
						if($scope.selectedMakes[i]  == makeId) {
							return i;
						}else if($scope.selectedMakes[i]._id == makeId){
							return i
						}
					}
					}
				}	
				return -1;
			}

//						edit Branch
						
						$scope.initEditBranch = function() {

							/*var branchId = $stateParams.branchId;*/
							
							$scope.init();
							$scope.index = 0;
							$scope.count = 0;
							/*$scope.add = 0;*/
							var branchId = $stateParams.branchId;
							/*$scope.branch.working_hours = [];
							$scope.branch.serviceable_vehicles = [];
						*/

						$scope.addNewWorking_hours = function() {
							$scope.branch.working_hours.push({});
							$scope.index++;
							$scope.newWorking_hours=null;
						};
						$scope.deleteWorking_hours = function(index) {
							if (index > 0){
								$scope.branch.working_hours.splice(index, 1);							
							$scope.index--;
							}
						};

						$scope.addNewServiceable_vehicles = function() {
							$scope.branch.serviceable_vehicles.push({});
							$scope.count++;
							$scope.newServiceable_vehicles=null;
						};
						
						$scope.deleteServiceable_vehicles = function(index) {
							if (index > 0){
								$scope.branch.serviceable_vehicles.splice(index, 1);							
							$scope.count--;
							}
						};

						/*$scope.addNewMakes = function() {
							$scope.branch.makes.push({});
							$scope.add++;
							$scope.newMakes=null;
						};

						$scope.deleteMakes = function(index) {
							if (index > 0){
								$scope.branch.makes.splice(index, 1);							
							$scope.add--;
							}
						};*/

							$scope.getBranch = function(branchId) {
							var baseBranch = Restangular.one('branches', branchId);
							 baseBranch.get().then(
									function(branch){
										console.log("branch..", branch);
										$scope.branch = branch;
										for(var i=0; i < $scope.branch.serviceable_vehicles.length; i++){
										 $scope.branch.serviceable_vehicles[i].vehicle_type = $scope.branch.serviceable_vehicles[i].vehicle_type._id;
										}
										$scope.selectedMakes = branch.makes;
									}, function(rsp) {
										console.log(rsp);
									});
							};

						$scope.resetStatus = function(){	
						 	for(var i=0; i < $scope.branch.serviceable_vehicles.length; i++){
								  $scope.branch.serviceable_vehicles[i] = "";
								}
								/*$scope.selectedMakes[0] = "";*/
								for(var i = 0; i < $scope.selectedMakes.length; i++) {		
										$scope.selectedMakes[i] = "";				
									}
							};	

//							update branch

								$scope.updateBranch = function() {
								var makes = [];
								for(var i=0;i < $scope.selectedMakes.length; i++){
									if(typeof $scope.selectedMakes[i] === 'object'){
										makes.push($scope.selectedMakes[i]._id);
									}else{
										makes.push($scope.selectedMakes[i]);
									}
								}

								$scope.branch.makes = makes;

								//$scope.branch.makes = $scope.selectedMakes;

								var editBranch = Restangular.copy($scope.branch);
								console.log("branch", $scope.branch.makes);
								editBranch.put().then(
										function(data) {
											console.log("data...", data);
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
							$scope.getBranch(branchId);
								
						};
				});
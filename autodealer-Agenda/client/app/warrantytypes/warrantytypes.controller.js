'use strict'; 

angular.module('autodealerApp')
		.controller('WarrantytypesCtrl',
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
					$scope.initWarrantytypes($scope.params);
				}	
				
				$scope.reset = function(){
					$scope.params = "";
					$scope.initWarrantytypes($scope.params);
				}
				// Index Page for WarrantyType
				$scope.initWarranties = function() {
					$scope.init();
					$scope.filterOptions = {
						filterText : "",
						useExternalFilter : true
					};
					
				$scope.initWarrantytypes = function(){
					$scope.currentPage = 1;
					$scope.numPerPage = 20;
					$scope.maxSize = 4;
					
					var baseWarrantytypes = Restangular.all('warranty-types');
						baseWarrantytypes.getList().then(function(warrantytypes) {
						$scope.totalWarranties = warrantytypes.length;							

				 		$scope.$watch('currentPage + numPerPage', function() {
				 			console.log("currentPage", $scope.currentPage);
				 			if($scope.currentPage > 0){
				 				var filters = {};
				 				$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
				 				filters.offset = $scope.offset;
								filters.limit = $scope.numPerPage;
								
								$scope.params.offset = filters.offset;
								$scope.params.limit =filters.limit;

								var baseWarranty = Restangular.all('warranty-types');
								return baseWarranty.getList($scope.params).then(function(warranties) {
									$scope.warranties = warranties;
									return warranties;
								});
				 			}						  		
						});
					});
			}

			$scope.deleteWarranty = function(row){
				var id = row;
				dialogs.confirm('Confirm', 'Are you sure you want to delete?').result
				.then(function(btn){
					console.log('yes');
					var WarrantyToDelete = Restangular.one('warranty-types', id);
					WarrantyToDelete.remove({}).then(function(rsp){
						if(rsp.meta.status == 200){
							$scope.alerts = [];
							$scope.alerts.push({type: 'success',
												msg: rsp.meta.msg});
							$scope.initWarrantytypes();
						}else{
							$scope.alerts = [];
							$scope.alerts.push({type: 'danger',
										msg: req.meta.msg});
						}
					});
				}, function(btn){
					console.log('no');
				});	
			}
		}
/*
					$scope.initWarrantytypes = function() {
						$scope.init();

						$scope.filterOptions = {
							filterText : "",
							useExternalFilter : true
						};
						$scope.getList = function() {
						  $scope.getWarrantytypesPagedDataAsync($scope.params);
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
								
								$scope.getWarrantytypesPagedDataAsync($scope.params);
							}, true);

						$scope.mySelection = [];

						$scope.gridOptions = {
							data : 'warrantytypes',
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
						$scope.gridOptions.columnDefs = [
								{
									field : 'name',
									displayName : 'Name'
								},
								{
									field : 'period.unit',
									displayName : 'Period Unit'
								},
								{
									field : 'desc',
									displayName : 'Description'
								},
								{
									field : '',
									displayName : 'Actions',
									sortable : false,
									cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
											+ '<a href="javascript:void(0)" ng-show="access || accessSales" ui-sref="^.edit({warrantytypeId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a>'
											
											+ '<a href="javascript:void(0)" ng-show="customer" ui-sref="^.view({warrantytypeId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-primary" data-original-title="Edit">View</a>'

											+ '<a href="javascript:void(0)"'
											+ ' ng-click="deleteRow(row)" ng-show="access" data-toggle="tooltip" title=""'
											+ ' class="btn btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'
								} ];
						
						
//						delete function
						
						$scope.deleteRow = function(row) {
							console.log(row.entity);
							dialogs.confirm('Confirm',
									'Are you sure you want to delete?').result
									.then(function(btn) {
										console.log('yes');
										var warrantytypeToDelete = row.entity;
										warrantytypeToDelete.remove({
											
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
												
												$scope.loadWarrantytypesTable();
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
							var baseWarrantytypes = Restangular.all('warranty-types');
							baseWarrantytypes.customDELETE('', '', {'Content-Type': 'application/json'},
									{ids: $scope.mySelectionIds}).then(function(data) {
							   $scope.data = data;
							    $scope.status = data.meta.status + ": " + data.meta.msg;    
					    		
							    if (data.meta.status == 200) {
								    $scope.alerts = [];
							    	$scope.alerts.push({type: 'success',
										msg: data.meta.msg});
							    	$scope.loadWarrantytypesTable();
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
									msg: "Select Warranty Types to delete"});
					}
				};
						
//				get Warrantytypes in index page
						
						$scope.getWarrantytypesPagedDataAsync = function(filters) {
							var pageSize = $scope.pagingOptions.pageSize;
							var page = $scope.pagingOptions.currentPage;
							var offset = (page - 1) * pageSize;
							var limit = $scope.pagingOptions.pageSize;
							$scope.getWarrantytypes(filters, offset, limit).then(
									function(warrantytypes) {
										$scope.setPagingData(warrantytypes, page,
												pageSize, warrantytypes.total);
									});
						};

						$scope.getWarrantytypes = function(filters, offset, limit) {
							var baseWarrantytypes = Restangular.all('warranty-types');
							filters = filters ? filters : {};
							filters.offset = offset;
							filters.limit = limit;
							return baseWarrantytypes.getList(filters).then(
									function(warrantytypes) {
										console.log(warrantytypes);
										return warrantytypes;
									});
						};

						$scope.setPagingData = function(data, page, pageSize, total) {
							$scope.warrantytypes = data;
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};

						$scope.loadWarrantytypesTable = function() {
							$scope.getWarrantytypesPagedDataAsync($scope.params);
						};

						$scope.loadWarrantytypesTable();
					};
		*/
						
//					create Warrantytypes					

						$scope.initCreateWarrantytype = function() {
						$scope.init();
						$scope.warrantytype = {};
						
						
						$scope.addWarrantytype = function() {
							var baseWarrantytype = Restangular.all('warranty-types');
							
							baseWarrantytype.post($scope.warrantytype).then(
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
						
//						edit Warrantytype
						
						$scope.initEditWarrantytype = function() {
//							console.log(row.entity);
							var warrantytypeId = $stateParams.warrantytypeId;
							console.log("warrantytype id :", $scope.warrantytypeId);
							$scope.init();
												
							
							$scope.getWarrantytype = function(warrantytypeId) {
							var baseWarrantytype = Restangular.one('warranty-types', warrantytypeId);
							 baseWarrantytype.get().then(
									function(warrantytype){
										console.log("Warrantytype", warrantytype);
										$scope.warrantytype = warrantytype;
									}, function(rsp) {
										console.log(rsp);
									});
							};
//							update Warrantytype
								$scope.updateWarrantytype = function() {
								var editWarrantytype = Restangular.copy($scope.warrantytype);
								
								editWarrantytype.put().then(
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
							$scope.getWarrantytype(warrantytypeId);
								
						};
				});
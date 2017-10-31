'use strict'; 

angular.module('autodealerApp')
		.controller('ServicetypesCtrl',
				function($scope, Restangular, dialogs, $stateParams, Auth) {
					$scope.init = function() {
						/*$scope.access = Auth.isManager();
						$scope.accessSales = Auth.isSales();
						$scope.customer = Auth.isCustomer()
						$scope.engineer = Auth.isEngineer();*/
						$scope.alerts = [];
						$scope.closeAlert = function(index) {
							$scope.alerts.splice(index, 1);
						};
					};

					$scope.initServicetypes = function() {
						$scope.init();

						$scope.filterOptions = {
							filterText : "",
							useExternalFilter : true
						};
						$scope.getList = function() {
							
							$scope.getServicetypesPagedDataAsync($scope.params);
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
								$scope.getServicetypesPagedDataAsync($scope.params);
							}, true);

						$scope.mySelection = [];

						$scope.gridOptions = {
							data : 'servicetypes',
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
									field : 'name',
									displayName : 'Name'
								},
								{
									field : 'amount',
									displayName : 'Amount'
								},
								{
									field : '',
									displayName : 'Actions',
									sortable : false,
									cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
											+ '<a href="javascript:void(0)" ng-hide ="accessSales || customer" ui-sref="^.edit({servicetypeId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a>'

											+ '<a href="javascript:void(0)" ng-show="customer" ui-sref="^.view({servicetypeId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-primary" data-original-title="View">View</a>'

											+ '<a href="javascript:void(0)"'
											+ ' ng-click="deleteRow(row)" ng-show="access" data-toggle="tooltip" title=""'
											+ ' class="btn btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'
								}];
						/*}else if(Auth.isSales()){						
							$scope.gridOptions.columnDefs = [
								{
									field : 'name',
									displayName : 'Name'
								},
								{
									field : 'amount',
									displayName : 'Amount'
								},{
									field : '',
									displayName : 'Actions',
									sortable : false,
									cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
											+ '<a href="javascript:void(0)" ui-sref="^.edit({servicetypeId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a></div></div>'
								}];
						}else{						
							$scope.gridOptions.columnDefs = [
								{
									field : 'name',
									displayName : 'Name'
								},
								{
									field : 'amount',
									displayName : 'Amount'
								}];
						}*/
						
//						delete function
						
						$scope.deleteRow = function(row) {
							console.log(row.entity);
							dialogs.confirm('Confirm',
									'Are you sure you want to delete?').result
									.then(function(btn) {
										console.log('yes');
										var servicetypeToDelete = row.entity;
										servicetypeToDelete.remove({
											
										}).then(function(rsp) {
											// var index =
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
												$scope.loadServicetypesTable();
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
							/*console.log("Array of ids:", $scope.mySelectionIds);*/
							var baseServicetypes = Restangular.all('service-types');
							baseServicetypes.customDELETE('', '', {'Content-Type': 'application/json'},
									{ids: $scope.mySelectionIds}).then(function(data) {
							    /*console.log("data:",data);*/
							    $scope.data = data;
							    $scope.status = data.meta.status + ": " + data.meta.msg;    
					    		
							    if (data.meta.status == 200) {
								    $scope.alerts = [];
							    	$scope.alerts.push({type: 'success',
										msg: data.meta.msg});
							    	$scope.loadServicetypesTable();
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
									msg: "Select Servicetypes to delete"});
					}
				};
						
//				get customer in index page
						
						$scope.getServicetypesPagedDataAsync = function(filters) {
							var pageSize = $scope.pagingOptions.pageSize;
							var page = $scope.pagingOptions.currentPage;
							var offset = (page - 1) * pageSize;
							var limit = $scope.pagingOptions.pageSize;
							$scope.getServicetypes(filters, offset, limit).then(
									function(servicetypes) {
										$scope.setPagingData(servicetypes, page,
												pageSize, servicetypes.total);
									});
						};

						$scope.getServicetypes = function(filters, offset, limit) {
							var baseServicetypes = Restangular.all('service-types');
							filters = filters ? filters : {};
							filters.offset = offset;
							filters.limit = limit;
							return baseServicetypes.getList(filters).then(
									function(servicetypes) {
										console.log(servicetypes);
										return servicetypes;
									});
						};

						$scope.setPagingData = function(data, page, pageSize,
								total) {
							$scope.servicetypes = data;
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};

						$scope.loadServicetypesTable = function() {
							$scope.getServicetypesPagedDataAsync($scope.params);
						};

						/*$scope.closeAlert = function(index) {
							//console.log($scope.alert);
							//delete $scope.alert;
							$scope.alerts.splice(index, 1);
						};*/

						$scope.loadServicetypesTable();
					};
		
						
//					create servicetypes					
						$scope.initCreateServicetype = function() {
						$scope.init();
						$scope.servicetype = {};
						
						
						$scope.addServicetype = function() {
							var baseServicetype = Restangular.all('service-types');
							
							/*console.log($scope.vehicletype);*/
							baseServicetype.post($scope.servicetype).then(
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
						
//						edit servicetype
						
						$scope.initEditServicetype = function() {
//							console.log(row.entity);
							var servicetypeId = $stateParams.servicetypeId;
							console.log("servicetype id :", $scope.servicetypeId);
							$scope.init();
												
							
							$scope.getServicetype = function(servicetypeId) {
							var baseServicetype = Restangular.one('service-types', servicetypeId);
							 baseServicetype.get().then(
									function(servicetype){
										console.log("Servicetype", servicetype);
										$scope.servicetype = servicetype;
									}, function(rsp) {
										console.log(rsp);
									});
							};
//							update servicetype
								$scope.updateServicetype = function() {
								var editServicetype = Restangular.copy($scope.servicetype);
								
								editServicetype.put().then(
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
							$scope.getServicetype(servicetypeId);
								
						};
				});
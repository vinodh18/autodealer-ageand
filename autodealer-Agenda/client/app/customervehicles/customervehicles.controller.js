'use strict'; 

angular.module('autodealerApp')
		.controller('CustomervehiclesCtrl',
				function($scope, Restangular, dialogs, $stateParams, Auth) {
					$scope.params = {};
					$scope.init = function() {
						$scope.accessCustomer = Auth.isCustomer();
						$scope.currentUser = Auth.getCurrentUser();
						$scope.alerts = [];
						$scope.closeAlert = function(index) {
							$scope.alerts.splice(index, 1);
						};

					/*$scope.ranges = {
			         'Today': [moment(), moment()],
			         'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
			         'Last 7 Days': [moment().subtract('days', 6), moment()],
			         'Last 30 Days': [moment().subtract('days', 29), moment()],
			         'This Month': [moment().startOf('month'), moment().endOf('month')],
			         'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
			      };*/
			};

		$scope.initDateRanges = function() {
			$scope.dateRange = {};
			$scope.dateRange.startDate = moment().subtract('days', 6);
			$scope.dateRange.endDate = moment();
		};

		$scope.getList = function(){
			$scope.initViewCustomerVehicles($scope.params);
		}
		$scope.reset = function(){
			$scope.params = "";
			$scope.initViewCustomerVehicles($scope.params);
		}

		$scope.initCustomervehicles = function(){
			$scope.init();

			$scope.filterOptions = {
					filterText : "",
					useExternalFilter : true
				};

			$scope.initViewCustomerVehicles = function(){
				$scope.currentPage = 1;
				$scope.numPerPage = 20;
				$scope.maxPages = 4;

			var baseCustomervehicles = Restangular.all('customer-vehicles');
				baseCustomervehicles.getList($scope.params).then(function(customervehicles){
				$scope.customervehicles = customervehicles;
				$scope.totalCustomervehices = $scope.customervehicles.length;

				$scope.$watch('currentPage + numPerPage', function(){
					if($scope.currentPage > 0){
						var filters = {};
						$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
						filters.offset = $scope.offset;
						filters.limit = $scope.numPerPage;
						
						$scope.params.offset = filters.offset;
						$scope.params.limit = filters.limit;
						
						var basecustomervehicles = Restangular.all('customer-vehicles');
						basecustomervehicles.getList($scope.params).then(function(customervehicles){
							$scope.customervehicles = customervehicles;
							
								var dealerId = $scope.currentUser.dealer._id;
								var makeid = [];
								var ModelsId = [];
								//$scope.mySelectionIds = [];
								$scope.myModels = [];
								for(var i=0; i<$scope.customervehicles.length; i++){
									$scope.mySelectionIds = $scope.customervehicles[i].make;
									$scope.myModels = $scope.customervehicles[i].model;
									ModelsId.push($scope.myModels);
									makeid.push($scope.mySelectionIds);
									}
									// get Makes List
								var MakesList = [];
								var ModelsList = [];
								console.log("MakesList", makeid.length);

								for(var i=0; i<makeid.length; i++){
									var baseMakes = Restangular.one('dealers/'+dealerId+ '/make/'+makeid[i]);
									baseMakes.get().then(function(makes){
										$scope.Makes = makes;
										$scope.MakName = $scope.Makes.make.name;
										MakesList.push($scope.MakName);
										$scope.Make = MakesList;
										console.log("MakesList", MakesList);
									});
								}
							for(var j=0; j<ModelsId.length; j++){
										console.log("ModelsId", ModelsId.length);
									var baseModel = Restangular.one('dealers/'+dealerId+ '/make/'+makeid[j]+ '/model/'+ModelsId[j]);
									baseModel.get().then(function(Models){
									$scope.Model = Models;
									$scope.ModelName = $scope.Model.model.name;
									ModelsList.push($scope.ModelName);
									$scope.model = ModelsList;
									console.log("ModelsList", ModelsList);
									});
								}
						});
					}
				});
			});
			}
		}

		// single delete
			$scope.deleteCustomerVehicles = function(row){
				var id = row;
				console.log("id", row);
				dialogs.confirm('Confirm', 'Are you want to delete?').result
				.then(function(btn){
					console.log('yes');
					var customervehicles = Restangular.one('customer-vehicles', id);
					customervehicles.remove().then(function(rsp){
						if(rsp.meta.status == 200){
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
							$scope.initViewCustomerVehicles();
						}else{
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
						}
					});
				});
			}

/*
		$scope.initCustomervehicles = function() {
			$scope.init();

			$scope.getList = function() {
			console.log("getList :",  $scope.params);
			$scope.getCustomervehiclesPagedDataAsync($scope.params);
			};

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
											
											if(newVal.currentPage !== oldVal.currentPage) {
												$scope.validateCurrentPage();
											}
											
											$scope.getCustomervehiclesPagedDataAsync($scope.params);
										}, true);

						$scope.mySelection = [];

						$scope.gridOptions = {
							data : 'customervehicles',
							enablePaging : true,
							showFooter : true,
							totalServerItems : 'totalServerItems',
							pagingOptions : $scope.pagingOptions,
							filterOptions : $scope.filterOptions,
							selectedItems : $scope.mySelection,
							keepLastSelected: false,
							multiSelect: Auth.isCustomer(),
							selectWithCheckboxOnly :Auth.isCustomer(),
							showSelectionCheckbox :Auth.isCustomer(),
						};
						if(Auth.isCustomer()){
						$scope.gridOptions.columnDefs = [
								{
									field : 'reg_no',
									displayName : 'Reg No'
								},{
									field : 'vehicle_type.name',
									displayName : 'VehicleType Name'
								},{
									field : 'make.name',
									displayName : 'Make Name'
								},{
									field : 'model.name',
									displayName : 'Model Name'
								},
								{
									field : '',
									displayName : 'Actions',
									sortable : false,
									cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
											+ '<a href="javascript:void(0)" ui-sref="^.edit({customervehicleId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a>'
											+ '<a href="javascript:void(0)"'
											+ ' ng-click="deleteRow(row)" data-toggle="tooltip" title=""'
											+ ' class="btn btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'
								} ];
						}
//						delete function
						
						$scope.deleteRow = function(row) {
							console.log(row.entity);
							dialogs.confirm('Confirm',
									'Are you sure you want to delete?').result
									.then(function(btn) {
										console.log('yes');
										var customervehicleToDelete = row.entity;
										customervehicleToDelete.remove({
											
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
												$scope.loadCustomervehiclesTable();
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
							var baseCustomervehicles = Restangular.all('customer-vehicles');
							baseCustomervehicles.customDELETE('', '', {'Content-Type': 'application/json'},
									{ids: $scope.mySelectionIds}).then(function(data) {
							    $scope.data = data;
							    $scope.status = data.meta.status + ": " + data.meta.msg;    
					    		
							    if (data.meta.status == 200) {
								    $scope.alerts = [];
							    	$scope.alerts.push({type: 'success',
										msg: data.meta.msg});
							    	$scope.loadCustomervehiclesTable();
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
									msg: "Select CustomerVehicles to delete"});
					}
				};
						
//				get customer in index page
						
						$scope.getCustomervehiclesPagedDataAsync = function(filters) {
							var pageSize = $scope.pagingOptions.pageSize;
							var page = $scope.pagingOptions.currentPage;
							var offset = (page - 1) * pageSize;
							var limit = $scope.pagingOptions.pageSize;
							$scope.getCustomervehicles(filters, offset, limit).then(
									function(customervehicles) {
										$scope.setPagingData(customervehicles, page,
												pageSize, customervehicles.total);
									});
						};

						$scope.getCustomervehicles = function(filters, offset, limit) {
							var baseCustomervehicles = Restangular.all('customer-vehicles');
							filters = filters ? filters : {};
							filters.offset = offset;
							filters.limit = limit;
							return baseCustomervehicles.getList(filters).then(
									function(customervehicles) {
										return customervehicles;
									});
						};

						$scope.setPagingData = function(data, page, pageSize,
								total) {
							$scope.customervehicles = data;
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};

						$scope.loadCustomervehiclesTable = function() {
							$scope.getCustomervehiclesPagedDataAsync($scope.params);
						};

						$scope.loadCustomervehiclesTable();
					};
					*/
		//		get dropdown in Customer, vehicletype, make, model, warrantyType
					
					$scope.initAllCustomer = function() {
						$scope.init();
						var basecustomers = Restangular.all('customers/all');
						return basecustomers.getList().then(function(customers) {
							$scope.allCustomers = customers;
							return customers;
						});
					};

					$scope.initAllMake = function() {
						$scope.init();
						var basemakes = Restangular.all('dealers/makes/all');
						return basemakes.getList().then(function(makes) {
							$scope.allMakes = makes;
							return makes;
						});
					};

					$scope.initAllModel = function() {
						$scope.init();
						var basemodels = Restangular.all('dealers/models/all');
						return basemodels.getList().then(function(models) {
							$scope.allModels = models;
							return models;
						});
					};
					
					$scope.initAllVehicletype = function() {
						$scope.init();
						var basevehicletypes = Restangular.all('vehicle-types/all');
						return basevehicletypes.getList().then(function(vehicletypes) {
							$scope.allVehicletypes = vehicletypes;
							return vehicletypes;
						});
					};

					$scope.initAllWarrantytype = function() {
						$scope.init();
						var basewarrantytypes = Restangular.all('warranty-types/all');
						return basewarrantytypes.getList().then(function(warrantytypes) {
							$scope.allWarrantytypes = warrantytypes;
							return warrantytypes;
						});
					};
						
					
//					create Customervehicle

						$scope.initCreateCustomervehicle = function() {
						$scope.init();
						$scope.customervehicles = {};
						$scope.addCustomervehicle = function() {
							var baseCustomervehicles = Restangular.all('customer-vehicles');
							console.log('customervehicles', $scope.customervehicles);
							$scope.customervehicles.customer = $scope.customervehicles.customer._id;
							$scope.customervehicles.vehicle_type = $scope.customervehicles.vehicle_type._id;
							baseCustomervehicles.post($scope.customervehicles).then(
									function(data) {
										console.log("data",data);
										$scope.data = data;
										
										if (data.meta.status == 201) {
											$scope.customervehicles = data.response.customervehicle;
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
						
//						edit Customervehicle
						
						$scope.initEditCustomervehicle = function() {
							var customervehicleId = $stateParams.customervehicleId;
							//console.log("customervehicle id :", customervehicleId);
							$scope.init();
												
							$scope.getCustomervehicle = function(customervehicleId) {
							var baseCustomervehicle = Restangular.one('customer-vehicles', customervehicleId);
							 baseCustomervehicle.get().then(
									function(customervehicles){
										$scope.customervehicles = customervehicles;
										$scope.customervehicles.warranties.warranty_type = $scope.customervehicles.warranties.warranty_type._id;
									}, function(rsp) {
										console.log(rsp);
									});
							};
//							update customervehicle
								$scope.updateCustomervehicle = function() {
								$scope.customervehicles.customer = $scope.customervehicles.customer._id;
								$scope.customervehicles.vehicle_type = $scope.customervehicles.vehicle_type._id;	
								var editCustomervehicle = Restangular.copy($scope.customervehicles);								
								editCustomervehicle.put().then(
										function(data) {
											console.log("data...", data);
											$scope.data = data;
//											$scope.status = data.meta.status + ": " + data.meta.msg;

											if (data.meta.status == 200) {
												$scope.customervehicles.customer = data.customervehicle.customer;
												$scope.customervehicles.vehicle_type = data.customervehicle.vehicle_type;
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
							$scope.getCustomervehicle(customervehicleId);
								
						};
				});
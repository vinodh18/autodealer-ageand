'use strict'; 

angular.module('autodealerApp')
		.controller('ModelsCtrl',
				function($scope, Restangular, dialogs, $stateParams, Auth) {
					$scope.init = function() {
						$scope.access = Auth.isManager();
						$scope.accessSales = Auth.isSales();
						$scope.alerts = [];
						$scope.closeAlert = function(index) {
							$scope.alerts.splice(index, 1);
						};
					};

					$scope.initModels = function() {
						$scope.init();

						$scope.filterOptions = {
							filterText : "",
							useExternalFilter : true
						};
						$scope.getList = function() {
							
							$scope.getModelsPagedDataAsync($scope.params);
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
											
											$scope.getModelsPagedDataAsync($scope.params);
										}, true);

						$scope.mySelection = [];

						$scope.gridOptions = {
							data : 'models',
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
									field : 'make.name',
									displayName : 'Make Name'
								},{
									field : 'name',
									displayName : 'Model Name'
								},
								{
									field : '',
									displayName : 'Actions',
									sortable : false,
									cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
											+ '<a href="javascript:void(0)"   ui-sref="^.edit({modelId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a>'
											+ '<a href="javascript:void(0)"'
											+ ' ng-click="deleteRow(row)"  data-toggle="tooltip" title=""'
											+ ' class="btn btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'
								} ];
						}else if(Auth.isSales()){						
							$scope.gridOptions.columnDefs = [
								{
									field : 'make.name',
									displayName : 'Make Name'
								},{
									field : 'name',
									displayName : 'Model Name'
								},{
									field : '',
									displayName : 'Actions',
									sortable : false,
									cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
											+ '<a href="javascript:void(0)" ui-sref="^.edit({modelId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a></div></div>'
								}];
						}else{						
							$scope.gridOptions.columnDefs = [
								{
									field : 'make.name',
									displayName : 'Make Name'
								},{
									field : 'name',
									displayName : 'Model Name'
								}];
						}
						
//						delete function
						
						$scope.deleteRow = function(row) {
							console.log(row.entity);
							dialogs.confirm('Confirm',
									'Are you sure you want to delete?').result
									.then(function(btn) {
										console.log('yes');
										var modelToDelete = row.entity;
										modelToDelete.remove({
											
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
												$scope.loadModelsTable();
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
							var baseModels = Restangular.all('models');
							baseModels.customDELETE('', '', {'Content-Type': 'application/json'},
									{ids: $scope.mySelectionIds}).then(function(data) {
							    /*console.log("data:",data);*/
							    $scope.data = data;
							    $scope.status = data.meta.status + ": " + data.meta.msg;    
					    		
							    if (data.meta.status == 200) {
								    $scope.alerts = [];
							    	$scope.alerts.push({type: 'success',
										msg: data.meta.msg});
							    	$scope.loadModelsTable();
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
									msg: "Select Models to delete"});
					}
				};
						
//				get models in index page
						
						$scope.getModelsPagedDataAsync = function(filters) {
							var pageSize = $scope.pagingOptions.pageSize;
							var page = $scope.pagingOptions.currentPage;
							var offset = (page - 1) * pageSize;
							var limit = $scope.pagingOptions.pageSize;
							$scope.getModels(filters, offset, limit).then(
									function(models) {
										$scope.setPagingData(models, page,
												pageSize, models.total);
									});
						};

						$scope.getModels = function(filters, offset, limit) {
							var baseModels = Restangular.all('models');
							filters = filters ? filters : {};
							filters.offset = offset;
							filters.limit = limit;
							return baseModels.getList(filters).then(
									function(models) {
										return models;
									});
						};

						$scope.setPagingData = function(data, page, pageSize, total) {
							$scope.models = data;
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};

						$scope.loadModelsTable = function() {
							$scope.getModelsPagedDataAsync($scope.params);
						};

						/*$scope.closeAlert = function(index) {
							//console.log($scope.alert);
							//delete $scope.alert;
							$scope.alerts.splice(index, 1);
						};*/

						$scope.loadModelsTable();
					};
		//		get dropdown in Makes
					
					$scope.initAllMakes = function() {
						$scope.init();
						var basemakes = Restangular.all('makes/all');
						return basemakes.getList({
							/*make : $scope.make*/
						}).then(function(makes) {
							$scope.allMakes = makes;
							return makes;
						});
					};
	
						
//					create Model					
						$scope.initCreateModel = function() {
						$scope.init();
						$scope.model = {};
						
						
						$scope.addModel = function() {
							var baseModels = Restangular.all('models');
							
							/*console.log($scope.customer);*/
							baseModels.post($scope.model).then(
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
						};
						
//						edit model
						
						$scope.initEditModel = function() {
//							console.log(row.entity);
							var modelId = $stateParams.modelId;
							console.log("model id :", $scope.modelId);
							$scope.init();
												
							
							$scope.getModel = function(modelId) {
							var baseModel = Restangular.one('models', modelId);
							 baseModel.get().then(
									function(model){
										/*console.log("customer", customer);*/
										$scope.model = model;
									}, function(rsp) {
										console.log(rsp);
									});
							};
//							update model
								$scope.updateModel = function() {
								var editModel = Restangular.copy($scope.model);
								
								editModel.put().then(
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
							$scope.getModel(modelId);
								
						};

				/* check Model name using make Duplication*/
		
			$scope.modelChange = function(model){
				if (model.name) {
				//model.make = model.make._id;
				
				console.log('model', model);
				var basemodel = Restangular.one('models/check-model')
				basemodel.get(model).then(function(data){
					$scope.data = data;
				    $scope.status = data.meta.status + ": " + data.meta.msg;  
					if(data.meta.status == 200){
				$scope.modelnameSpinner = false;									
				console.log("Exists");
				document.getElementById("model_name").setAttribute("class", "form-control ng-valid-maxlength ng-touched ng-dirty ng-valid-parse ng-valid-required ng-valid-minlength ng-invalid");						
				$scope.isValidusername = false;						
				$scope.modelForm.model_name.$invalid = true;
				$scope.modelForm.model_name.$error.exists = true;
				$scope.modelForm.model_name.$error.available = false;			
			}					
		}, function(rsp) {						
			if(rsp.status == 404){		
				document.getElementById("model_name").setAttribute("class", "form-control ng-valid-maxlength ng-touched ng-dirty ng-valid-parse ng-valid-required ng-valid-minlength ng-valid");
				$scope.modelnameSpinner = false;
				$scope.isValidusername = true;
				$scope.modelForm.model_name.$invalid = false;
				$scope.modelForm.model_name.$error.exists = false;
				$scope.modelForm.model_name.$error.available = true;
					}
				})
			};
		}
	});
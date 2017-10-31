'use strict'; 

angular.module('autodealerApp')
		.controller('MakesCtrl',
				function($scope, Restangular, dialogs, $stateParams, Auth) {
					$scope.init = function() {						
						$scope.alerts = [];
						$scope.closeAlert = function(index) {
							$scope.alerts.splice(index, 1);
						};
					};

					$scope.initMakes = function() {
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
							$scope.getMakesPagedDataAsync($scope.params);
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
											
											$scope.getMakesPagedDataAsync($scope.params);
										}, true);

						$scope.mySelection = [];

						$scope.gridOptions = {
							data : 'makes',
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
											+ '<a href="javascript:void(0)"  ui-sref="^.edit({makeId: row.entity._id})"' 
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
											+ '<a href="javascript:void(0)" ui-sref="^.edit({makeId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a></div></div>'
								}];
						}else{						
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
										var makeToDelete = row.entity;
										makeToDelete.remove({
											
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
												$scope.loadMakesTable();
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
							var baseMakes = Restangular.all('makes');
							baseMakes.customDELETE('', '', {'Content-Type': 'application/json'},
									{ids: $scope.mySelectionIds}).then(function(data) {
							    /*console.log("data:",data);*/
							    $scope.data = data;
							    $scope.status = data.meta.status + ": " + data.meta.msg;    
					    		
							    if (data.meta.status == 200) {
								    $scope.alerts = [];
							    	$scope.alerts.push({type: 'success',
										msg: data.meta.msg});
							    	$scope.loadMakesTable();
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
									msg: "Select Makes to delete"});
					}
				};
						
//				get customer in index page
						
						$scope.getMakesPagedDataAsync = function(filters) {
							var pageSize = $scope.pagingOptions.pageSize;
							var page = $scope.pagingOptions.currentPage;
							var offset = (page - 1) * pageSize;
							var limit = $scope.pagingOptions.pageSize;
							$scope.getMakes(filters, offset, limit).then(
									function(makes) {
										$scope.setPagingData(makes, page,
												pageSize, makes.total);
									});
						};

						$scope.getMakes = function(filters, offset, limit) {
							var baseMakes = Restangular.all('makes');
							filters = filters ? filters : {};
							filters.offset = offset;
							filters.limit = limit;
							return baseMakes.getList(filters).then(
									function(makes) {
										return makes;
									});
						};

						$scope.setPagingData = function(data, page, pageSize,
								total) {
							$scope.makes = data;
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};

						$scope.loadMakesTable = function() {
							$scope.getMakesPagedDataAsync($scope.params);
						};

						/*$scope.closeAlert = function(index) {
							//console.log($scope.alert);
							//delete $scope.alert;
							$scope.alerts.splice(index, 1);
						};*/

						$scope.loadMakesTable();
					};
		
						
//					create Make					
						$scope.initCreateMake = function() {
						$scope.init();
						$scope.make = {};
						
						
						$scope.addMake = function() {
							var baseMakes = Restangular.all('makes');
							
							console.log($scope.make);
							baseMakes.post($scope.make).then(
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
						
//						edit Make
						
						$scope.initEditMake = function() {
							var makeId = $stateParams.makeId;
							console.log("make id :", $scope.makeId);
							$scope.init();
												
							
							$scope.getMake = function(makeId) {
							var baseMake = Restangular.one('makes', makeId);
							 baseMake.get().then(
									function(make){
										/*console.log("customer", customer);*/
										$scope.make = make;
									}, function(rsp) {
										console.log(rsp);
									});
							};
//							update make
								$scope.updateMake = function() {
								var editMake = Restangular.copy($scope.make);
								
								editMake.put().then(
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
							$scope.getMake(makeId);
								
						};

		/* check make name Duplication*/
		
			$scope.makeChange = function(make){
				if (make.name) {
				console.log('make', make);
				var basemake = Restangular.one('makes/check-name')
				basemake.get({name: make.name}).then(function(data){
					$scope.data = data;
				    $scope.status = data.meta.status + ": " + data.meta.msg;  
					if(data.meta.status == 200){
				$scope.makenameSpinner = false;									
				console.log("Exists");
				document.getElementById("make_name").setAttribute("class", "form-control ng-valid-maxlength ng-touched ng-dirty ng-valid-parse ng-valid-required ng-valid-minlength ng-invalid");						
				$scope.isValidusername = false;						
				$scope.makeForm.make_name.$invalid = true;
				$scope.makeForm.make_name.$error.exists = true;
				$scope.makeForm.make_name.$error.available = false;			
			}					
		}, function(rsp) {						
			if(rsp.status == 404){		
				document.getElementById("make_name").setAttribute("class", "form-control ng-valid-maxlength ng-touched ng-dirty ng-valid-parse ng-valid-required ng-valid-minlength ng-valid");
				$scope.usernameSpinner = false;
				$scope.isValidusername = true;
				$scope.makeForm.make_name.$invalid = false;
				$scope.makeForm.make_name.$error.exists = false;
				$scope.makeForm.make_name.$error.available = true;
					}
				})
			};
		}
});
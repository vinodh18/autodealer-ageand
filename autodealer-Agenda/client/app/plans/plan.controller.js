'use strict';

angular.module('autodealerApp').controller('PlansCtrl',
		function($scope, Restangular, dialogs, $stateParams, Auth) {
			
			$scope.init = function() {
				$scope.alerts = [];
				$scope.closeAlert = function(index) {
					$scope.alerts.splice(index, 1);
				};
			};

			if(Auth.isSuperAdmin()){ 
				$scope.accessPlan = true;
			}else{
				$scope.accessPlan = false;
			}

			$scope.initPlans = function(){
				$scope.init();

				$scope.filterOptions = {
					filterText : "",
					useExternalFilter : true
				}
				$scope.initAllPlans = function(){
					$scope.currentPage = 1;
					$scope.numPerPage = 20;
					$scope.maxPages = 4;

					var basePlans = Restangular.all('plans');
					basePlans.getList().then(function(response){
						$scope.plans = response;
					});

					$scope.$watch('currentPage + numPerPage', function(){

						if($scope.currentPage > 0){
							var filters = {};
							$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
								filters.offset = $scope.offset;
								filters.limit = $scope.numPerPage;

							var basePlans = Restangular.all('plans');
							basePlans.getList($scope.filters).then(function(response){
								console.log("base Plans.........", response);
								$scope.plans = response;
								$scope.total = $scope.plans.length;
							});
						}
					});
				}
			}

			$scope.removePlan = function(row){
				var id = row;
				console.log("row id", id);
				dialogs.confirm('Are you sure You want to Delete ?').result.then(function(btn){
					var basePlan = Restangular.one('plans', id);
					basePlan.remove().then(function(rsp){
						if(rsp.meta.status == 200){
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
							$scope.initAllPlans ();
						}else{
							$scope.alerts = [];
							$scope.alerts.push({type: 'danger', msg: rsp.meta.msg});
						}
					});
				});
			}

			/*$scope.initPlans = function() {
				$scope.init();
				
				$scope.filterOptions = {
					filterText : "",
					useExternalFilter : true
				};

				$scope.totalServerItems = 0;

				$scope.pagingOptions = {
					pageSizes : [ 5, 20, 50 ],
					pageSize : 5,
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
				
				$scope
						.$watch(
								'pagingOptions',
								function(newVal, oldVal) {
									console.log(newVal);
									console.log(oldVal);
									if(newVal.currentPage !== oldVal.currentPage) {
										$scope.validateCurrentPage();
										$scope.getPlansPagedDataAsync();
									}
								
								}, true);

				$scope.mySelection = [];

				$scope.gridOptions = {
					data : 'plans',
					enablePaging : true,
					showFooter : true,
					totalServerItems : 'totalServerItems',
					pagingOptions : $scope.pagingOptions,
					filterOptions : $scope.filterOptions,
					selectedItems : $scope.mySelection,
					keepLastSelected: false,
					multiSelect: true,
					selectWithCheckboxOnly : true,
					showSelectionCheckbox : true
				};

				$scope.gridOptions.columnDefs = [
						{
							field : 'plan_code',
							displayName : 'Plan Code'
						},
						{
							field : 'plan_name',
							displayName : 'Plan Name'
						}, 
						{
							field : 'plan_description',
							displayName : 'Description'
						},
						{
							field : 'price',
							displayName : 'Price'
						},
						{
							field : 'duration',
							displayName: 'Duration'
						},
						{
							field: 'trial_period',
							displayName: 'Trial Period'
						},
						{
							field : '',
							displayName : 'Actions',
							sortable : false,
							cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
									+ '<a href="javascript:void(0)" ui-sref="^.edit({planId:row.entity._id})" data-toggle="tooltip" title=""'
									+ ' class="btn btn-default" data-original-title="Edit"><i class="fa fa-pencil"></i></a>'
									+ '<a href="javascript:void(0)"'
									+ ' ng-click="deleteRow(row)" data-toggle="tooltip" title=""'
									+ ' class="btn btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'
						} ];

				$scope.deleteRow = function(row) {
					console.log("Entity", row.entity);
					dialogs.confirm('Confirm',
							'Are you sure you want to delete?').result
							.then(function(btn) {
								console.log('yes');
								var planToDelete = row.entity;
								planToDelete.remove().then(function(rsp) {
									console.log(rsp);									
									if (rsp.meta.status == 200) {
										$scope.alerts = [];
										$scope.alerts.push({type: 'success',
												msg: rsp.meta.msg});										
										$scope.loadPlansTable();
									} else {
										$scope.alerts = [];
										$scope.alerts.push({type: 'danger',
											msg: rsp.meta.msg});
									}

								});
							}, function(btn) {
								console.log('no');
							});
				};

				$scope.planMultiDelete = function(){
					$scope.init();
					$scope.mySelectionIds = [];
					
					for(var i=0; i < $scope.mySelection.length; i++){
						$scope.mySelectionIds[i] = $scope.mySelection[i]._id;
					}
					console.log("Array of ids:", $scope.mySelectionIds);
					dialogs.confirm('Confirm',
					'Are you sure you want to delete?').result
					.then(function(btn) {
						console.log('yes');
					
					var basePlans = Restangular.all('plans');
					basePlans.customDELETE('', '', {'Content-Type': 'application/json'},
							{ids: $scope.mySelectionIds}).then(function(data) {
					    console.log("data:",data);
					    $scope.data = data;
					    $scope.status = data.meta.status + ": " + data.meta.msg;    
			    		
					    if (data.meta.status == 200) {
						    $scope.alerts = [];
					    	$scope.alerts.push({type: 'success',
								msg: data.meta.msg});
					    	$scope.loadPlansTable();
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
					}, function(btn) {
						console.log('no');
					});
				};
				
				$scope.getPlansPagedDataAsync = function(filters) {
					var pageSize = $scope.pagingOptions.pageSize;
					var page = $scope.pagingOptions.currentPage;
					var offset = (page - 1) * pageSize;
					var limit = $scope.pagingOptions.pageSize;
					$scope.getPlans(filters, offset, limit).then(
							function(plans) {
								$scope.setPagingData(plans, page,
										pageSize, plans.total);
							});
				};

				$scope.getPlans = function(filters, offset, limit) {
					var basePlans = Restangular.all('plans');
					filters = filters ? filters : {};
					filters.offset = offset;
					filters.limit = limit;
					return basePlans.getList(filters).then(
							function(plans) {
								console.log("Plan=>",plans);
								return plans;
					});
				};

				$scope.setPagingData = function(data, page, pageSize, total) {					
					$scope.plans = data;
					$scope.totalServerItems = total;
					console.log("DATA", $scope.plans);
					if (!$scope.$$phase) {
						$scope.$apply();
					}
				};

				$scope.loadPlansTable = function() {
					$scope.getPlansPagedDataAsync();
				};			

				$scope.loadPlansTable();
			};	
			*/
			
			$scope.initCreatePlan = function() {
				$scope.init();
				$scope.plan = {};
				$scope.plan.unlimited = false;
				$scope.plan.feature = [];
				$scope.index = 0;
								
				$scope.addPlan = function() {
					var products = [];
					$scope.plan.products = $scope.selectedProducts;

					var basePlans = Restangular.all('plans');					
					basePlans.post($scope.plan).then(function(data) {		
					    $scope.data = data;
					    $scope.status = data.meta.status + ": " + data.meta.msg;    
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
					    console.log("RES=>", response);
					    $scope.alerts = [];
						$scope.alerts.push({type: 'danger',
							msg: "Unable to add plan!"});
					  });					
				};

				$scope.addFeature();
			};
			
			$scope.initEditPlan = function() {
				$scope.init();
				var planId = $stateParams.planId;
				console.log("plan id from state param:" + planId);
				$scope.getPlan = function(planId) {
					var basePlan = Restangular.one('plans', planId);
					basePlan.get().then(function(plan) {
						console.log("get plan", plan);
						$scope.plan = plan;
						$scope.index = plan.feature.length - 1;
						$scope.selectedProducts = plan.products;
						//console.log("edit products", plan.products);
					}, function(rsp) {
						console.log(rsp);
					});
				};
				
				$scope.updatePlan = function() {
					var selecProducts = []
					
					var editPlan = Restangular.copy($scope.plan);
					editPlan.put().then(function(data) {
					    $scope.data = data;
					    //$scope.status = data.meta.status + ": " + data.meta.msg;    
					    if (data.meta.status == 200) {
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
							msg: "Unable to update plan!"});
					  });					
				};				
				$scope.getPlan(planId);			
			};

			$scope.addFeature = function() {
				$scope.plan.feature.push({});
				$scope.index++;
			};

			$scope.removeFeature = function() {
				if($scope.index > 0) {
					$scope.plan.feature.splice($scope.index, 1);
					$scope.index--;
				}
			};

			$scope.initAllProducts = function() {
				console.log("init plan products");
				var baseProducts = Restangular.all('products');
				baseProducts.getList().then(function(products) {
					console.log("plan products", products);
					$scope.allProducts = products;
					//return products;
				})
			};

			$scope.selectedProducts = [];

			$scope.productSelection = function(productId) {
				console.log("selected" , productId);
				var index = $scope.searchProduct(productId);
				
				if(index > -1) {
					$scope.selectedProducts.splice(index, 1);
				} else {
					var product = {};
					product.product = productId;
					$scope.selectedProducts.push(product);
				}
			};

			$scope.searchProduct = function(productId) {
				if($scope.selectedProducts.length > 0) {
					for(var i = 0; i < $scope.selectedProducts.length; i++) {
						if($scope.selectedProducts[i].product._id == productId) {
							return i;
						}
					}
				}	
				return -1;
			}
			
		});
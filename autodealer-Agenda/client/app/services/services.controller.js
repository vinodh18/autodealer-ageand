'use strict'; 

angular.module('autodealerApp').controller('ServicesCtrl',
				function($scope, $log, Restangular, dialogs, $stateParams, Auth) {
					$scope.params = {};
					$scope.init = function() {
						/*$scope.access = Auth.isManager();
						$scope.accessSales = Auth.isSales();
						$scope.currentUser = Auth.getCurrentUser();
						$scope.staff = Auth.isStaff();
						$scope.engineer = Auth.isEngineer();
						$scope.sales = Auth.isSales();
						$scope.customer = Auth.isCustomer();*/
						$scope.dateRange = {};
						$scope.dateRange.startDate = moment().subtract('days', 6);
						$scope.dateRange.endDate = moment();
						$scope.alerts = [];
						$scope.closeAlert = function(index) {
							$scope.alerts.splice(index, 1);
						};
				  $scope.ranges = {
			         'Today': [moment(), moment()],
			         'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
			         'Last 7 Days': [moment().subtract('days', 6), moment()],
			         'Last 30 Days': [moment().subtract('days', 29), moment()],
			         'This Month': [moment().startOf('month'), moment().endOf('month')],
			         'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
			      };
				};

		$scope.initDateRanges = function() {
			$scope.dateRange = {};
			$scope.dateRange.startDate = moment().subtract('days', 6);
			$scope.dateRange.endDate = moment();
		};

		// feed back
		$scope.initfeedback = function(){
			$scope.init();
			
			$scope.servicesfeed = [];
			 $scope.currentPage = 1,
			  $scope.numPerPage = 5,
			  $scope.maxSize = 4;

			var baseServices = Restangular.all('jobcards/feedback');
				baseServices.getList().then(function(services) {
					console.log("services", services);
				$scope.servicesfeed	= services;
				 $scope.totalItems = $scope.servicesfeed.length;
				console.log("$scope.servicesfeed", $scope.servicesfeed);

				 $scope.$watch('currentPage + numPerPage', function() {
					  	var begin = (($scope.currentPage - 1) * $scope.numPerPage)
					    , end = begin + $scope.numPerPage;
					    $scope.services = $scope.servicesfeed.slice(begin, end);
					  });
				});
			
				$scope.pageChanged = function(){
					console.log("page changed to +", $scope.currentPage);
				}
		
				 $scope.pageCount = function(){
					  	return Math.ceil($scope.servicesfeed.length / $scope.numPerPage);
					  	console.log("$scope.services.length", $scope.services.length);
					  	console.log("$scope.numPerPage", $scope.numPerPage);
					  }
					  $scope.pageCount();
		}

		/*$scope.reset =  function(){
			console.log("nxs", $scope.service.customer_vehicles._id);
			$scope.service.customer_vehicles._id = '';

		}*/

		// end feed back

			$scope.initServices = function() {
			 $scope.init();

			$scope.$watch('dateRange', function(dateRange) {								
				$scope.from_date = moment(dateRange.startDate._d).format('YYYY/MM/DD');
				$scope.to_date = moment(dateRange.endDate._d).format('YYYY/MM/DD');
				$scope.params.from_date = $scope.from_date;
				$scope.params.to_date = $scope.to_date;	
				console.log("From date :", $scope.from_date);
				console.log("To date :", $scope.to_date);
				$scope.getList();
			}, true);

			$scope.getList = function() {
			console.log("getList :",  $scope.params);
			$scope.getServicesPagedDataAsync($scope.params);
			};

						$scope.filterOptions = {
							filterText : "",
							useExternalFilter : true
						};
						$scope.getList = function() {
						  $scope.getServicesPagedDataAsync($scope.params);
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
								$scope.getServicesPagedDataAsync($scope.params);
							}, true);

						$scope.mySelection = [];

						$scope.gridOptions = {
							data : 'services',
							enablePaging : true,
							showFooter : true,
							totalServerItems : 'totalServerItems',
							pagingOptions : $scope.pagingOptions,
							filterOptions : $scope.filterOptions,
							selectedItems : $scope.mySelection,
							keepLastSelected: false,
							multiSelect: Auth.isManager() || Auth.isCustomer(),
							selectWithCheckboxOnly :Auth.isManager() || Auth.isCustomer(),
							showSelectionCheckbox :Auth.isManager() || Auth.isCustomer(),
							
						};

						$scope.isRequested = function(status){
							if(status === "REQUESTED" || status === "SCHEDULED")
								return true;
							else
								return false;
						}
					/*	$scope.isRequested = function(status){
							if(((status === "REQUESTED") && ($scope.currentUser.role !== "ENGINEER")) || ((status === 'SCHEDULED') && ($scope.currentUser.role == "MANAGER")))
								return true;
							else
								return false;
						}*/

						/*$scope.isScheduledORPendingORCompleted = function(status){
							if (!(status === "REQUESTED"))
								return true;
							else if (status === "REQUESTED"){
									if($scope.currentUser.role == "ENGINEER")
								return true;
						}else
								return false;
						}*/

						$scope.isScheduledORPendingORCompleted = function(status){
							/*if (((status === "REQUESTED") && ($scope.currentUser.role == "ENGINEER"))){
								return true;
							} else*/ 
							if(!(status === "REQUESTED" || status === "SCHEDULED"))
								return true;
								else
								return false;
						}



						/*$scope.isScheduledORPendingORCompleted = function(status){
							if ((status === "REQUESTED") && ($scope.currentUser.role == "ENGINEER")){
								return true;
							}
							if (($scope.currentUser.role == "MANAGER") && ((status === "SCHEDULED")))
							{
								return false;
							} 
							if(!(status ==="REQUESTED")){
								return true;

								
							}
							return false;
						}*/


						$scope.isScheduled = function(status){
							if (status === "SCHEDULED"){
							if(!( $scope.currentUser.role == "CUSTOMER"))
								return true;
								else
									return false;
							}
						}

						$scope.isCompleted = function(row){
							if (row.status === "COMPLETED" && !row.feedback){
								if($scope.currentUser.role == "CUSTOMER")
								return true;
								}
								else {
								return false;
								}
							}
							
						/*if(Auth.isManager() || Auth.isCustomer()){*/
						$scope.gridOptions.columnDefs = [
								{
									field : 'customer_vehicles.reg_no',
									displayName : 'Customer Vehicle Reg No'
								},{
									field : 'branch.name',
									displayName : 'Branch Name'
								},{
									field : 'status',
									displayName : 'Status'
								},{
									field : 'service_date',
									displayName : 'Service Date',
									cellFilter: 'date:\'dd/MM/yyyy \''
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
											+ '<a href="javascript:void(0)" ng-show="isScheduledORPendingORCompleted(row.entity.status)" ui-sref="^.view({serviceId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-primary" data-original-title="view">View</a>'
											
											+ '<a href="javascript:void(0)" ng-show="isRequested(row.entity.status)" ui-sref="^.edit({serviceId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a>'

											+ '<a href="javascript:void(0)" ng-show="isCompleted(row.entity)"  ng-controller="ServiceFeedbackCtrl" ng-click="open(row.entity)"'
											+ 'data-toggle="tooltip" title="feed back" style="margin-right:3px" class="btn btn-sm btn-success" data-original-title="Edit">'
											+ '<i class="fa fa-comment"> Feedback</i></a>'

											+ '<a href="javascript:void(0)" ng-show="isScheduled(row.entity.status)" ng-click = "completedRow(row)" data-toggle="tooltip" title=""'
											+ ' class="btn btn-success" data-original-title="Completed"><span>Completed</span></a>'

											+ '<a href="javascript:void(0)"'
											+ ' ng-click="deleteRow(row)" ng-show="access "  data-toggle="tooltip" title=""'
											+ ' class="btn btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'
								} ];

						$scope.completedRow = function(row) {
 							var service_details = [];
 							var serviceDetailsObj = {};
							for(var i=0; i < row.entity.service_details.length; i++){
								serviceDetailsObj = row.entity.service_details[i];
								console.log("serviceDetailsObj", serviceDetailsObj);
								serviceDetailsObj.service_type = serviceDetailsObj.service_type._id;
								 service_details.push(serviceDetailsObj);
							}

							console.log("completed msg:", row.entity);
							var serviceId = row.entity._id;
							row.entity.service_details = service_details;
							/*row.entity.dealer = row.entity.dealer._id;
							row.entity.customer_vehicles = row.entity.customer_vehicles._id;
							row.entity.branch = row.entity.branch._id;
							row.entity.user = row.entity.user._id;*/
							row.entity.user = row.entity.user._id;
							row.entity.status = "COMPLETED";
							console.log("row.entity", row.entity);
							var baseCompleted = Restangular.copy(row.entity);
							baseCompleted.put().then(function(data) {	
								$scope.loadServicesTable();
								if (data.meta.status == 200) {
									$scope.alerts = [];
									$scope.alerts.push({type: 'success', msg: data.meta.msg});
								} 
							}, function(rsp) {				
								console.log(rsp);
								$scope.alerts = [];
							});
						};

					/*}*/	/*else {						
							$scope.gridOptions.columnDefs = [
								{
									field : 'customer_vehicle.name',
									displayName : 'Customer_vehicle Name'
								},{
									field : 'branch.name',
									displayName : 'Branch Name'
								},{
									field : 'status',
									displayName : 'Status'
								},{
									field : 'service_date',
									displayName : 'Service Date',
									cellFilter: 'date:\'dd/MM/yyyy \''
								},
								{
									field : 'amount',
									displayName : 'Amount'
								},{
									field : '',
									displayName : 'Actions',
									sortable : false,
									cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
											+ '<a href="javascript:void(0)" ui-sref="^.view({serviceId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-primary" data-original-title="view"><i class="fa fa-file"> View</i></a></div></div>'
								}];
						}*/
						
//						delete function
						
						$scope.deleteRow = function(row) {
							console.log(row.entity);
							dialogs.confirm('Confirm',
									'Are you sure you want to delete?').result
									.then(function(btn) {
										console.log('yes');
										var serviceToDelete = row.entity;
										serviceToDelete.remove({
											
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
												$scope.loadServicesTable();
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
							var baseServices = Restangular.all('services');
							baseServices.customDELETE('', '', {'Content-Type': 'application/json'},
									{ids: $scope.mySelectionIds}).then(function(data) {
							    /*console.log("data:",data);*/
							    $scope.data = data;
							    $scope.status = data.meta.status + ": " + data.meta.msg;    
					    		
							    if (data.meta.status == 200) {
								    $scope.alerts = [];
							    	$scope.alerts.push({type: 'success',
										msg: data.meta.msg});
							    	$scope.loadServicesTable();
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
									msg: "Select Services to delete"});
					}
				};
						
//				get customer in index page
						
						$scope.getServicesPagedDataAsync = function(filters) {
							var pageSize = $scope.pagingOptions.pageSize;
							var page = $scope.pagingOptions.currentPage;
							var offset = (page - 1) * pageSize;
							var limit = $scope.pagingOptions.pageSize;
							$scope.getServices(filters, offset, limit).then(
									function(services) {
										$scope.setPagingData(services, page,
												pageSize, services.total);
									});
						};

						$scope.getServices = function(filters, offset, limit) {
							/*var path = Auth.isCustomer() ? 'services/users' 
					  					: 'services';*/
					  		var baseServices = Restangular.all('services');
							filters = filters ? filters : {};
							filters.offset = offset;
							filters.limit = limit;
							return baseServices.getList(filters).then(
									function(services) {
										return services;
									});
						};



						$scope.setPagingData = function(data, page, pageSize,
								total) {
							$scope.services = data;
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};

						$scope.loadServicesTable = function() {
							$scope.getServicesPagedDataAsync($scope.params);
						};

						/*$scope.closeAlert = function(index) {
							//console.log($scope.alert);
							//delete $scope.alert;
							$scope.alerts.splice(index, 1);
						};*/

						$scope.loadServicesTable();
					};
		//		get dropdown in CustomerVehicles, branch, dealer, service_type
					
					$scope.initAllCustomervehicle = function() {
						$scope.init();
						var basecustomervehicles = Restangular.all('customer-vehicles/all');
						return basecustomervehicles.getList(/*{
							customervehicles : $scope.customervehicles
						}*/).then(function(customervehicles) {
							console.log("customervehicles", customervehicles);
							$scope.allCustomervehicles = customervehicles;
							return customervehicles;
						});
					};

					$scope.initAllBranch = function() {
						$scope.init();
						var basebranches = Restangular.all('branches/all');
						return basebranches.getList(/*{
							customervehicles : $scope.customervehicles
						}*/).then(function(branches) {
							$scope.allBranches = branches;
							return branches;
						});
					};

					$scope.initAllDealer = function() {
						$scope.init();
						var basedealers = Restangular.all('dealers/all');
						return basedealers.getList(/*{
							customervehicles : $scope.customervehicles
						}*/).then(function(dealers) {
							$scope.allDealers = dealers;
							return dealers;
						});
					};
					
					$scope.initAllServicetypes = function() {
						$scope.init();
						var baseservicetypes = Restangular.all('service-types/all');
						return baseservicetypes.getList().then(function(servicetypes) {
							$scope.allServicetypes = servicetypes;
							return servicetypes;
						});
					};
					$scope.initAllUsers = function() {
						$scope.init();
						var baseuser = Restangular.all('users/all');
						return baseuser.getList().then(function(users) {
							$scope.allUsers = users;
							return users;
						});
					};

					$scope.initAllMake = function() {
						$scope.init();
						var basemakes = Restangular.all('makes/all');
						return basemakes.getList().then(function(makes) {
							$scope.allMakes = makes;
							return makes;
						});
					};

					$scope.initAllModel = function() {
						$scope.init();
						var basemodels = Restangular.all('models/all');
						return basemodels.getList().then(function(models) {
							$scope.allModels = models;
							return models;
						});
					};
					//get object values usin populate, chained select

				$scope.getServicetype = function(serviceTypeId) {
				for (var i = 0; i < $scope.allServicetypes.length; i++) {
					var serviceType = $scope.allServicetypes[i];
					if(serviceType._id === serviceTypeId) {
						return serviceType;
					}
				}
				return;
			}
			
			$scope.changeServicetypes = function(serviceTypeId, services) {
						$scope.init();
						var serviceType = $scope.getServicetype(serviceTypeId);
						/*console.log("serviceType", serviceType.amount);*/
						if(serviceType != null){
						services.amount = serviceType.amount;
					}else{
						services.amount = null;
					}
					};

				// add servicetype Amount in amount field
					$scope.calcAmount = function(){
						var sum = 0;
						for(var i=0; i < $scope.service.service_details.length; i++){
							 sum = sum + $scope.service.service_details[i].amount;
							console.log("amount", sum);
						}
						$scope.service.amount = sum;
					}
		// end chained select

//					create Services					
						$scope.initCreateService = function() {
						$scope.init();
						$scope.service = {};
						$scope.index = 0;
						$scope.service.service_details = [];
						$scope.service.customer_name= $scope.currentUser.name;
						$scope.service.customer_contact = $scope.currentUser.phone;
					
						$scope.addNewService = function() {
							$scope.service.service_details.push({});
							$scope.index++;
							$scope.newService=null;
						};
						$scope.deleteServiceType = function(index){
							$scope.service.service_details.splice(index, 1);
						}

						$scope.addService = function() {
							var baseServices = Restangular.all('services');
							if($scope.currentUser.role == "CUSTOMER"){
								$scope.service.status = "REQUESTED";
								$scope.service.user = $scope.currentUser._id;
							}else{
								$scope.service.status = "SCHEDULED"
							}

							/*console.log($scope.customer);*/
							baseServices.post($scope.service).then(
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
							$scope.addNewService();
						};
						
//						edit Service
						
						$scope.initEditService = function() {
//							console.log(row.entity);
							$scope.init();
							if($scope.currentUser.role == "CUSTOMER"){
								$scope.hide = false;
								}else{
									$scope.hide = true;
								}
							var serviceId = $stateParams.serviceId;
							console.log("service id :", $scope.serviceId);
							
												
							$scope.addNewService = function() {
							$scope.service.service_details.push({});
							$scope.index++;
							$scope.newService=null;
						};
						$scope.deleteServiceType = function(index){
							$scope.service.service_details.splice(index, 1);
						}

							$scope.getService = function(serviceId) {
							var baseService = Restangular.one('services', serviceId);
							 baseService.get().then(
								function(service){
									console.log("services", service);
									$scope.service = service;
									console.log("service details..", $scope.service.service_details[0].service_type);
									for(var i=0; i < $scope.service.service_details.length; i++){
									 $scope.service.service_details[i].service_type = $scope.service.service_details[i].service_type._id;
									}
									//$scope.service.service_details.service_type = $scope.service.service_details.service_type._id;
								}, function(rsp) {
									console.log(rsp);
								});
							};
							
//							update Service
								$scope.updateService = function() { 
								 // get user id because using populate in server
								 $scope.service.user = $scope.service.user._id;
									if($scope.currentUser.role == "CUSTOMER"){
									$scope.service.status = "REQUESTED";
									}else{
									$scope.service.status = "SCHEDULED";
									}
								var editService = Restangular.copy($scope.service);
								
								editService.put().then(
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
							$scope.getService(serviceId);
								
						};

	

//					Requested Services


						$scope.initRequest = function() {
						$scope.init();
						
						/*$scope.$watch('dateRange', function(dateRange) {								
							$scope.from_date = moment(dateRange.startDate._d).format('MM/DD/YYYY');
							$scope.to_date = moment(dateRange.endDate._d).format('MM/DD/YYYY');
							$scope.params.from_date = $scope.from_date;
							$scope.params.to_date = $scope.to_date;	
							console.log("From date :", $scope.from_date);
							console.log("To date :", $scope.params);
							$scope.getServices();
						}, true);*/
				
						
						
						$scope.alerts = [];
						$scope.params = {
							status : "REQUESTED"
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
											console.log(newVal);
											console.log(oldVal);
											if(newVal.currentPage !== oldVal.currentPage) {
												$scope.validateCurrentPage();
											}
											$scope.getServicesPagedDataAsync($scope.params);
										}, true);



						$scope.mySelection = [];

						$scope.gridOptions = {
							data : 'services',
							enablePaging : true,
							showFooter : true,
							totalServerItems : 'totalServerItems',
							pagingOptions : $scope.pagingOptions,
							filterOptions : $scope.filterOptions,
							selectedItems : $scope.mySelection,
							keepLastSelected: false,
							multiSelect: Auth.isCustomer() || Auth.isManager(),
							selectWithCheckboxOnly : Auth.isCustomer() || Auth.isManager(),
							showSelectionCheckbox : Auth.isCustomer() || Auth.isManager(),
						};
						/*if(Auth.isCustomer()){*/
						$scope.gridOptions.columnDefs = [
								{
									field : 'customer_vehicles.reg_no',
									displayName : 'Customer Vehicle Reg No'
								},{
									field : 'branch.name',
									displayName : 'Branch Name'
								},{
									field : 'status',
									displayName : 'Status'
								},{
									field : 'service_date',
									displayName : 'Service Date',
									cellFilter: 'date:\'dd/MM/yyyy \''
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
											+ '<a href="javascript:void(0)" ng-hide="sales" ui-sref="^.edit({serviceId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a>'

											/*+ '<a href="javascript:void(0)" ng-show="engineer" ui-sref="^.view({serviceId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-primary" data-original-title="View">View</a>'*/

											+ '<a href="javascript:void(0)"'
											+ ' ng-click="deleteRow(row)" ng-show="access || customer" data-toggle="tooltip" title=""'
											+ ' class="btn btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'
								}  ];
						/*}else if(Auth.isStaff() || Auth.isEngineer() || Auth.isManager){
							$scope.gridOptions.columnDefs = [
							 	
							 	{
									field : 'customer_vehicles.reg_no',
									displayName : 'Customer Vehicle Reg No'
								},{
									field : 'branch.name',
									displayName : 'Branch Name'
								},{
									field : 'status',
									displayName : 'Status'
								},{
									field : 'service_date',
									displayName : 'Service Date',
									cellFilter: 'date:\'dd/MM/yyyy \''
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
 											+ '<a href="javascript:void(0)" ui-sref="^.edit({serviceId: row.entity._id})"'
 											+' data-toggle="tooltip" title=""'
 											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a></div></div>'
 											
 								}];*/
		
		// 	click button to change status Requested To Scheduled

 							/*$scope.scheduleRow = function(row) {
 							var service_details = [];
 							var serviceDetailsObj = {};
								for(var i=0;i < row.entity.service_details.length; i++){
									serviceDetailsObj = row.entity.service_details[i];
									console.log("serviceDetailsObj", serviceDetailsObj);
									serviceDetailsObj.service_type = serviceDetailsObj.service_type._id;
									 service_details.push(serviceDetailsObj);
								}
							console.log("schedule msg:", row.entity);
							var serviceId = row.entity._id;
							row.entity.service_details = service_details;
							row.entity.dealer = row.entity.dealer._id;
							row.entity.customer_vehicles = row.entity.customer_vehicles._id;
							row.entity.branch = row.entity.branch._id;
							row.entity.status = "SCHEDULED";
							console.log("row.entity", row.entity);
							var baseSchedule = Restangular.copy(row.entity);
							baseSchedule.put().then(function(data) {	
								$scope.loadServicesTable();
								if (data.meta.status == 200) {
									$scope.alerts = [];
									$scope.alerts.push({type: 'success', msg: data.meta.msg});
								} 
							}, function(rsp) {				
								console.log(rsp);
								$scope.alerts = [];
							});
						};*/
					/*}*/
//  		
						
//			 delete function	
						$scope.deleteRow = function(row) {
							console.log(row.entity);
							dialogs.confirm('Confirm',
									'Are you sure you want to delete?').result
									.then(function(btn) {
										console.log('yes');
										var serviceToDelete = row.entity;
										serviceToDelete.remove({
										}).then(function(rsp) {
											console.log(rsp);
											
											if (rsp.meta.status == 200) {
												$scope.alerts = [];
												$scope.alerts.push({type: 'success',
														msg: rsp.meta.msg});
												
												$scope.loadServicesTable();
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


				//		multiple deletions
									
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
							
							var baseServices = Restangular.all('services');
							baseServices.customDELETE('', '', {'Content-Type': 'application/json'},
							{ids: $scope.mySelectionIds}).then(function(data) {
						    console.log("data:",data);
						    $scope.data = data;
						    $scope.status = data.meta.status + ": " + data.meta.msg;    
						    		
						    if (data.meta.status == 200) {
						    $scope.alerts = [];
					    	$scope.alerts.push({type: 'success',
							msg: data.meta.msg});
					    	$scope.loadServicesTable();
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
									msg: " Select Services to delete"});
					}
				};
								

						$scope.getServicesPagedDataAsync = function(filters) {
							var pageSize = $scope.pagingOptions.pageSize;
							var page = $scope.pagingOptions.currentPage;
							var offset = (page - 1) * pageSize;
							var limit = $scope.pagingOptions.pageSize;
							$scope.getServices(filters, offset, limit).then(
									function(services) {
										$scope.setPagingData(services, page,
												pageSize, services.total);
									});
						};

						$scope.getServices = function(filters, offset, limit) {
							/*var path = Auth.isStaff() || Auth.isEngineer? 'services' 
					  					: 'services/users';	*/
					  					/*var path = Auth.isCustomer()? 'services/users'
					  					: 'services';*/
							var baseServices = Restangular.all('services');
							filters = filters ? filters : {};
							filters.offset = offset;
							filters.limit = limit;
							return baseServices.getList(filters).then(
									function(services) {
										console.log(services);
										return services;
									});
						};

						$scope.setPagingData = function(data, page, pageSize, total) {
							/*
							 * var pagedData = data.slice((page - 1) * pageSize,
							 * page pageSize);
							 */
							$scope.services = data;
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};

						$scope.loadServicesTable = function() {
							$scope.getServicesPagedDataAsync($scope.params);
						};

						$scope.closeAlert = function(index) {
							//console.log($scope.alert);
							//delete $scope.alert;
							$scope.alerts.splice(index, 1);
						};

						$scope.loadServicesTable();
					};
					

//					Pending Services


						$scope.initPending = function() {
						$scope.init();
						
						/*$scope.$watch('dateRange', function(dateRange) {								
							$scope.from_date = moment(dateRange.startDate._d).format('MM/DD/YYYY');
							$scope.to_date = moment(dateRange.endDate._d).format('MM/DD/YYYY');
							$scope.params.from_date = $scope.from_date;
							$scope.params.to_date = $scope.to_date;	
							console.log("From date :", $scope.from_date);
							console.log("To date :", $scope.params);	
						}, true);
						*/
						
						$scope.alerts = [];
						$scope.params = {
							/*status : "PENDING"*/
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
											console.log(newVal);
											console.log(oldVal);
											if(newVal.currentPage !== oldVal.currentPage) {
												$scope.validateCurrentPage();
											}
											$scope.getServicesPagedDataAsync($scope.params);
										}, true);



						$scope.mySelection = [];

						$scope.gridOptions = {
							data : 'services',
							enablePaging : true,
							showFooter : true,
							totalServerItems : 'totalServerItems',
							pagingOptions : $scope.pagingOptions,
							filterOptions : $scope.filterOptions,
							selectedItems : $scope.mySelection,
							keepLastSelected: false,
							multiSelect: Auth.isManager(),
							selectWithCheckboxOnly : Auth.isManager(),
							showSelectionCheckbox : Auth.isManager(),
						};
						if(Auth.isCustomer() || Auth.isStaff() || Auth.isEngineer() || Auth.isManager()){
						$scope.gridOptions.columnDefs = [
								{
									field : 'customer_vehicles.reg_no',
									displayName : 'Customer Vehicle Reg No'
								},{
									field : 'branch.name',
									displayName : 'Branch Name'
								},{
									field : 'status',
									displayName : 'Status'
								},{
									field : 'service_date',
									displayName : 'Service Date',
									cellFilter: 'date:\'dd/MM/yyyy \''
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
											+ '<a href="javascript:void(0)" ui-sref="^.view({serviceId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-primary" data-original-title="view">View</a>'
											+ '<a href="javascript:void(0)"'
											+ ' ng-click="deleteRow(row)" ng-show="access "  data-toggle="tooltip" title=""'
											+ ' class="btn btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'
								}   ];
						}/*else{
							$scope.gridOptions.columnDefs = [
							 								{
									field : 'customer_vehicles.reg_no',
									displayName : 'Customer Vehicle Reg No'
								},{
									field : 'branch.name',
									displayName : 'Branch Name'
								},{
									field : 'status',
									displayName : 'Status'
								},{
									field : 'service_date',
									displayName : 'Service Date',
									cellFilter: 'date:\'dd/MM/yyyy \''
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
 											+ '<a href="javascript:void(0)" ui-sref="^.edit({invoiceId: row.entity._id})"'
 											+' data-toggle="tooltip" title=""'
 											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a></div></div>'
 								}];
						}*/
//  		
						
//			 delete function	
						$scope.deleteRow = function(row) {
							console.log(row.entity);
							dialogs.confirm('Confirm',
									'Are you sure you want to delete?').result
									.then(function(btn) {
										console.log('yes');
										var serviceToDelete = row.entity;
										serviceToDelete.remove({
										}).then(function(rsp) {
											console.log(rsp);
											
											if (rsp.meta.status == 200) {
												$scope.alerts = [];
												$scope.alerts.push({type: 'success',
														msg: rsp.meta.msg});
												
												$scope.loadServicesTable();
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


				//		multiple deletions
									
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
							
							var baseServices = Restangular.all('services');
							baseServices.customDELETE('', '', {'Content-Type': 'application/json'},
							{ids: $scope.mySelectionIds}).then(function(data) {
						    console.log("data:",data);
						    $scope.data = data;
						    $scope.status = data.meta.status + ": " + data.meta.msg;    
						    		
						    if (data.meta.status == 200) {
						    $scope.alerts = [];
					    	$scope.alerts.push({type: 'success',
							msg: data.meta.msg});
					    	$scope.loadServicesTable();
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
									msg: "Select Services to delete"});
					}
				};
								

						$scope.getServicesPagedDataAsync = function(filters) {
							var pageSize = $scope.pagingOptions.pageSize;
							var page = $scope.pagingOptions.currentPage;
							var offset = (page - 1) * pageSize;
							var limit = $scope.pagingOptions.pageSize;
							$scope.getServices(filters, offset, limit).then(
									function(services) {
										$scope.setPagingData(services, page,
												pageSize, services.total);
									});
						};

						$scope.getServices = function(filters, offset, limit) {
							/*var path = Auth.isCustomer() ? 'services/users' 
					  					: 'services';	*/
					  		console.log("pending get service");
							var baseServices = Restangular.all('services/pending');
							filters = filters ? filters : {};
							filters.offset = offset;
							filters.limit = limit;
							return baseServices.getList(filters).then(
									function(services) {
										console.log(services);
										return services;
									});
						};

						$scope.setPagingData = function(data, page, pageSize, total) {
							/*
							 * var pagedData = data.slice((page - 1) * pageSize,
							 * page pageSize);
							 */
							$scope.services = data;
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};

						$scope.loadServicesTable = function() {
							$scope.getServicesPagedDataAsync($scope.params);
						};

						$scope.closeAlert = function(index) {
							//console.log($scope.alert);
							//delete $scope.alert;
							$scope.alerts.splice(index, 1);
						};

						$scope.loadServicesTable();
					};

	
				//		Completed Service

						$scope.initCompleted = function() {
						$scope.init();
						
						$scope.$watch('dateRange', function(dateRange) {								
							$scope.from_date = moment(dateRange.startDate._d).format('MM/DD/YYYY');
							$scope.to_date = moment(dateRange.endDate._d).format('MM/DD/YYYY');
							$scope.params.from_date = $scope.from_date;
							$scope.params.to_date = $scope.to_date;	
							console.log("From date :", $scope.from_date);
							console.log("To date :", $scope.params);
							//$scope.getList();
						}, true);
				
						$scope.getList = function() {
						console.log("getList :",  $scope.params);
						$scope.getServicesPagedDataAsync($scope.params);
						};
						
						$scope.alerts = [];
						$scope.params = {
							status : "COMPLETED"
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
											console.log(newVal);
											console.log(oldVal);
											if(newVal.currentPage !== oldVal.currentPage) {
												$scope.validateCurrentPage();
											}
											$scope.getServicesPagedDataAsync($scope.params);
										}, true);


						$scope.mySelection = [];

						
							
						$scope.gridOptions = {
							data : 'services',
							enablePaging : true,
							showFooter : true,
							totalServerItems : 'totalServerItems',
							pagingOptions : $scope.pagingOptions,
							filterOptions : $scope.filterOptions,
							selectedItems : $scope.mySelection,
							keepLastSelected: false,
							multiSelect: Auth.isManager(),
							selectWithCheckboxOnly : Auth.isManager(),
							showSelectionCheckbox : Auth.isManager(),
						};
						/*if(Auth.isCustomer() || Auth.isStaff() || Auth.isEngineer() || Auth.isManager){*/

						$scope.isCompleted = function(row){
							if (row.status === "COMPLETED" && !row.feedback){
								if($scope.currentUser.role == "CUSTOMER")
								return true;
								}
								else {
								return false;
								}
							}
						$scope.gridOptions.columnDefs = [
								{
									field : 'customer_vehicles.reg_no',
									displayName : 'Customer Vehicle Reg No'
								},{
									field : 'branch.name',
									displayName : 'Branch Name'
								},{
									field : 'status',
									displayName : 'Status'
								},{
									field : 'service_date',
									displayName : 'Service Date',
									cellFilter: 'date:\'dd/MM/yyyy \''
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
											+ '<a href="javascript:void(0)" ng-hide="sales" ui-sref="^.view({serviceId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-primary" data-original-title="view">View</a>'
											+ '<a href="javascript:void(0)" ng-show="isCompleted(row.entity)" ng-controller="ServiceFeedbackCtrl" ng-click="open(row.entity)"'
											+ 'data-toggle="tooltip" title="feed back" style="margin-right:3px" class="btn btn-sm btn-success" data-original-title="Feedback">'
											+ '<i class="fa fa-comment"> Feedback</i></a>'
											+ '<a href="javascript:void(0)"'
											+ ' ng-click="deleteRow(row)" ng-show="access "  data-toggle="tooltip" title=""'
											+ ' class="btn btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'
											
								} ];
						/*}*//*else if(Auth.isStaff() || Auth.isEngineer() || Auth.isManager){
							$scope.gridOptions.columnDefs = [
							 	
							 	{
									field : 'customer_vehicles.reg_no',
									displayName : 'Customer Vehicle Reg No'
								},{
									field : 'branch.name',
									displayName : 'Branch Name'
								},{
									field : 'status',
									displayName : 'Status'
								},{
									field : 'service_date',
									displayName : 'Service Date',
									cellFilter: 'date:\'dd/MM/yyyy \''
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
 											+ '<a href="javascript:void(0)" ui-sref="^.edit({serviceId: row.entity._id})"'
 											+' data-toggle="tooltip" title=""'
 											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a></div></div>'
 								}];
	
					}*/
//  		
						
//			 delete function	
						$scope.deleteRow = function(row) {
							console.log(row.entity);
							dialogs.confirm('Confirm',
									'Are you sure you want to delete?').result
									.then(function(btn) {
										console.log('yes');
										var serviceToDelete = row.entity;
										serviceToDelete.remove({
										}).then(function(rsp) {
											console.log(rsp);
											
											if (rsp.meta.status == 200) {
												$scope.alerts = [];
												$scope.alerts.push({type: 'success',
														msg: rsp.meta.msg});
												
												$scope.loadServicesTable();
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


				//		multiple deletions
									
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
							
							var baseServices = Restangular.all('services');
							baseServices.customDELETE('', '', {'Content-Type': 'application/json'},
							{ids: $scope.mySelectionIds}).then(function(data) {
						    console.log("data:",data);
						    $scope.data = data;
						    $scope.status = data.meta.status + ": " + data.meta.msg;    
						    		
						    if (data.meta.status == 200) {
						    $scope.alerts = [];
					    	$scope.alerts.push({type: 'success',
							msg: data.meta.msg});
					    	$scope.loadServicesTable();
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
									msg: " Select Services to delete"});
					}
				};
								

						$scope.getServicesPagedDataAsync = function(filters) {
							var pageSize = $scope.pagingOptions.pageSize;
							var page = $scope.pagingOptions.currentPage;
							var offset = (page - 1) * pageSize;
							var limit = $scope.pagingOptions.pageSize;
							$scope.getServices(filters, offset, limit).then(
									function(services) {
										$scope.setPagingData(services, page,
												pageSize, services.total);
									});
						};

						$scope.getServices = function(filters, offset, limit) {
							/*var path = Auth.isStaff() || Auth.isEngineer? 'services' 
					  					: 'services/users';	*/
					  					/*var path = Auth.isCustomer()? 'services/users'
					  					: 'services';*/
							var baseServices = Restangular.all('services');
							filters = filters ? filters : {};
							filters.offset = offset;
							filters.limit = limit;
							return baseServices.getList(filters).then(
									function(services) {
										console.log(services);
										return services;
									});
						};

						$scope.setPagingData = function(data, page, pageSize, total) {
							/*
							 * var pagedData = data.slice((page - 1) * pageSize,
							 * page pageSize);
							 */
							$scope.services = data;
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};

						$scope.loadServicesTable = function() {
							$scope.getServicesPagedDataAsync($scope.params);
						};

						$scope.closeAlert = function(index) {
							//console.log($scope.alert);
							//delete $scope.alert;
							$scope.alerts.splice(index, 1);
						};

						$scope.loadServicesTable();
					};

//					Schedule Services


						$scope.initSchedule = function() {
						$scope.init();
						
						/*$scope.$watch('dateRange', function(dateRange) {								
							$scope.from_date = moment(dateRange.startDate._d).format('YYYY/MM/DD');
							$scope.to_date = moment(dateRange.endDate._d).format('YYYY/MM/DD');
							$scope.params.from_date = $scope.from_date;
							$scope.params.to_date = $scope.to_date;	
							console.log("From date :", $scope.from_date);
							console.log("To date :", $scope.to_date);
							$scope.getList();
						}, true);
						
						$scope.getList = function() {
							console.log("getList :",  $scope.params);
							$scope.getServicesPagedDataAsync($scope.params);
						};*/
						
						$scope.alerts = [];
						$scope.params = {
							status : "SCHEDULED"
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
											console.log(newVal);
											console.log(oldVal);
											if(newVal.currentPage !== oldVal.currentPage) {
												$scope.validateCurrentPage();
											}
											$scope.getServicesPagedDataAsync($scope.params);
										}, true);



						$scope.mySelection = [];

						$scope.gridOptions = {
							data : 'services',
							enablePaging : true,
							showFooter : true,
							totalServerItems : 'totalServerItems',
							pagingOptions : $scope.pagingOptions,
							filterOptions : $scope.filterOptions,
							selectedItems : $scope.mySelection,
							keepLastSelected: false,
							multiSelect: Auth.isManager(),
							selectWithCheckboxOnly : Auth.isManager(),
							showSelectionCheckbox : Auth.isManager(),
						};
						if(Auth.isStaff() || Auth.isEngineer() || Auth.isManager){
						$scope.gridOptions.columnDefs = [
								{
									field : 'customer_vehicles.reg_no',
									displayName : 'Customer Vehicle Reg No'
								},{
									field : 'branch.name',
									displayName : 'Branch Name'
								},{
									field : 'status',
									displayName : 'Status'
								},{
									field : 'service_date',
									displayName : 'Service Date',
									cellFilter: 'date:\'dd/MM/yyyy \''
								},
								{
									field : 'scheduled_at',
									displayName : 'Scheduled Date',
									cellFilter: 'date:\'dd/MM/yyyy \''
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
											+ '<a href="javascript:void(0)" ng-hide="access || engineer || staff" ui-sref="^.view({serviceId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-primary" data-original-title="view">View</a>'
											
											+ '<a href="javascript:void(0)" ng-show="access || engineer || staff" ui-sref="^.edit({serviceId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="view"><i class="fa fa-pencil"></i></a>'
											
											+ '<a href="javascript:void(0)" ng-show="staff || access || engineer" ng-click = "completedRow(row)" data-toggle="tooltip" title=""'
											+ ' class="btn btn-success" data-original-title="Completed"><span>Completed</span></a>'
											+ '<a href="javascript:void(0)"'
											+ ' ng-click="deleteRow(row)" ng-show="access" data-toggle="tooltip" title=""'
											+ ' class="btn btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'
								}];
						$scope.completedRow = function(row) {
 							var service_details = [];
 							var serviceDetailsObj = {};
							for(var i=0; i < row.entity.service_details.length; i++){
								serviceDetailsObj = row.entity.service_details[i];
								console.log("serviceDetailsObj", serviceDetailsObj);
								serviceDetailsObj.service_type = serviceDetailsObj.service_type._id;
								 service_details.push(serviceDetailsObj);
							}

							console.log("completed msg:", row.entity);
							var serviceId = row.entity._id;
							row.entity.service_details = service_details;
							/*row.entity.dealer = row.entity.dealer._id;
							row.entity.customer_vehicles = row.entity.customer_vehicles._id;
							row.entity.branch = row.entity.branch._id;
							row.entity.user = row.entity.user._id;*/
							row.entity.user = row.entity.user._id;
							row.entity.status = "COMPLETED";
							console.log("row.entity", row.entity);
							var baseCompleted = Restangular.copy(row.entity);
							baseCompleted.put().then(function(data) {	
								$scope.loadServicesTable();
								if (data.meta.status == 200) {
									$scope.alerts = [];
									$scope.alerts.push({type: 'success', msg: data.meta.msg});
								} 
							}, function(rsp) {				
								console.log(rsp);
								$scope.alerts = [];
							});
						};
						}/*else{
							$scope.gridOptions.columnDefs = [
							 								{
									field : 'customer_vehicles.reg_no',
									displayName : 'Customer Vehicle Reg No'
								},{
									field : 'branch.name',
									displayName : 'Branch Name'
								},{
									field : 'status',
									displayName : 'Status'
								},{
									field : 'service_date',
									displayName : 'Service Date',
									cellFilter: 'date:\'dd/MM/yyyy \''
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
 											+ '<a href="javascript:void(0)" ui-sref="^.edit({serviceId: row.entity._id})"'
 											+' data-toggle="tooltip" title=""'
 											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a></div></div>'
 								}];
						}*/
//  		
						
//			 delete function	
						$scope.deleteRow = function(row) {
							console.log(row.entity);
							dialogs.confirm('Confirm',
									'Are you sure you want to delete?').result
									.then(function(btn) {
										console.log('yes');
										var serviceToDelete = row.entity;
										serviceToDelete.remove({
										}).then(function(rsp) {
											console.log(rsp);
											
											if (rsp.meta.status == 200) {
												$scope.alerts = [];
												$scope.alerts.push({type: 'success',
														msg: rsp.meta.msg});
												
												$scope.loadServicesTable();
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


				//		multiple deletions
									
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
							
							var baseServices = Restangular.all('services');
							baseServices.customDELETE('', '', {'Content-Type': 'application/json'},
							{ids: $scope.mySelectionIds}).then(function(data) {
						    console.log("data:",data);
						    $scope.data = data;
						    $scope.status = data.meta.status + ": " + data.meta.msg;    
						    		
						    if (data.meta.status == 200) {
						    $scope.alerts = [];
					    	$scope.alerts.push({type: 'success',
							msg: data.meta.msg});
					    	$scope.loadServicesTable();
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
									msg: "Select Services to delete"});
					}
				};
								

						$scope.getServicesPagedDataAsync = function(filters) {
							var pageSize = $scope.pagingOptions.pageSize;
							var page = $scope.pagingOptions.currentPage;
							var offset = (page - 1) * pageSize;
							var limit = $scope.pagingOptions.pageSize;
							$scope.getServices(filters, offset, limit).then(
									function(services) {
										$scope.setPagingData(services, page,
												pageSize, services.total);
									});
						};

						$scope.getServices = function(filters, offset, limit) {
							/*var path = Auth.isStaff() || Auth.isEngineer ? 'services' 
					  					: 'services/users';	*/
							var baseServices = Restangular.all('services');
							filters = filters ? filters : {};
							filters.offset = offset;
							filters.limit = limit;
							return baseServices.getList(filters).then(
									function(services) {
										console.log(services);
										return services;
									});
						};

						$scope.setPagingData = function(data, page, pageSize, total) {
							/*
							 * var pagedData = data.slice((page - 1) * pageSize,
							 * page pageSize);
							 */
							$scope.services = data;
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};

						$scope.loadServicesTable = function() {
							$scope.getServicesPagedDataAsync($scope.params);
						};

						$scope.closeAlert = function(index) {
							//console.log($scope.alert);
							//delete $scope.alert;
							$scope.alerts.splice(index, 1);
						};

						$scope.loadServicesTable();
					};
					
				});
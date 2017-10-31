'use strict';

angular.module('autodealerApp')
  .controller('EmailtemplatesCtrl', function ($scope, Restangular, dialogs, $stateParams, Auth) {
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
		$scope.initAllEmailTemplates();
	}

	$scope.reset = function(){
		$scope.params = {};
		$scope.initAllEmailTemplates();
	}
	$scope.initEmailTemplates = function(){
		$scope.init();

		$scope.filterOptions = {
			filterText : "",
			useExternalFilter : true
		}
		$scope.initAllEmailTemplates = function(){
			$scope.currentPage = 1;
			$scope.numPerPage = 20;
			$scope.maxPages = 4;

			var baseEmailTemplates = Restangular.all('email-templates');
				baseEmailTemplates.getList().then(function(response){
					$scope.emailTemplates = response;
					//$scope.emailTemplates = $scope.emailTemplates.length;

			$scope.$watch('currentPage + numPerPage', function(){
				if($scope.currentPage > 0){
					var filters = {};
					$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
						filters.offset = $scope.offset;
						filters.limit = $scope.numPerPage;

						$scope.params.offset = filters.offset;
						$scope.params.limit = filters.limit;
						var baseEmailTemplates = Restangular.all('email-templates');
						baseEmailTemplates.getList($scope.params).then(function(response){
							$scope.emailTemplates = response;
							$scope.total = $scope.emailTemplates.length;
						})
				}
			});
		});
		}
	}

		// single delete
			$scope.deleteEmailTemplates = function(row){
				$scope.init();
				var id = row;
				console.log("id", row);
				dialogs.confirm('Confirm', 'Are you want to delete?').result
				.then(function(btn){
					console.log('yes');
					var baseEmailTemplates = Restangular.one('email-templates', id);
					baseEmailTemplates.remove().then(function(rsp){
						if(rsp.meta.status == 200){
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
							$scope.initAllEmailTemplates();
						}else{
							$scope.alerts = [];
							$scope.alerts.push({type: 'danger', msg: rsp.meta.msg});
						}
					});
				});
			}


	/*$scope.initEmailTemplates = function() {
				
			$scope.init();				
			$scope.params = {};
			
			$scope.searchEmailTemplates = function(){					
				$scope.getEmailTemplatesPagedDataAsync($scope.params);
			};
			
			$scope.resetEmailTemplates = function(){					
				$scope.params.name = '';
				$scope.getEmailTemplatesPagedDataAsync($scope.params);
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
			
			$scope
					.$watch(
							'pagingOptions',
							function(newVal, oldVal) {
								console.log(newVal);
								console.log(oldVal);
								if((newVal.currentPage !== oldVal.currentPage)
					 			 || (newVal.pageSize !== oldVal.pageSize)) {
									$scope.validateCurrentPage();
									$scope.getEmailTemplatesPagedDataAsync($scope.params);
								}
																	
							}, true);				

			$scope.mySelection = [];

			$scope.gridOptions = {
				data : 'emailTemplates',
				enablePaging : true,
				showFooter : true,
				totalServerItems : 'totalServerItems',
				pagingOptions : $scope.pagingOptions,
				filterOptions : $scope.filterOptions,
				selectedItems : $scope.mySelection,
				keepLastSelected: false,
				multiSelect: true,
				selectWithCheckboxOnly : true,
				showSelectionCheckbox : true,					
			};

			$scope.gridOptions.columnDefs = [
					{
						field : 'name',
						displayName : 'Name'
					},
					{
						field : 'subject',
						displayName : 'Subject'
					},
					{
						field : 'body',
						displayName : 'Body'
					},											
					{
						field : '',
						displayName : 'Actions',
						sortable : false,
						cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
								+ '<a href="javascript:void(0)" ui-sref="^.edit({emailTemplateId: row.entity._id})"' 
								+ ' data-toggle="tooltip" title=""'
								+ ' class="btn btn-sm btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a>'
								+ '<a href="javascript:void(0)"'
								+ ' ng-click="deleteRow(row)" data-toggle="tooltip" title=""'
								+ ' class="btn btn-sm btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'
					}
					];

			$scope.deleteRow = function(row) {
				console.log(row.entity);
				dialogs.confirm('Confirm',
						'Are you sure you want to delete?').result
						.then(function(btn) {
							console.log('yes');
							var emailTemplateToDelete = row.entity;
							emailTemplateToDelete.remove({
								_id : emailTemplateToDelete._id
							}).then(function(rsp) {
								console.log(rsp);
								if (rsp.meta.status == 200) {
									$scope.alerts = [];
									$scope.alerts.push({type: 'success',
											msg: rsp.meta.msg});
									$scope.loadEmailTemplatesTable();
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

			$scope.viewRow = function(row) {
				console.log(row.entity);
			};
			
			$scope.multiDelete = function(){
				$scope.init();
				if($scope.mySelection.length >= 1){					
					$scope.mySelectionIds = [];
					for(var i=0; i < $scope.mySelection.length; i++){
						$scope.mySelectionIds[i] = $scope.mySelection[i]._id;
					}
					console.log("Array of ids:", $scope.mySelectionIds);
					dialogs.confirm('Confirm',
					'Are you sure you want to delete?').result
					.then(function(btn) {
						console.log('yes');						
					var baseEmailTemplates = Restangular.all('email-templates');
					baseEmailTemplates.customDELETE('', '', {'Content-Type': 'application/json'},
							{ids: $scope.mySelectionIds}).then(function(data) {
					    console.log(data);
					    $scope.data = data;
					    $scope.status = data.meta.status + ": " + data.meta.msg;    
			    		
					    if (data.meta.status == 200) {
						    $scope.alerts = [];
					    	$scope.alerts.push({type: 'success',
								msg: data.meta.msg});
					    	$scope.loadEmailTemplatesTable();
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
				}else{
					$scope.alerts = [];
					$scope.alerts.push({type: 'danger',
								msg: "Select email templates to delete"});
				}
		};
			$scope.getEmailTemplatesPagedDataAsync = function(filters) {
				var pageSize = $scope.pagingOptions.pageSize;
				var page = $scope.pagingOptions.currentPage;
				var offset = (page - 1) * pageSize;
				var limit = $scope.pagingOptions.pageSize;
				$scope.getEmailTemplates(filters, offset, limit).then(
						function(emailTemplates) {
							$scope.setPagingData(emailTemplates, page,
									pageSize, emailTemplates.total);
						});
			};

			$scope.getEmailTemplates = function(filters, offset, limit) {
				var baseEmailTemplates = Restangular.all('email-templates');
				filters = filters ? filters : {};
				filters.offset = offset;
				filters.limit = limit;
				return baseEmailTemplates.getList(filters).then(
						function(emailTemplates) {
							console.log(emailTemplates);
							return emailTemplates;
						});
			};

			$scope.setPagingData = function(data, page, pageSize,
					total) {
				$scope.emailTemplates = data;
				$scope.totalServerItems = total;
				if (!$scope.$$phase) {
					$scope.$apply();
				}
			};

			$scope.loadEmailTemplatesTable = function() {
				$scope.getEmailTemplatesPagedDataAsync($scope.params);
			};				

			$scope.loadEmailTemplatesTable();												
		};*/

		$scope.initCreateEmailTemplate = function() {
				$scope.init();
				$scope.emailTemplate = {};				
				
				$scope.addEmailTemplate = function(isValid) {
					if(isValid) {
						var baseEmailTemplates = Restangular.all('email-templates');
						console.log($scope.emailTemplate);
						baseEmailTemplates.post($scope.emailTemplate).then(function(data) {
						    console.log(data);
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
						    console.log(response);
						    $scope.alerts = [];
						    $scope.alerts.push({type: 'danger',
								msg: "Unable to add!"});
						  });
					}
					
				};
			};
			
			$scope.initEditEmailTemplate = function() {
				$scope.init();				
				var emailTemplateId = $stateParams.emailTemplateId;
				
				$scope.getEmailTemplate = function(emailTemplatetId) {
					var baseEmailTemplate = Restangular.one('email-templates', emailTemplateId);
					baseEmailTemplate.get().then(function(emailTemplate) {
						console.log(emailTemplate);
						$scope.emailTemplate = emailTemplate;
					}, function(rsp) {
						console.log(rsp);
					});
				};
				
				$scope.updateEmailTemplate = function() {
					var editEmailTemplate = Restangular.copy($scope.emailTemplate);
					editEmailTemplate.put().then(function(data) {
						console.log(data);
						$scope.data = data;						
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
							msg: "Unable to update!"});
					});
				};
				
				
				$scope.getEmailTemplate(emailTemplateId);
			};

  });
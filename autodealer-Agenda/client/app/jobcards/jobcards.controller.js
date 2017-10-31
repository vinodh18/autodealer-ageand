'use strict'; 

angular.module('autodealerApp')
	.controller('JobcardsCtrl',function($scope, Restangular, dialogs, $stateParams, Auth) {
		
	$scope.init = function() {	
		$scope.params = {};
		$scope.alerts = [];
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
	};

	if(!Auth.isSuperAdmin()){
		$scope.createJobcardAccess = true;	
	}

	if(Auth.isBranchAdmin() || Auth.isStaff() || Auth.isCustomer()){
		$scope.deleteAction = false;
	}else{
		$scope.deleteAction = true;
	}

	if(Auth.isStaff() || Auth.isCustomer()){
		$scope.staffOrCustomer = true;
	}	

	if(Auth.isCustomer()){
		$scope.isCustomer = true;
	}	

	$scope.formatNumber = function(num) {
		if(num){
    		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    	}
	};

	$scope.jobCardStatus = function(status){				
		if(status == 'PAID'){
			return 'success';
		}else if(status == 'PAYMENT_DUE'){
			return 'danger';				
		}else if(status == 'SCHEDULED'){
			return 'primary';				
		}else if(status == 'INPROGRESS'){
			return 'info';
		}else{
			return 'dark';
		}
	};

	$scope.pickup = function(pickup){
		if(pickup == 'Y'){
			console.log("pickup", pickup);
			return 'green';
		}else{
			return 'red';
		}
	}
	$scope.drop = function(drop){
		if(drop == 'Y'){
			return 'green';
		}else{
			return 'red';
		}
	}

	$scope.isValidCustomer 	= false;	

	$scope.check = function(){
		if($scope.isValidCustomer){ 			
			return false;
		}else{
			return true;				
		}
	}

	$scope.getCustomerVehicle = function(customerId){
		console.log('customerId', customerId);
		var basecustomervehicles = Restangular.all('customer-vehicles/all');
		return basecustomervehicles.getList({
			customer : customerId
		}).then(function(customervehicles) {			
			$scope.allCustomervehicles = customervehicles;
			return customervehicles;
		});

	};

	$scope.refreshCustomer = function(customer){		
		$scope.init();
		if(customer && (customer.length > 2 )){				
			var baseCustomers = Restangular.all('customers/all');
			return baseCustomers.getList({name: customer}).then(function(customers) {				
				if(customers.length === 0){									
					$scope.jobcardsForm.$invalid = true;
					$scope.customerNotFound = true;
					$scope.isValidCustomer 	= false;
					return;
				}else{
					$scope.allCustomers = customers;
					$scope.customerNotFound = false;
					$scope.isValidCustomer 	= true;
					return;
				}					
			});				
		}else{
			$scope.initAllCustomers();			
		}		
	};

	$scope.initJobcards = function(){
		$scope.init();
		$scope.currentPage = 1;
		$scope.numPerPage = 20;
		$scope.maxSize = 4;
		
	$scope.initAllJobcards = function(){
		var baseJobcards = Restangular.all('jobcards');
			baseJobcards.getList($scope.params).then(function(jobcards) {
			$scope.totalJobcards = jobcards.length;							

	 		$scope.$watch('currentPage + numPerPage', function() {
	 			if($scope.currentPage > 0){
	 				var filters = {};
	 				$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
	 				filters.offset = $scope.offset;
					filters.limit = $scope.numPerPage;
					$scope.params.offset = filters.offset;
					$scope.params.limit = filters.limit;
					if(!Auth.isDealerAdmin()){
						filters.branch = '';
					}else{
						filters.branch = Auth.getCurrentUser().branch;
					}
					var baseJobcards = Restangular.all('jobcards');
					return baseJobcards.getList($scope.params).then(function(jobcards) {
						$scope.jobcards = jobcards;
						return jobcards;
						});
	 				}						  		
				});
			});
		};
	};

	$scope.deleteJobcard = function(row){
		var id = row;
		dialogs.confirm('Confirm','Are you sure you want to delete?').result
		.then(function(btn){
			console.log('yes');
			var baseJobcards = Restangular.one('jobcards', id);
			baseJobcards.remove().then(function(rsp){
				if(rsp.meta.status == 200){
					$scope.alerts = [];
					$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
					console.log("deletes");
					$scope.initAllJobcards();
				}else{
					$scope.alerts = [];
					$scope.alerts.push({type: 'danger', msg: rsp.meta.msg});
				}
			});
		});
	};

	$scope.initEditJobcard = function(){
		var jobCardId = $stateParams.jobcardId;

		$scope.getJobcard = function(customerId) {
			var baseServicetype = Restangular.one('jobcards', jobCardId);
			baseServicetype.get().then(function(rspData){
				console.log('rspData', rspData);
				$scope.jobcards = rspData.service;
				$scope.jobcardmaster = rspData.service.job_card;
			},function(rsp) {
				console.log(rsp);
			});
		};

		$scope.addNewJobCard = function(){
			$scope.jobcards.job_card.push({});
			$scope.index++;
		}
		
		$scope.removeJobcard = function(index){
			$scope.jobcards.job_card.splice(index, 1);
		}		

		$scope.updateJobcard = function() {
				$scope.jobcards.customer = $scope.jobcards.customer._id;
				$scope.jobcards.customer_vehicle = $scope.jobcards.customer_vehicle._id;
				var editJobcard = Restangular.copy($scope.jobcards);				
				editJobcard.route = 'jobcards';				
				editJobcard.put().then(function(data) {					
					$scope.jobcards = data.service;					
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

			$scope.getJobcard(jobCardId);

	};

	$scope.initViewJobCard = function() {			
		var jobCardId = $stateParams.jobcardId;
		var partsSubTotal = 0;
		var labourSubTotal = 0;
		var accessoriesSubTotal = 0;					
		var miscSubTotal = 0;

		$scope.inprogressJobcard = function(jobCard){
			console.log("inprogress jobCard", jobCard);
			
	        var baseJobcardChangeStatus = Restangular.one('jobcards/'+ jobCard +'/inprogress-status');	        
	        baseJobcardChangeStatus.put().then(function(data) { 
	          console.log("rsp data:", data);         
	          if (data.meta.status == 200) {
	          	$scope.getJobCard(jobCard);
	            $scope.alerts = [];
	            $scope.alerts.push({type: 'success',
	              msg: "Status changed successfully"});
	          } else {
	            $scope.alerts = [];
	            $scope.alerts.push({type: 'danger',
	              msg: data.meta.msg});
	          }          
	        }, function(response) {
	            console.log(response);
	            $scope.alerts = [];
	            $scope.alerts.push({type: 'danger',
	              msg: "Unable to change Status!"});
	         });
		};

		$scope.completeJobcard = function(jobCard){
			console.log("complete jobCard", jobCard);
			var baseJobcardChangeStatus = Restangular.one('jobcards/'+ jobCard +'/complete-status');	        
	        baseJobcardChangeStatus.put().then(function(data) { 
	          console.log("rsp data:", data);         
	          if (data.meta.status == 200) {
	          	$scope.getJobCard(jobCard);
	            $scope.alerts = [];
	            $scope.alerts.push({type: 'success',
	              msg: "Status changed successfully"});
	          } else {
	            $scope.alerts = [];
	            $scope.alerts.push({type: 'danger',
	              msg: data.meta.msg});
	          }          
	        }, function(response) {
	            console.log(response);
	            $scope.alerts = [];
	            $scope.alerts.push({type: 'danger',
	              msg: "Unable to change Status!"});
	         });
		};

		$scope.getJobCard = function(jobCardId) {

			var baseServicetype = Restangular.one('jobcards', jobCardId);
			baseServicetype.get().then(function(rspData){
				var jobCard = rspData.service;
				$scope.warrantyType = rspData.warranty_type;
				$scope.jobCard = jobCard;
				$scope.customerDetails = jobCard.customer;
				$scope.customerVehicle = jobCard.customer_vehicle;
				$scope.customerVehicleType = jobCard.customer_vehicle.vehicle_type;

				//Calculate parts items sub total
				$scope.parts = jobCard.parts;
				for(var i=0; i < $scope.parts.items.length; i++){
					partsSubTotal = partsSubTotal + $scope.parts.items[i].amt;
				}
				$scope.partsSubTotal = partsSubTotal;
				console.log('parts', $scope.parts);
				//Calculate labourCharges items sub total
				$scope.labour_charges = jobCard.labour_charges;
				for(var i=0; i < $scope.labour_charges.items.length; i++){
					labourSubTotal = labourSubTotal + $scope.labour_charges.items[i].rate;
				}
				$scope.labourSubTotal = labourSubTotal;

				//Calculate accessories items sub total
				$scope.accessories = jobCard.accessories;
				for(var i=0; i < $scope.accessories.items.length; i++){
					accessoriesSubTotal = accessoriesSubTotal + $scope.accessories.items[i].rate;
				}
				$scope.accessoriesSubTotal = accessoriesSubTotal;

				//Calculate misc_charges items sub total
				$scope.misc_charges = jobCard.misc_charges;
				for(var i=0; i < $scope.misc_charges.items.length; i++){
					miscSubTotal = miscSubTotal + $scope.misc_charges.items[i].rate;
				}
				$scope.miscSubTotal = miscSubTotal;

				var baseMake = Restangular.one('dealers/'+$scope.jobCard.dealer._id+'/make/'+$scope.jobCard.customer_vehicle.make);
				baseMake.get().then(function(rspData){						
					$scope.make = rspData.make;

					var baseModel = Restangular.one('dealers/'+$scope.jobCard.dealer._id+'/make/'+$scope.jobCard.customer_vehicle.make+'/model/'+$scope.jobCard.customer_vehicle.model);
					baseModel.get().then(function(rspData){						
						$scope.modelImgURL = rspData.model.img_url;							
						$scope.model = rspData.model;
					},function(rsp) {
						console.log(rsp);
					});

				},function(rsp) {
					console.log(rsp);
				});

			}, function(rsp) {
				console.log(rsp);
			});
		};

		$scope.getJobCard(jobCardId);
	};

	/*$scope.selectedJCMaster = function(jobCardMaster, index){
		console.log('jobCardMaster', jobCardMaster);
		$scope.checkJobCard[index] = true;
	};*/

	/* selectedJCMaster */
	$scope.selectedJCMaster = [];
	$scope.checkJobCard =[];
	$scope.JCMcomments = [];

	$scope.JCMasterSelection = function(jobcardmaster, index) {
			$scope.checkJobCard[index] = true;
			var value = $scope.searchJCMaster(jobcardmaster.desc);
			console.log("value" , value);
			if(value > -1) {
				$scope.selectedJCMaster.splice(value, 1);
				$scope.checkJobCard[index] = false;
			} else {					
				$scope.selectedJCMaster.push({desc: jobcardmaster.desc});
			}

			console.log("selectedJCMaster", $scope.selectedJCMaster);				
	};		

	$scope.searchJCMaster = function(desc) {		                       
        if($scope.selectedJCMaster.length > 0) {                  
            for(var i = 0; i < $scope.selectedJCMaster.length; i++) {                     
                if($scope.selectedJCMaster[i]){
                    if(typeof desc === 'string' && $scope.selectedJCMaster[i].desc == desc){
                        return i;
                    }else if(typeof desc === 'object' && $scope.selectedJCMaster[i].desc == desc.desc){
                    	return i;
                    }
                }   
            }
        }   
        return -1;
    }  
	/* end */

	// create jobCard 
	$scope.initcreateJobcard = function(){		
		$scope.init();
		$scope.LimitExceeds = false;
		$scope.checkJobCard = [];
		$scope.jobcards = {};
		$scope.jobcards.parts = {};
		$scope.jobcards.labour_charges = {};
		$scope.jobcards.accessories = {};
		$scope.jobcards.misc_charges = {};
		
		$scope.jobcards.service_date = moment().format("DD-MMM-YYYY");
		$scope.jobcards.pick_up = "N";
		$scope.jobcards.drop = "N";
		$scope.jobcards.job_status = "SCHEDULED";

		$scope.index = 0;
		$scope.count = 0;
		$scope.add= 0;
		$scope.accCount = 0;
		$scope.miscCount = 0;
		$scope.postCount = 0;

		$scope.jobcards.job_card = [];
		$scope.jobcards.parts.items = [];
		$scope.jobcards.labour_charges.items = [];
		$scope.jobcards.accessories.items = [];
		$scope.jobcards.misc_charges.items = [];
		$scope.jobcards.post_service_complaints = [];

		// Begin of checkLimit Exceeds
		var planLimit = Auth.getCurrentUser().dealer.plan.plan_limits;			
		var baseJobcards = Restangular.all('jobcards');
		baseJobcards.getList().then(function(jobcards){				
			if(jobcards.total < planLimit.job_cards){
				$scope.LimitExceeds = false;				
			}else{
				$scope.LimitExceeds = true;
				$scope.alerts.push({type: 'danger',msg: 'Plan Limit Exceeds To Create New Job Card'});				
			}	
		});			
		// End of checkLimit Exceeds



		$scope.addNewJobCard = function(){
			$scope.jobcards.job_card.push({});
			$scope.index++;
		}
		$scope.removeJobcard = function(index){
			$scope.jobcards.job_card.splice(index, 1);
		}
		
		$scope.addNewPartsItems = function(){
			$scope.jobcards.parts.items.push({});
			$scope.count++;
		}
		$scope.removePartsItems = function(count){
			$scope.jobcards.parts.items.splice(count, 1);
		}

		$scope.addNewLabourChargeItems = function(){
			$scope.jobcards.labour_charges.items.push({});
			$scope.add++;
		}
		$scope.removeLabourChargeItems = function(add){
			$scope.jobcards.labour_charges.items.splice(add, 1);
		}

		$scope.addNewAccessoriesItems = function(){
			$scope.jobcards.accessories.items.push({});
			$scope.accCount++;
		}
		$scope.removeAccessoriesItems = function(accCount){
			$scope.jobcards.accessories.items.splice(accCount, 1);
		}

		$scope.addNewMiscItems = function(){
			$scope.jobcards.misc_charges.items.push({});
			$scope.miscCount++;
		}
		$scope.removeMiscItems = function(miscCount){
			$scope.jobcards.misc_charges.items.splice(miscCount, 1);
		}

		$scope.addPostServiceComplaints = function(){
			$scope.jobcards.post_service_complaints.push({});
			$scope.postCount++;
		}
		$scope.removePostServiceComplaints = function(postCount){
			$scope.jobcards.post_service_complaints.splice(postCount, 1);
		}

		$scope.addJobcard = function(){
		var baseJobcards = Restangular.all('jobcards');
		//console.log("$scope.jobcards", $scope.jobcards.parts);
		$scope.jobcards.customer = $scope.jobcards.customer._id;
		$scope.jobcards.customer_vehicle = $scope.jobcards.customer_vehicle._id;
		$scope.jobcards.job_card = $scope.selectedJCMaster;
		baseJobcards.post($scope.jobcards).then(function(data){
			console.log("data", data);
			$scope.data = data;
			if (data.meta.status == 201) {
				$scope.jobcards = data.response.service;
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
		//$scope.addNewJobCard();
		//$scope.addNewPartsItems();
		//$scope.addNewLabourChargeItems();
		//$scope.addNewAccessoriesItems();
		//$scope.addNewMiscItems();
		//$scope.addPostServiceComplaints();
	};

	$scope.initEditJobcard = function() {
        var jobcardId = $stateParams.jobcardId;
        $scope.init();                                                    

        $scope.getJobCard = function(jobcardId) {
        var basejobcard = Restangular.one('jobcards', jobcardId);
             basejobcard.get().then(function(jobcards){                
                $scope.jobcards = jobcards.service;                
                $scope.selectedJCMaster = $scope.jobcards.job_card;
                if($scope.jobcards.job_card.length > 0){
                    $scope.invalid = false;
                }                        
            });
        };

        $scope.updateJobcard = function() {
            /*var activities = [];
            for(var i=0;i < $scope.selectedActivities.length; i++){                        
                activities.push($scope.selectedActivities[i]);                        
            }*/

            $scope.jobcards.customer = $scope.jobcards.customer._id;
			$scope.jobcards.customer_vehicle = $scope.jobcards.customer_vehicle._id;
            $scope.jobcards.job_card = $scope.selectedJCMaster;


           	Restangular.all('jobcards').one(jobcardId).customPUT($scope.jobcards).then(function(data){
           			console.log("data...", data);
           			$scope.data = data;
                    if (data.meta.status == 200) {
                    		$scope.jobcards = data.service;                    		
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
           	
            /*var editJobcard = Restangular.copy($scope.jobcards); 
            console.log('$scope.jobcards', $scope.jobcards);                               
            editJobcard.put().then(function(data) {
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
            });*/
        };

        $scope.getJobCard(jobcardId);
                        
    };
		
	//	customer Vehicles
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

	// branch all
			$scope.initAllBranches = function() {
				$scope.init();
				var baseAllBranches = Restangular.all('dealers/branches/all');
				return baseAllBranches.getList().then(function(branches) {					
					$scope.allBranches = branches;
					return branches;
				});
			  };
	// all customers
		$scope.initAllCustomers = function(){
			$scope.init();
			var baseAllCustomers = Restangular.all('customers/all');
			return baseAllCustomers.getList().then(function(customers){
				console.log("customers...", customers);
				$scope.allCustomers = customers;
				return customers;
			});
		};

	// all Makes
		$scope.initAllMakes = function(){
			$scope.init();
			var baseAllMakes = Restangular.all('dealers/makes/all');
			return baseAllMakes.getList().then(function(makes){
				$scope.allMakes = makes;
				return makes;
			});
		};

	// all Models
		$scope.initAllModels = function(){
			$scope.init();
			var baseAllModels = Restangular.all('dealers/models/all');
			return baseAllModels.getList().then(function(models){
				$scope.allModels = models;
				return models;
			});
		};


		$scope.initAllJobCardMasters = function() {
			$scope.init();
			var baseAllJobCardMasters = Restangular.all('jobcard-masters');
			return baseAllJobCardMasters.getList().then(function(jobcardmasters) {					
				$scope.allJobCardMasters = jobcardmasters;
				return jobcardmasters;
			});
		};

		//  In Progress jobcards

		$scope.initInprogress = function(){
			$scope.init();
			$scope.params = {job_status: "INPROGRESS"}
			$scope.currentPage = 1;
			$scope.numPerPage = 20;
			$scope.maxSize = 4;
			
			var baseJobcards = Restangular.all('jobcards');
				baseJobcards.getList().then(function(jobcards) {
				$scope.totalJobcards = jobcards.length;							

		 		$scope.$watch('currentPage + numPerPage', function() {
		 			console.log("currentPage", $scope.currentPage);
		 			if($scope.currentPage > 0){
		 				var filters = {};
		 				if(!Auth.isDealerAdmin()){
							$scope.params.branch = Auth.getCurrentUser().branch;
						}
		 				$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
		 				filters.offset = $scope.offset;
						filters.limit = $scope.numPerPage;
						$scope.params.offset = filters.offset;
						$scope.params.limit = filters.limit;
						var baseJobcards = Restangular.all('jobcards');
						return baseJobcards.getList($scope.params).then(function(jobcards) {
							$scope.jobcards = jobcards;
							return jobcards;
						});
		 			}						  		
				});
			});
		};

		// Payment Due Jobcards

		$scope.initPaymentDue = function(){
			$scope.init();
			$scope.params = {job_status: "PAYMENT_DUE"}
			$scope.currentPage = 1;
			$scope.numPerPage = 20;
			$scope.maxSize = 4;
			
			var baseJobcards = Restangular.all('jobcards');
				baseJobcards.getList().then(function(jobcards) {
				$scope.totalJobcards = jobcards.length;							

		 		$scope.$watch('currentPage + numPerPage', function() {
		 			console.log("currentPage", $scope.currentPage);
		 			if($scope.currentPage > 0){
		 				var filters = {};
		 				if(!Auth.isDealerAdmin()){
							$scope.params.branch = Auth.getCurrentUser().branch;
						}
		 				$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
		 				filters.offset = $scope.offset;
						filters.limit = $scope.numPerPage;
						$scope.params.offset = filters.offset;
						$scope.params.limit = filters.limit;
						var baseJobcards = Restangular.all('jobcards');
						return baseJobcards.getList($scope.params).then(function(jobcards) {
							$scope.jobcards = jobcards;
							return jobcards;
						});
		 			}						  		
				});
			});
		};

		// Scheduled Jobcards


		$scope.initScheduled = function(){
			$scope.init();
			$scope.params = {job_status: "SCHEDULED"}
			$scope.currentPage = 1;
			$scope.numPerPage = 20;
			$scope.maxSize = 4;
			
			var baseJobcards = Restangular.all('jobcards');
				baseJobcards.getList().then(function(jobcards) {
				$scope.totalJobcards = jobcards.length;							

		 		$scope.$watch('currentPage + numPerPage', function() {
		 			console.log("currentPage", $scope.currentPage);
		 			if($scope.currentPage > 0){
		 				var filters = {};
		 				if(!Auth.isDealerAdmin()){
							$scope.params.branch = Auth.getCurrentUser().branch;
						}
		 				$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
		 				filters.offset = $scope.offset;
						filters.limit = $scope.numPerPage;
						$scope.params.offset = filters.offset;
						$scope.params.limit = filters.limit;
						var baseJobcards = Restangular.all('jobcards');
						return baseJobcards.getList($scope.params).then(function(jobcards) {
							$scope.jobcards = jobcards;
							return jobcards;
						});
		 			}						  		
				});
			});
		};

		// feed back
		$scope.initfeedback = function(){
			$scope.init();
			$scope.currentPage = 1;
			$scope.numPerPage = 20;
			$scope.maxSize = 4;
			
			var baseJobcards = Restangular.all('jobcards/feedback');
				baseJobcards.getList().then(function(jobcards) {
				$scope.totalJobcards = jobcards.length;							

		 		$scope.$watch('currentPage + numPerPage', function() {
		 			console.log("currentPage", $scope.currentPage);
		 			if($scope.currentPage > 0){
		 				var filters = {};
		 				$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
		 				filters.offset = $scope.offset;
						filters.limit = $scope.numPerPage;
						var baseJobcards = Restangular.all('jobcards');
						return baseJobcards.getList(filters).then(function(jobcards) {
							$scope.jobcards = jobcards;
							return jobcards;
						});
		 			}						  		
				});
			});
		};
});
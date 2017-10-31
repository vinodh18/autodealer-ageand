'use strict';

angular.module('autodealerApp').controller('BranchModalCtrl',
	function($scope, $modal, $state, Auth) {

		$scope.open = function (size, dealerId) {		  
		    $scope.modalInstance = $modal.open({
		        templateUrl: 'myAddBranchModel.html',
		        controller: 'BranchModalInstanceCtrl',
		        size: size,
		        resolve: {
		        	dealerId: function(){
		        		return dealerId;
		        	}	
		        }
	   	 	});
	  	};

	    $scope.editBranch = function(size,dealerId,branchId){
	    	$scope.modalInstance = $modal.open({
	        templateUrl: 'myEditBranchModel.html',
	        controller: 'EditBranchModalInstanceCtrl',
	        size: size,
	        resolve: {
	        	dealerId: function(){
	        		return dealerId;
	        	},
	        	branchId: function(){
	        		return branchId;
	        	}	
	        }
	    });  

	    $scope.modalInstance.result.then(function (select) {	        
	        $modalInstance.close(true);
	      }, function () {	      	
	      	$state.reload();	      	
	       	console.log('Modal dismissed');
	      });
	    };
});	

angular.module('autodealerApp').controller('BranchModalInstanceCtrl',
	function($scope, $modalInstance, Restangular, $state, $stateParams, dealerId, Auth) {			
				
		$scope.init = function() {						
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
		};	

		$scope.initAddBranch = function() {
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
			$scope.LimitExceeds = false;

			// Begin of checkLimit Exceeds
			var baseDealer = Restangular.one('dealers', dealerId);			 	
		 	baseDealer.get().then(function(dealer){						
				var branchesCount = dealer.branches.length;
				var branchLimit = Auth.getCurrentUser().dealer.plan.plan_limits.branches;			
				console.log(branchesCount+'/'+branchLimit);
				if(branchesCount < branchLimit){
					$scope.LimitExceeds = false;
				}else{
					$scope.LimitExceeds = true;					
					$scope.alerts.push({type: 'danger',msg: 'Plan Limit Exceeds To Create New Branch'});				
				}	
			});									
			// End of checkLimit Exceeds

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

			$scope.addNewWorking_hours();
			$scope.addNewServiceable_vehicles();
			$scope.addNewPhone();		

			$scope.addBranch = function () {								
				
				var baseDealerBranch = Restangular.one('/dealers/'+dealerId+'/branch');
				
				baseDealerBranch.branch = $scope.branch;

		        baseDealerBranch.put().then(function(data) { 
		          console.log("rsp data:", data);         
		          if (data.meta.status == 200) {
		            $scope.alerts.push({type: 'success',
		              msg: "Branch Added successfully"});
		            $state.reload();
		          } else {
		            $scope.alerts.push({type: 'danger',
		              msg: data.meta.msg});
		          }          
		        }, function(response) {
		            console.log(response);		            
		            $scope.alerts.push({type: 'danger',
		              msg: "Unable to Add Branch!"});
		         });
			};	
		};

		$scope.initAllVehicleTypes = function() {			
			var basevehicletypes = Restangular.all('vehicle-types/all');
			return basevehicletypes.getList().then(function(vehicletypes) {
				$scope.allVehicletypes = vehicletypes;
				return vehicletypes;
			});
		};

		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		    $scope.LimitExceeds = false;
		};
	
});

angular.module('autodealerApp').controller('EditBranchModalInstanceCtrl',
	function($scope, $modalInstance, Restangular, $state, $stateParams, dealerId, branchId, Auth) {			
		console.log("dealerId", dealerId);
		console.log("branchId", branchId);
		$scope.init = function() {
			$scope.dealerId = dealerId;
			$scope.branchId = branchId;						
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
		};	

		$scope.initEditBranch = function() {
			$scope.init();
			$scope.init();
			$scope.index = 0;
			$scope.count = 0;
			var branchId = $scope.branchId;

			$scope.addNewWorking_hours = function() {
				$scope.branch.working_hours.push({});
				$scope.index++;
				$scope.newWorking_hours=null;
			};
			$scope.deleteWorking_hours = function(index) {				
				$scope.branch.working_hours.splice(index, 1);				
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

			$scope.getBranch = function(branchId) {
				var baseBranch = Restangular.one('dealers/'+$scope.dealerId+'/branch/'+$scope.branchId);
				 baseBranch.get().then(function(rspData){					
					$scope.branch = rspData.branch;					
				}, function(rsp) {
					console.log(rsp);
				});
			};			

			$scope.updateBranch = function() {												
				var baseBranchUpdate = Restangular.one('/dealers/'+$scope.dealerId+'/branch/'+$scope.branchId);				
				baseBranchUpdate.branch = $scope.branch;        		
			  	baseBranchUpdate.put().then(function(data){
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

			$scope.getBranch(branchId);	
		};

		$scope.initAllVehicleTypes = function() {
			$scope.init();
			var basevehicletypes = Restangular.all('vehicle-types/all');
			return basevehicletypes.getList().then(function(vehicletypes) {
				$scope.allVehicletypes = vehicletypes;
				return vehicletypes;
			});
		};

		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};
	
});	
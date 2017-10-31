'use strict';

angular.module('autodealerApp').controller('CDModalCtrl',
	function($scope, $modal, $state, Auth) {

		$scope.open = function (customerDetail) {		  
	      $scope.modalInstance = $modal.open({
	        templateUrl: 'CDModalContent.html',
	        controller: 'CDModalInstanceCtrl',
	        resolve: {
	        	customerDetail: function(){
	        		return customerDetail;
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

angular.module('autodealerApp').controller('CDModalInstanceCtrl',
	function($scope, $modalInstance, Restangular, $state, $stateParams, customerDetail, Auth) {			
		
		$scope.init = function() {						
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
		};

		$scope.addNewPhone = function() {
			$scope.customer.phone.push("");
			$scope.index++;
			$scope.newPhone=null;
		};
		$scope.deletePhone = function(index) {			
			$scope.customer.phone.splice(index, 1);			
		};

		$scope.initEditCustomerDetails = function() {
			$scope.init();
			$scope.customer = customerDetail;

			$scope.updateCustomerDetail = function () {
				var baseCustomerUpdate = Restangular.one('customers',$scope.customer._id);
				console.log('customer', $scope.customer);
				baseCustomerUpdate._id  	= $scope.customer._id;
        		baseCustomerUpdate.name  	= $scope.customer.name;
        		baseCustomerUpdate.email 	= $scope.customer.email;
			  	baseCustomerUpdate.address 	= $scope.customer.address;
			  	baseCustomerUpdate.phone 	= $scope.customer.phone;
			  	baseCustomerUpdate.dealer 	= $scope.customer.dealer;

			  	baseCustomerUpdate.put().then(function(data){
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
		};

		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};
	
});	
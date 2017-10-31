'use strict';

angular.module('autodealerApp').controller('AccessoriesModalCtrl',
	function($scope, $modal, $state, Auth) {

		$scope.open = function (size,jobCard) {		  
	      $scope.modalInstance = $modal.open({
	        templateUrl: 'AModalContent.html',
	        controller: 'AModalInstanceCtrl',
	        size: size,
	        resolve: {
	        	jobCard: function(){
	        		return jobCard;
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

angular.module('autodealerApp').controller('AModalInstanceCtrl',
	function($scope, $modalInstance, Restangular, $state, $stateParams, jobCard, Auth) {			
		
		$scope.init = function() {						
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
		};	

		$scope.initAddAccessories = function() {
			$scope.init();
			
			$scope.jobcard = jobCard;			
			$scope.accessories = jobCard.accessories;			

			$scope.discountAmount = function(accessories){				
				var totalChargesAmt = 0;
				for(var i=0; i < accessories.items.length; i++){
					totalChargesAmt = totalChargesAmt + accessories.items[i].rate;
				}
				accessories.discount_amt = totalChargesAmt * accessories.discount / 100;

			};

			$scope.totalAccessoriesAmount = function(accessories){				
				var totalChargesAmt = 0;
				for(var i=0; i < accessories.items.length; i++){
					totalChargesAmt = totalChargesAmt + accessories.items[i].rate;
				}				
				var subTotalAmt = totalChargesAmt - accessories.discount_amt;				
				accessories.total = subTotalAmt + accessories.tax_amt;				
			};


			$scope.addNewAccessory = function() {
				$scope.accessories.items.push({});				
			};
			$scope.deleteAccessory = function(index) {					
				$scope.accessories.items.splice(index, 1);
			};

			$scope.addAccessory = function () {				
				var baseAccessoriesUpdate = Restangular.one('/jobcards/'+jobCard._id+'/accessories');
				
				baseAccessoriesUpdate.accessories = $scope.accessories;        		

			  	baseAccessoriesUpdate.put().then(function(data){
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
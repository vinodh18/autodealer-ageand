'use strict';

angular.module('autodealerApp').controller('LCModalCtrl',
	function($scope, $modal, $state, Auth) {

		$scope.open = function (size,jobCard) {		  
	      $scope.modalInstance = $modal.open({
	        templateUrl: 'LCModalContent.html',
	        controller: 'LCModalInstanceCtrl',
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

angular.module('autodealerApp').controller('LCModalInstanceCtrl',
	function($scope, $modalInstance, Restangular, $state, $stateParams, jobCard, Auth) {			
		
		$scope.init = function() {						
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
		};	

		$scope.initAddLabourCharges = function() {
			$scope.init();			
			$scope.jobcard = jobCard;			
			$scope.labour_charges = jobCard.labour_charges;
			
			$scope.discountAmount = function(labour_charges){				
				var totalChargesAmt = 0;
				for(var i=0; i < labour_charges.items.length; i++){
					totalChargesAmt = totalChargesAmt + labour_charges.items[i].rate;
				}
				labour_charges.discount_amt = totalChargesAmt * labour_charges.discount / 100;

			};

			$scope.totalChargesAmount = function(labour_charges){				
				var totalChargesAmt = 0;
				for(var i=0; i < labour_charges.items.length; i++){
					totalChargesAmt = totalChargesAmt + labour_charges.items[i].rate;
				}				
				var subTotalAmt = totalChargesAmt - labour_charges.discount_amt;				
				labour_charges.total = subTotalAmt + labour_charges.tax_amt;				
			};

			$scope.addNewLabour = function() {
				$scope.labour_charges.items.push({});				
			};
			$scope.deleteLabour = function(index) {					
				$scope.labour_charges.items.splice(index, 1);
			};

			$scope.addLabourCharges = function () {
				
				var baseLabourChargeUpdate = Restangular.one('/jobcards/'+jobCard._id+'/labour-charges');
				
				baseLabourChargeUpdate.labour_charges = $scope.labour_charges;        		

			  	baseLabourChargeUpdate.put().then(function(data){
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
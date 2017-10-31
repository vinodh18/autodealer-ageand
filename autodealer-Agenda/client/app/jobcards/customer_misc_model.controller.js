'use strict';

angular.module('autodealerApp').controller('MCModalCtrl',
	function($scope, $modal, $state, Auth) {

		$scope.open = function (size,jobCard) {		  
	      $scope.modalInstance = $modal.open({
	        templateUrl: 'MCModalContent.html',
	        controller: 'MCModalInstanceCtrl',
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

angular.module('autodealerApp').controller('MCModalInstanceCtrl',
	function($scope, $modalInstance, Restangular, $state, $stateParams, jobCard, Auth) {			
		
		$scope.init = function() {						
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
		};	

		$scope.initAddMiscCharges = function() {
			$scope.init();

			$scope.jobcard = jobCard;			
			$scope.misc_charges = jobCard.misc_charges;			

			$scope.discountAmount = function(misc_charges){				
				var totalChargesAmt = 0;
				for(var i=0; i < misc_charges.items.length; i++){
					totalChargesAmt = totalChargesAmt + misc_charges.items[i].rate;
				}
				misc_charges.discount_amt = totalChargesAmt * misc_charges.discount / 100;

			};

			$scope.totalChargesAmount = function(misc_charges){				
				var totalChargesAmt = 0;
				for(var i=0; i < misc_charges.items.length; i++){
					totalChargesAmt = totalChargesAmt + misc_charges.items[i].rate;
				}				
				var subTotalAmt = totalChargesAmt - misc_charges.discount_amt;				
				misc_charges.total = subTotalAmt + misc_charges.tax_amt;				
			};

			$scope.addNewMisc = function() {
				$scope.misc_charges.items.push({});				
			};
			$scope.deleteMisc = function(index) {					
				$scope.misc_charges.items.splice(index, 1);
			};

			$scope.addMiscCharges = function () {
				
				var baseMiscChargeUpdate = Restangular.one('/jobcards/'+jobCard._id+'/misc-charges');
				
				baseMiscChargeUpdate.misc_charges = $scope.misc_charges;        		

			  	baseMiscChargeUpdate.put().then(function(data){
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
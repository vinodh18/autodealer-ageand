'use strict';

angular.module('autodealerApp').controller('PartsModalCtrl',
	function($scope, $modal, $state, Auth) {

		$scope.open = function (size,jobCard) {		  
	      $scope.modalInstance = $modal.open({
	        templateUrl: 'partsModalContent.html',
	        controller: 'partsModalInstanceCtrl',
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

angular.module('autodealerApp').controller('partsModalInstanceCtrl',
	function($scope, $modalInstance, Restangular, $state, $stateParams, jobCard, Auth) {			
		
		$scope.init = function() {						
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
		};	

		$scope.initAddParts = function() {
			$scope.init();
			
			$scope.jobcard = jobCard;			
			$scope.parts = jobCard.parts;			

			$scope.addNewPart = function() {
				$scope.parts.items.push({});				
			};
			$scope.deletePart = function(index) {					
				$scope.parts.items.splice(index, 1);
			};

			$scope.itemAmount = function(items){				
				items.amt = items.qty * items.rate;
			};

			$scope.discountAmount = function(parts){				
				var totalItemsAmt = 0;
				for(var i=0; i < parts.items.length; i++){
					totalItemsAmt = totalItemsAmt + parts.items[i].amt;
				}
				parts.discount_amt = totalItemsAmt * parts.discount / 100;

			};

			$scope.totalPartsAmount = function(parts){				
				var totalItemsAmt = 0;
				for(var i=0; i < parts.items.length; i++){
					totalItemsAmt = totalItemsAmt + parts.items[i].amt;
				}				
				var subTotalAmt = totalItemsAmt - parts.discount_amt;				
				parts.total = subTotalAmt + parts.tax_amt;				
			};

			$scope.addParts = function () {
				
				var basePartsUpdate = Restangular.one('/jobcards/'+jobCard._id+'/parts');				
				basePartsUpdate.parts  	= $scope.parts;        		
			  	basePartsUpdate.put().then(function(data){
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
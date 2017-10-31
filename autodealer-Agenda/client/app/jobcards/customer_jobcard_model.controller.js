'use strict';

angular.module('autodealerApp').controller('JCModalCtrl',
	function($scope, $modal, $state, Auth) {

		$scope.open = function (size,jobCard) {		  
	      $scope.modalInstance = $modal.open({
	        templateUrl: 'JCModalContent.html',
	        controller: 'JCModalInstanceCtrl',
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

angular.module('autodealerApp').controller('JCModalInstanceCtrl',
	function($scope, $modalInstance, Restangular, $state, $stateParams, jobCard, Auth) {			
		
		$scope.init = function() {						
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
		};	

		$scope.initAddCustomerJobCard = function() {
			$scope.init();
			$scope.jobcard = jobCard;
			console.log('customerJobCard', $scope.jobcard);

			$scope.addNewJobcard = function() {
				$scope.jobcard.job_card.push({});				
			};
			$scope.deleteJobcard = function(index) {					
				$scope.jobcard.job_card.splice(index, 1);
			};

			$scope.addCustomerJobCard = function () {
				console.log("add data", $scope.jobcard.job_card);
				var baseJobcardUpdate = Restangular.one('/jobcards/'+$scope.jobcard._id+'/jobcard');
				
				baseJobcardUpdate.job_card  	= $scope.jobcard.job_card;        		

			  	baseJobcardUpdate.put().then(function(data){
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
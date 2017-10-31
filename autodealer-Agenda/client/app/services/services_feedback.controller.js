'use strict';

angular.module('autodealerApp').controller('ServiceFeedbackCtrl',
	function($scope, $modal, $state, Auth) {

		$scope.open = function (feedback) {	

		  $scope.serviceFeedback = $modal.open({
	        templateUrl: 'update.html',
	        controller: 'FeedbackCtrl',
	        resolve: {
	        	feedback: function(){
	        		return feedback;
	        	}	
	        }
	    });

	    $scope.serviceFeedback.result.then(function (select) {
	        console.log('ok update', select);
	        $modalInstance.close(true);
	      }, function () {
	      	if(Auth.isCustomer()){
	      		/*$state.reload();*/
	      	}
	       console.log('Modal dismissed');
	      });
	    };
});	

angular.module('autodealerApp').controller('FeedbackCtrl',
	function($scope, $modalInstance, Restangular, $state, $stateParams, feedback, Auth) {
		console.log("FeedbackCtrl");
		$scope.init = function() {			
			if(Auth.getCurrentUser().role == 'CUSTOMER'){
				$scope.Customer = true;
			}
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
		};

		$scope.initUpdateFeedback = function() {			
			$scope.init();
			$scope.currentUser = Auth.getCurrentUser();
			$scope.service = feedback;

			$scope.UpdateFeedback = function () {
				
				var baseFeedback = Restangular.one('services/feedback',$scope.service._id);
				/*$scope.service.user = $scope.currentUser._id;
				$scope.service.feedback = $scope.service.feedback;*/
			  	baseFeedback.feedback = $scope.service.feedback;
			  	baseFeedback.customer_rating = $scope.service.customer_rating;
			  	console.log("feedback", baseFeedback);
			  	baseFeedback.put().then(function(data){
			  		console.log("data", data);
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


		angular.module('autodealerApp').controller('RatingDemoCtrl', function ($scope) {
		  $scope.max = 5;
		  $scope.isReadonly = false;

		  $scope.hoveringOver = function(value) {
		    $scope.overStar = value;
		    $scope.percent = 100 * (value / $scope.max);
		  	};
		});


		$scope.initAllUsers = function() {
						$scope.init();
						var baseuser = Restangular.all('users/all');
						return baseuser.getList().then(function(users) {
							$scope.allUsers = users;
							return users;
						});
					};
		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};
	
	});	
'use strict';

angular.module('autodealerApp').controller('CVModalCtrl',
	function($scope, $modal, $state, Auth) {

		$scope.open = function (customerVehicle) {		  
	      $scope.modalInstance = $modal.open({
	        templateUrl: 'CVModalContent.html',
	        controller: 'CVModalInstanceCtrl',
	        resolve: {
	        	customerVehicle: function(){
	        		return customerVehicle;
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

angular.module('autodealerApp').controller('CVModalInstanceCtrl',
	function($scope, $modalInstance, Restangular, $state, $stateParams, customerVehicle, Auth) {			
		
		$scope.init = function() {						
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
		};

		$scope.initEditCustomerVehicle = function() {
			$scope.init();
			$scope.customerVehicle = customerVehicle;

			$scope.updateCustomerVehicle = function () {
				var baseCustomerUpdate = Restangular.one('customer-vehicles',$scope.customerVehicle._id);
				console.log('customerVehicle', $scope.customerVehicle);
				baseCustomerUpdate._id  		= $scope.customerVehicle._id;
        		baseCustomerUpdate.customer 	= $scope.customerVehicle.customer;
        		baseCustomerUpdate.vehicle_type = $scope.customerVehicle.vehicle_type._id;
			  	baseCustomerUpdate.chassis_no 	= $scope.customerVehicle.chassis_no;
			  	baseCustomerUpdate.engine_no 	= $scope.customerVehicle.engine_no;
			  	baseCustomerUpdate.year 		= $scope.customerVehicle.year;
			  	baseCustomerUpdate.purchase_date= $scope.customerVehicle.purchase_date;
			  	baseCustomerUpdate.reg_no 		= $scope.customerVehicle.reg_no;
			  	baseCustomerUpdate.insurance_expiry_date 	= $scope.customerVehicle.insurance_expiry_date;
			  	baseCustomerUpdate.warranties 	= $scope.customerVehicle.warranties;
			  	baseCustomerUpdate.make 		= $scope.customerVehicle.make;
			  	baseCustomerUpdate.model 		= $scope.customerVehicle.model;

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

		$scope.initAllMake = function() {
			$scope.init();
			var basemakes = Restangular.all('dealers/makes/all');
			return basemakes.getList().then(function(makes) {
				$scope.allMakes = makes;
				return makes;
			});
		};

		$scope.initAllModel = function() {
			$scope.init();
			var basemodels = Restangular.all('dealers/models/all');
			return basemodels.getList().then(function(models) {
				$scope.allModels = models;
				return models;
			});
		};
		
		$scope.initAllVehicletype = function() {
			$scope.init();
			var basevehicletypes = Restangular.all('vehicle-types/all');
			return basevehicletypes.getList().then(function(vehicletypes) {
				$scope.allVehicletypes = vehicletypes;
				return vehicletypes;
			});
		};

		$scope.initAllWarrantytype = function() {
			$scope.init();
			var basewarrantytypes = Restangular.all('warranty-types/all');
			return basewarrantytypes.getList().then(function(warrantytypes) {
				$scope.allWarrantytypes = warrantytypes;
				return warrantytypes;
			});
		};

		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};
	
});	
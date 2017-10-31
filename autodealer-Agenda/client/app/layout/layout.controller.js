'use strict';

angular.module('autodealerApp').controller('SidebarMenuCtrl',
		function($scope, $location, Auth, $q) {
			$scope.isActive = function(route) {
				return route === $location.path();
			};
			
			$scope.logout = function(){
				console.log("logout");
				Auth.logout();			
			};
			$scope.manager = Auth.isManager();
			$scope.staff = Auth.isStaff();
			$scope.customer = Auth.isCustomer();
			$scope.superAdmin = Auth.isSuperAdmin();
			$scope.dealerAdmin = Auth.isDealerAdmin();
			$scope.branchAdmin = Auth.isBranchAdmin();
			$scope.currentUser = Auth.getCurrentUser();
			$scope.dealer = $scope.currentUser.dealer;

			if($scope.superAdmin){ 
				$scope.accessSuperAdmin = true;
			}else{
				$scope.accessSuperAdmin = false;
			}
			
			if($scope.dealerAdmin || $scope.manager || $scope.branchAdmin){
				$scope.accessMega = true;
			}

			if($scope.dealerAdmin || $scope.manager || $scope.branchAdmin || $scope.staff){
				$scope.access = true;
			}else{
				$scope.access = false;
			}
			
			$scope.name = Auth.getCurrentUser().username;
			$scope.userId = Auth.getCurrentUser()._id;
			
			
			$scope.image_url = Auth.getCurrentUser().image_url;			
				$scope.image = {};
				console.log("image..:", $scope.image);
				if($scope.image_url){		
					$scope.image.src = $scope.image_url + "?timestamp=" + Date.now(); 
					console.log("Auth image", $scope.image.src);
				}else{
					$scope.image.src = "assets/images/a0.jpg";
				}
		    	$scope.$on("update_image", function(event, image_url){
				if(image_url){					
					$scope.image.src = image_url + "?timestamp=" + Date.now(); 
				}else{
					$scope.image.src = "assets/images/a0.jpg"; 
				}
			});
});
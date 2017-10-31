'use strict'; 

angular.module('autodealerApp')
	.controller('UsersCtrl', function($scope, Restangular, dialogs, $stateParams, Auth) {
		$scope.init = function() {	
		$scope.params = {};
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
		};

		if(Auth.isBranchAdmin() || Auth.isStaff() || Auth.isCustomer()){
			$scope.deleteAction = false;
		}else{
			$scope.deleteAction = true;
		}
		
		$scope.getList = function(){
			$scope.initUserList($scope.params);
		}

		$scope.reset = function(){
			$scope.params = "";
			$scope.initUserList($scope.params);
		}
		$scope.initUsers = function(){
			$scope.init();
			$scope.filterOptions = {
				filterText : "",
				useExternalFilter : true
			};
		$scope.initUserList = function(){
			$scope.currentPage = 1;
			$scope.numPerPage = 20;
			$scope.maxPages =4;

			var baseusers = Restangular.all('users');
			baseusers.getList().then(function(users){
				$scope.users = users;
				$scope.totalUsers = $scope.users.length;

				var image = new Image();
					image.onload = function(){
					document.querySelector("#userImage").getContext("2d").drawImage(this,0,0);
				};

				$scope.$watch('currentPage + numPerPage', function(){
					if($scope.currentPage > 0){
						var filters = {};
						$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
						filters.offset = $scope.offset;
						filters.limit = $scope.numPerPage;
						
						$scope.params.offset = filters.offset;
						$scope.params.limit = filters.limit;

						var baseusers = Restangular.all('users');
							baseusers.getList($scope.params).then(function(users){
								$scope.users = users;
								return users;
							});
					}
				});
			});
		}
		}


		$scope.deleteUsers = function(row){
			var id = row;
			console.log("id", id);
			dialogs.confirm('Confirm', 'Are you sure you want to delete ?').result
			.then(function(btn){
				console.log('yes');
				var baseusers = Restangular.one('users', id);
				baseusers.remove().then(function(rsp){
					if(rsp.meta.status == 200){
						$scope.alerts = [];
						$scope.alerts.push({type:'success', msg: rsp.meta.msg});
						$scope.initUserList();
					}else{
						$scope.alerts = [];
						$scope.alerts.push({type: 'danger', msg: rsp.meta.msg});
					}
				})
			})

		}

		
		$scope.initAllBranches = function() {
			$scope.init();
			var baseAllBranches = Restangular.all('dealers/branches/all');
			return baseAllBranches.getList().then(function(branches) {					
				$scope.allBranches = branches;
				return branches;
			});
		};
					
					
		$scope.initAllUsers = function(role) {
			$scope.init();
			console.log("role", role);
			var baseusers = Restangular.all('users/all');
			return baseusers.getList({role: role}).then(function(users) {
				$scope.allUsers = users;
				return users;
			});
		};		
					
		$scope.initAllDealers = function() {
			$scope.init();
			var basedealers = Restangular.all('dealers/all');
			return basedealers.getList({
				dealer : $scope.dealer
			}).then(function(dealers) {
				console.log("dealer list", dealers);
				$scope.allDealers = dealers;
				return dealers;
			});
		};

	
	$scope.isValidEmail 	= false;
	$scope.isValidusername 	= false;
	$scope.emailSpinner		= false;
	$scope.usernameSpinner	= false;

	$scope.check = function(){
		if($scope.isValidEmail && $scope.isValidusername){ 			
			return false;
		}else{
			return true;				
		}
	}

	$scope.checkEmail = function(user){
		if(user.email){
			$scope.emailSpinner = true;					
			var baseCheckEmail = Restangular.one('users/check-email');
			baseCheckEmail.get({email: user.email}).then(function(data) {
			console.log(data);
			if(data.meta.status == 200){
				console.log("Exists");
				if(!$scope.userForm.$invalid){ $scope.userForm.$invalid = true };
					document.getElementById("email").setAttribute("class", "form-control ng-valid-maxlength ng-touched ng-dirty ng-valid-parse ng-valid-required ng-valid-minlength ng-invalid");					
					$scope.emailSpinner = false;
					$scope.isValidEmail = false;
					$scope.userForm.email.$invalid = true;
					$scope.userForm.email.$error.exists = true;
					$scope.userForm.email.$error.available = false;
				}					
			}, function(rsp) {						
				if(rsp.status == 404){
					console.log("Available");
					document.getElementById("email").setAttribute("class", "form-control ng-valid-maxlength ng-touched ng-dirty ng-valid-parse ng-valid-required ng-valid-minlength ng-valid");
					
					$scope.emailSpinner = false;
					$scope.isValidEmail = true;
					$scope.userForm.email.$invalid = false;
					$scope.userForm.email.$error.exists = false;
					$scope.userForm.email.$error.available = true;	
				}
			});
		}					
	};

	$scope.checkUsername = function(user){
		if(user.username){
			$scope.usernameSpinner = true;
			var baseCheckUsername = Restangular.one('users/check-username');				
				baseCheckUsername.get({username:user.username}).then(function(data) {	
				if(data.meta.status == 200){
				$scope.usernameSpinner = false;								
				console.log("Exists");
				document.getElementById("username").setAttribute("class", "form-control ng-valid-maxlength ng-touched ng-dirty ng-valid-parse ng-valid-required ng-valid-minlength ng-invalid");						
				$scope.isValidusername = false;						
				$scope.userForm.username.$invalid = true;
				$scope.userForm.username.$error.exists = true;
				$scope.userForm.username.$error.available = false;			
			}					
			}, function(rsp) {						
				if(rsp.status == 404){	
					console.log("Available");					
					document.getElementById("username").setAttribute("class", "form-control ng-valid-maxlength ng-touched ng-dirty ng-valid-parse ng-valid-required ng-valid-minlength ng-valid");
					$scope.usernameSpinner = false;
					$scope.isValidusername = true;
					$scope.userForm.username.$invalid = false;
					$scope.userForm.username.$error.exists = false;
					$scope.userForm.username.$error.available = true;
				}
			});
		}					
	};		

						
	$scope.initCreateUser = function() {
		$scope.init();
		$scope.user = {};
		
		$scope.addUser = function() {
			var baseUsers = Restangular.all('users');									
			baseUsers.post($scope.user).then(function(data) {
				console.log(data);
				$scope.data = data;				
				if (data.meta.status == 201) {					
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
					msg: "Unable to add!"});
			});
									
		};
	};
						
						
	$scope.initEditUser = function() {
		var userId = $stateParams.userId;						
		$scope.init();
												
							
		$scope.getUser = function(userId) {
			var baseUser = Restangular.one('users', userId);
			 baseUser.get().then(function(user){					
					$scope.user = user;
				},function(rsp) {
					console.log(rsp);
			});
		};

		/*$scope.updateUser = function() {
			var editUser = Restangular.copy($scope.user);				
			editUser.put().then(function(data) {
				console.log("data...", data);
				$scope.data = data;

				if (data.meta.status == 200) {
					
						$scope.alerts = [];
						$scope.alerts.push({
							type : 'success',
							msg : data.meta.msg
						});
				} else {
					$scope.alerts = [];
					$scope.alerts.push({
						type : 'danger',
						msg : data.meta.msg
					});
				}
			}, function(response) {
				console.log(response);
				$scope.alerts = [];
				$scope.alerts.push({type: 'danger',
					msg: "Unable to update!"});
			});
		};*/

		$scope.getUser(userId);
				
	};

});
'use strict';

angular.module('autodealerApp').controller('SearchCtrl',
		function($scope, Restangular, dialogs, $stateParams, Auth) {
		
		$scope.init = function() {
			$scope.params = {};
			/*$scope.access = Auth.isManager();
			$scope.staff = Auth.isStaff();
			$scope.engineer = Auth.isEngineer();*/
			$scope.currentUser = Auth.getCurrentUser();
			$scope.dateRange = {};
			$scope.dateRange.startDate = moment().subtract('days', 6);
			$scope.dateRange.endDate = moment();
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
			$scope.ranges = {
		         'Today': [moment(), moment()],
		         'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
		         'Last 7 Days': [moment().subtract('days', 6), moment()],
		         'Last 30 Days': [moment().subtract('days', 29), moment()],
		         'This Month': [moment().startOf('month'), moment().endOf('month')],
		         'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
		      };
		};
		
		$scope.jobCardStatus = function(status){				
				if(status == 'PAID'){
					return 'success';
				}else if(status == 'PAYMENT_DUE'){
					return 'danger';				
				}else if(status == 'SCHEDULED'){
					return 'primary';				
				}else if(status == 'INPROGRESS'){
					return 'info';
				}else{
					return 'dark';
				}
			}
		$scope.getList = function(){
			$scope.initAllJobcards($scope.params);
		}

		$scope.reset = function(){
			$scope.initDateRanges();
			$scope.params.branch = "";
			$scope.params.job_card_no = "";
			$scope.params.job_status = "";
			$scope.params.make = "";
			$scope.params.compare = "";
			$scope.params.total_amt = "";
			$scope.initAllJobcards($scope.params);
		}

		$scope.initDateRanges = function() {
			$scope.dateRange = {};
			$scope.dateRange.startDate = moment().subtract('days', 6);
			$scope.dateRange.endDate = moment();
		};
		// Search Job Cards
		$scope.initJobcards = function(){
			$scope.init();
			$scope.$watch('dateRange', function(dateRange) {								
				$scope.from_date = moment(dateRange.startDate._d).format('YYYY/MM/DD');
				$scope.to_date = moment(dateRange.endDate._d).format('YYYY/MM/DD');
				$scope.params.from_date = $scope.from_date;
				$scope.params.to_date = $scope.to_date;	
			}, true);

			$scope.filterOptions = {
					filterText : "",
					useExternalFilter : true
				};
		$scope.initAllJobcards = function()	{
			$scope.currentPage = 1;
			$scope.numPerPage = 20;
			$scope.maxSize = 4;
			if(!Auth.isDealerAdmin()){
				$scope.params.branch = Auth.getCurrentUser().branch;
			}
			
			var baseJobcards = Restangular.all('jobcards');
				baseJobcards.getList($scope.params).then(function(jobcards) {
				$scope.jobcards = jobcards;
				$scope.totalJobcards = $scope.jobcards.length;							

		 		$scope.$watch('currentPage + numPerPage', function() {
		 			if($scope.currentPage > 0){
		 				var filters = {};
		 				$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
		 				filters.offset = $scope.offset;
						filters.limit = $scope.numPerPage;
						$scope.params.offset = filters.offset;
						$scope.params.limit = filters.limit;
						if(!Auth.isDealerAdmin()){
							$scope.params.branch = Auth.getCurrentUser().branch;
						}
						
						var baseJobcards = Restangular.all('jobcards');
						return baseJobcards.getList(filters).then(function(jobcards) {
							$scope.jobcards = jobcards;
							$scope.totalJobcard = jobcards.length;
							console.log("$scope.jobcards", $scope.jobcards);
							return jobcards;
						});
		 			}						  		
				});
			});
		};
	};

		

				$scope.initAllBranch = function() {
						$scope.init();
						var basebranches = Restangular.all('dealers/branches/all');
						return basebranches.getList(/*{
							customervehicles : $scope.customervehicles
						}*/).then(function(branches) {
							$scope.allBranches = branches;
							return branches;
						});
					};

					$scope.initAllDealer = function() {
						$scope.init();
						var basedealers = Restangular.all('dealers/all');
						return basedealers.getList(/*{
							customervehicles : $scope.customervehicles
						}*/).then(function(dealers) {
							$scope.allDealers = dealers;
							return dealers;
						});
					};
					
					$scope.initAllMakes = function() {
						$scope.init();
						var baseMakes = Restangular.all('dealers/makes/all');
						return baseMakes.getList().then(function(makes) {
							$scope.allMakes = makes;
							return makes;
						});
					};
		
});
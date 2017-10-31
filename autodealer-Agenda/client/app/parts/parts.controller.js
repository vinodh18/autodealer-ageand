'use strict';

angular.module('autodealerApp')
  .controller('PartsCtrl', function ($scope, $stateParams, dialogs, Auth, Restangular) {
    	$scope.init = function() {						
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

		$scope.initParts = function(){
			$scope.init();

			$scope.filterOptions = {
				filterText : "",
				useExternalFilter : true
			};
			
			$scope.currentPage = 1;
			$scope.numPerPage = 20;
			$scope.maxPages = 4;

			var baseparts = Restangular.all('parts');
				baseparts.getList().then(function(parts){
				$scope.parts = parts;
				$scope.totalParts = $scope.parts.length;

				$scope.$watch('currentPage + numPerPage', function(){
					if($scope.currentPage > 0){
						var filters = {};
						$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
						filters.offset = $scope.offset;
						filters.limit = $scope.numPerPage;
						var parts = Restangular.all('parts');
						parts.getList(filters).then(function(parts){
							$scope.parts = parts;
							return parts;
						});
					}
				});
			});
		};
				

		$scope.initcreatePart = function(){
			$scope.init();
			$scope.part = {};
			$scope.index = 0;
			$scope.part.rates = [];

			$scope.addNewRates = function() {
				$scope.part.rates.push({});
				$scope.index++;
			};
			$scope.deleteRates = function(index){
				$scope.part.rates.splice(index, 1);
			}

			$scope.addPart = function(){
				var basepart = Restangular.all('parts');
				console.log("$scope.parts", $scope.part);
				basepart.post($scope.part).then(function(data){
					$scope.data = data;
					if(data.meta.status == 201){
						$scope.alerts = [];
						$scope.alerts.push({type:'success', msg: data.meta.msg});
					}else{
						$scope.alerts = [];
						$scope.alerts.push({type:'danger', msg: data.meta.msg});
					}
				}, function(response){
					$scope.alerts = [];
						$scope.alerts.push({type:'danger', msg: "Unable to add!"});
				});
			}
			$scope.addNewRates();
		};

				
		$scope.initEditParts = function() {
			$scope.init();
			var partId = $stateParams.partId;
	
			$scope.addNewRates = function() {
				$scope.part.rates.push({});
				$scope.index++;
			};
	
			$scope.deleteRates = function(index){
				$scope.part.rates.splice(index, 1);
			}
	
			$scope.getParts = function(partId) {
				var baseParts = Restangular.one('parts', partId);
			 	baseParts.get().then(function(parts){
					$scope.part = parts;
				}, function(rsp) {
					console.log(rsp);
				});
			};

			$scope.updateParts = function() {
				var editParts = Restangular.copy($scope.part);
				editParts.put().then(function(data) {					
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
			};
			
			$scope.getParts(partId);
		};


		$scope.deletePart = function(row){
			var id = row;			
			dialogs.confirm('Confirm', 'Are you sure you want to delete?').result
			.then(function(btn){
				console.log('yes');
				var basePart = Restangular.one('parts', id);
				basePart.remove().then(function(rsp){
					if(rsp.meta.status == 200){
						$scope.alerts = [];
						$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
						$scope.initParts();
					}else{
						$scope.alerts = [];
						$scope.alerts.push({type: 'danger', msg: rsp.meta.msg});
					}
				});
			});
		};	


		$scope.initAllBranches = function() {
			$scope.init();
			var baseAllBranches = Restangular.all('dealers/branches/all');
			return baseAllBranches.getList().then(function(branches) {					
				$scope.allBranches = branches;
				return branches;
			});
		};

		$scope.initAllParts = function() {
			$scope.init();
			var baseAllParts = Restangular.all('parts-groups/all');
			return baseAllParts.getList().then(function(partsgroup) {					
				$scope.allPartsgroup = partsgroup;
				return partsgroup;
			});
		};
 });

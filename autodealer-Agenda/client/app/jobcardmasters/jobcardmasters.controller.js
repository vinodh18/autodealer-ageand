'use strict';

angular.module('autodealerApp')
  .controller('JobcardmastersCtrl', function ($scope, Restangular, $stateParams, Auth, dialogs) {
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

		$scope.initJobcardsmaster = function(){
    			$scope.init();
    			$scope.filterOptions = {
					filterText : "",
					useExternalFilter : true
				};
								
				$scope.sortingLog = [];
				  
				$scope.sortableOptions = {
				    activate: function() {
				        //console.log("activate");
				    },
				    beforeStop: function() {
				        //console.log("beforeStop");
				    },
				    change: function() {
				        //console.log("change");
				    },
				    create: function() {
				        //console.log("create");
				    },
				    deactivate: function() {
				        //console.log("deactivate");
				    },
				    out: function() {
				        //console.log("out");
				    },
				    over: function() {
				        //console.log("over");
				    },
				    receive: function() {
				        //console.log("receive");
				    },
				    remove: function() {
				        //console.log("remove");
				    },
				    sort: function() {
				        console.log("sort");
				    },
				    start: function() {
				        console.log("start");
				        $scope.sortingLog = [];					        
				    },
				    update: function(e, ui) {					      	
				    	var logEntry = $scope.list.map(function(i){				    		
				        	return i;
				      	}).join(', ');				      					      	
				    },
				    stop: function(e, ui) {				      				    
				      $scope.list.map(function(i){
				      	$scope.sortingLog.push(i._id);
				      });				      
				    }
				};				  				  				  				
				
				$scope.currentPage = 1;
				$scope.numPerPage = 20;
				$scope.maxPages = 4;

				var baseJObcardsmaster = Restangular.all('jobcard-masters');
				baseJObcardsmaster.getList().then(function(jobcardmaster){
					$scope.jobcardmaster = jobcardmaster;
					$scope.list = $scope.jobcardmaster;					
					$scope.totaljobcardmaster = $scope.jobcardmaster.length;

					$scope.$watch('currentPage + numPerPage', function(){
							if($scope.currentPage > 0){
								var filters = {};
								$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
								filters.offset = $scope.offset;
								filters.limit = $scope.numPerPage;
								var basePartsgroup = Restangular.all('jobcard-masters');
								basePartsgroup.getList(filters).then(function(jobcardmaster){
									$scope.jobcardmaster = jobcardmaster;
									return jobcardmaster;
								})
							}
						});

				});

				$scope.updateSort = function(){
					$scope.init();
					//console.log('updateSort', $scope.sortingLog);
					var baseUpdateSortNo = Restangular.one('jobcard-masters/update-sortno');				
					baseUpdateSortNo.jobCardMasterSortId = $scope.sortingLog;
			        baseUpdateSortNo.put().then(function(data) { 
			          console.log("rsp data:", data);         
			          if (data.meta.status == 200) {			            
			            $scope.alerts.push({type: 'success',
			              msg: "Job Card Master Sorted"});
			            $scope.initJobcardsmaster();
			          } else {			            
			            $scope.alerts.push({type: 'danger',
			              msg: data.meta.msg});
			          }          
			        }, function(response) {
			            console.log(response);			            
			            $scope.alerts.push({type: 'danger',
			              msg: "Unable to Sort Job Card Master!"});
			         });
				};

    	};

    			// single delete
		$scope.deleteJobcardmaster = function(row){
			var id = row;
			console.log("id", row);
			dialogs.confirm('Confirm', 'Are you want to delete?').result
			.then(function(btn){
				console.log('yes');
				var baseJObcardsmaster = Restangular.one('jobcard-masters', id);
				baseJObcardsmaster.remove().then(function(rsp){
					if(rsp.meta.status == 200){
						$scope.alerts = [];
						$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
						$scope.initJobcardsmaster();
					}else{
						$scope.alerts = [];
						$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
					}
				});
			});
		}

		// create function
		$scope.initcreateJobcardMaster = function(){
			$scope.init();
			$scope.jobcardmaster = {};
			$scope.jobcardmaster.types = [];			
			$scope.add = 0;			

			$scope.addNewType = function() {
				$scope.jobcardmaster.types.push("");
				$scope.add++;
			};
			$scope.deleteType = function(index) {					
				$scope.jobcardmaster.types.splice(index, 1);												
			};
			
			$scope.addNewType();	

			$scope.addjobcardmaster = function(){
				var baseJobcardMaster = Restangular.all('jobcard-masters');
				baseJobcardMaster.post($scope.jobcardmaster).then(function(data){
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
		
		}

	// Edit function
	$scope.initEditJobCardaster = function() {
		$scope.init();				
		  
		$scope.tmpList = [];
		  
		$scope.sortableOptions = {
		    activate: function() {
		        //console.log("activate");
		    },
		    beforeStop: function() {
		        //console.log("beforeStop");
		    },
		    change: function() {
		        //console.log("change");
		    },
		    create: function() {
		        //console.log("create");
		    },
		    deactivate: function() {
		        //console.log("deactivate");
		    },
		    out: function() {
		        //console.log("out");
		    },
		    over: function() {
		        //console.log("over");
		    },
		    receive: function() {
		        //console.log("receive");
		    },
		    remove: function() {
		       //console.log("remove");
		    },
		    sort: function() {
		        //console.log("sort");
		    },
		    start: function() {
		        console.log("start");
		        $scope.tmpList = [];
		    },
		    update: function(e, ui) {
		      //console.log("update");
		      
		      var logEntry = $scope.types.map(function(i){
		        return i;
		      }).join(', ');
		      //$scope.types.push(logEntry);
		    },
		    stop: function(e, ui) {					      
		      var logEntry = $scope.types.map(function(i){
		        return i;
		      }).join(', ');
		      $scope.tmpList.push(logEntry);
		      console.log("stop types", $scope.types);
		    }
		  };

		var JBMasterId = $stateParams.jobcardmasterId;												

		$scope.addNewType = function() {
			$scope.types.push("");
			$scope.add++;
		};
		$scope.deleteType = function(index) {					
			$scope.types.splice(index, 1);												
		};										
			
		$scope.getJobcardsMaster = function(JBMasterId) {
		var baseJBMaster = Restangular.one('jobcard-masters', JBMasterId);
		 baseJBMaster.get().then(
				function(JBMaster){
					$scope.jobcardmaster = JBMaster;
					$scope.types = $scope.jobcardmaster.types;
					$scope.list = $scope.types;
				}, function(rsp) {
					console.log(rsp);
				});
		};

		$scope.updateJBMaster = function() {						
			var editJBMaster = Restangular.copy($scope.jobcardmaster);
			editJBMaster._id =  $scope.jobcardmaster._id;
			editJBMaster.desc =  $scope.jobcardmaster.desc;
			editJBMaster.dealer =  $scope.jobcardmaster.dealer._id;
			editJBMaster.types =  $scope.types;
			editJBMaster.put().then(
				function(data) {
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

			$scope.getJobcardsMaster(JBMasterId);
		};
  });

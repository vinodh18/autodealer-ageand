'use strict';

angular.module('autodealerApp').controller('ModelModalCtrl',
	function($scope, $modal, $state, Auth) {

		$scope.open = function (size,makeId) {		  
	      $scope.modalInstance = $modal.open({
	        templateUrl: 'myModelModal.html',
	        controller: 'modelModalInstanceCtrl',
	        size: size,
	        resolve: {
	        	makeId: function(){
	        		return makeId;
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

angular.module('autodealerApp').controller('modelModalInstanceCtrl',
	function($scope, $modalInstance, Restangular, $state, $stateParams, makeId, Auth, Upload) {			
		
		$scope.init = function() {						
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
			$scope.makeId = makeId;
			$scope.dealerId = Auth.getCurrentUser().dealer._id;
			$scope.modelOriginalImg = "#modelOriginalImg";			
			$scope.dealerModelImg = "offers";			
		};

		// Converting Image dataURI to blob
		$scope.dataURIToBlob = function(dataURI){				
			
		    var byteString = atob(dataURI.split(',')[1]);
		    
		    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
		    
		    var ab = new ArrayBuffer(byteString.length);
		    var ia = new Uint8Array(ab);
		    for (var i = 0; i < byteString.length; i++) {
		        ia[i] = byteString.charCodeAt(i);
		    }
		    
		    var dataView = new DataView(ab);
		    var blob = new Blob([dataView.buffer], {type: mimeString});
		    return blob;				    
		}	

		$scope.initAddModel = function() {
			$scope.init();
			$scope.model = {};
		    $scope.createImage = true;
		    
		    $scope.LimitExceeds = false;

		    // Begin of checkLimit Exceeds
			var baseDealer = Restangular.one('dealers', Auth.getCurrentUser().dealer._id);			 	
		 	baseDealer.get().then(function(dealer){										
				var modelsCount = 0;      		
	     		for(var i = 0; i < dealer.makes.length; i++){
	     			modelsCount += dealer.makes[i].models.length;
	     		}
				var modelLimit = Auth.getCurrentUser().dealer.plan.plan_limits.models;			
				console.log(modelsCount+'/'+modelLimit);
				if(modelsCount < modelLimit){
					$scope.LimitExceeds = false;
				}else{
					$scope.LimitExceeds = true;					
					$scope.alerts.push({type: 'danger',msg: 'Plan Limit Exceeds To Create New Model'});				
				}	
			});									
			// End of checkLimit Exceeds

			$scope.addModel = function() {								
					var originalImage = document.querySelector("#modelOriginalImg").getAttribute("ng-src");					
					if(originalImage){
						var blob = $scope.dataURIToBlob(originalImage);
						// GET S3POLICY AND SIGNATURE FROM SERVER
						var getPolicy = Restangular.one('s3Policy');
						getPolicy.get({mimeType: blob.type, type: $scope.dealerModelImg}).then(function (data) {							
							$scope.upload = Upload.upload({
								url: 'https://' + data.response.bucket + '.s3.amazonaws.com/',
								method: 'POST',
								fields: {
									key: data.response.keyPath + Date.now() + '.' + blob.type.substring(6),
		                            AWSAccessKeyId: data.response.AWSAccessKeyId,
		                            acl: 'public-read',
		                            'success_action_status' : '201',
		                            policy: data.response.s3Policy,
		                            signature: data.response.s3Signature,
		                            "Content-Type": blob.type,
								},
								file: blob,
							});

							$scope.upload.then(function (response) {								
								if(response.status == 201) {
									var x2js = new X2JS();
                              		var responseData = x2js.xml_str2json(response.data);		                              
		                            var parsedData = {
		                                  location: responseData.PostResponse.Location,
		                                  bucket: responseData.PostResponse.Bucket,
		                                  key: responseData.PostResponse.Key,
		                                  etag: responseData.PostResponse.ETag
		                              };		                              
		                              $scope.model.img_url = parsedData.location;

		                            var baseModel = Restangular.one('dealers/'+$scope.dealerId+'/make/'+$scope.makeId+'/model');							        
							        baseModel.model = $scope.model;							        							       
							        baseModel.put().then(function(data) { 
							          console.log("rsp data:", data);         
							          if (data.meta.status == 200) {
							            $scope.alerts = [];
							            $scope.alerts.push({type: 'success',
							              msg: "Image uploded successfully"});
							          } else {
							            $scope.alerts = [];
							            $scope.alerts.push({type: 'danger',
							              msg: data.meta.msg});
							          }          
							        }, function(response) {
							            console.log(response);
							            $scope.alerts = [];
							            $scope.alerts.push({type: 'danger',
							              msg: "Unable to upload Image!"});
							         });
								} else {
									console.log("Image Upload Failed");
								}
							});
						});	 						
					}else{						
						$scope.alerts = [];
						$scope.alerts.push({type: 'danger',
							msg: 'Choose Image To Upload'});
					}
				};

		};		

		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};
	
});	
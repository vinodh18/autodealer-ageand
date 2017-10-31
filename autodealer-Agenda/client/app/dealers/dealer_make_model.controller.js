'use strict';

angular.module('autodealerApp').controller('MakeModalCtrl',
	function($scope, $modal, $state, Auth) {

		$scope.open = function (size,dealerId) {		  
	      $scope.modalInstance = $modal.open({
	        templateUrl: 'myMakeModal.html',
	        controller: 'makeModalInstanceCtrl',
	        size: size,
	        resolve: {
	        	dealerId: function(){
	        		return dealerId;
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

angular.module('autodealerApp').controller('makeModalInstanceCtrl',
	function($scope, $modalInstance, Restangular, $state, $stateParams, dealerId, Auth, Upload) {			
		
		$scope.init = function() {						
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
			$scope.dealerId = Auth.getCurrentUser().dealer._id;
			$scope.makeOriginalImg = "#makeOriginalImg";			
			$scope.dealerMakeImg = "offers";			
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

		$scope.initAddMake = function() {
			$scope.init();
			$scope.make = {};
		    $scope.createImage = true;
		    $scope.LimitExceeds = false;

		    // Begin of checkLimit Exceeds
			var baseDealer = Restangular.one('dealers', Auth.getCurrentUser().dealer._id);			 	
		 	baseDealer.get().then(function(dealer){						
				var makesCount = dealer.makes.length;
				var makeLimit = Auth.getCurrentUser().dealer.plan.plan_limits.makes;			
				console.log(makesCount+'/'+makeLimit);
				if(makesCount < makeLimit){
					$scope.LimitExceeds = false;
				}else{
					$scope.LimitExceeds = true;					
					$scope.alerts.push({type: 'danger',msg: 'Plan Limit Exceeds To Create New Make'});				
				}	
			});									
			// End of checkLimit Exceeds

			$scope.addMake = function() {								
					var originalImage = document.querySelector("#makeOriginalImg").getAttribute("ng-src");					
					if(originalImage){
						var blob = $scope.dataURIToBlob(originalImage);
						// GET S3POLICY AND SIGNATURE FROM SERVER
						var getPolicy = Restangular.one('s3Policy');
						getPolicy.get({mimeType: blob.type, type: $scope.dealerMakeImg}).then(function (data) {							
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
		                              $scope.make.img_url = parsedData.location;

		                            var baseMake = Restangular.one('dealers/'+$scope.dealerId+'/make');							        
							        baseMake.make = $scope.make;							        							       
							        baseMake.put().then(function(data) { 
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
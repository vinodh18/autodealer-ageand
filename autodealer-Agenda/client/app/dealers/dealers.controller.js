'use strict'; 

angular.module('autodealerApp')
	.controller('DealersCtrl', function($scope, Restangular, dialogs, $stateParams, Auth, $rootScope, Upload) {
		
		$scope.init = function() {
			$scope.dealerId = Auth.getCurrentUser().dealer._id;
			$scope.currentUser = Auth.getCurrentUser();
			
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};			
		};

		if(Auth.isDealerAdmin()){
			$scope.isDealerAdmin = true;
		}
		

		$scope.initViewDealer = function(){
			$scope.init();
			var dealerId = $scope.dealerId;

			$scope.oneAtATime = true;		

		    $scope.status = {
		      isFirstOpen: true,
		      isFirstDisabled: false
		    };

		    $scope.removeBranch = function(dealerId,branchId){		    	
				dialogs.confirm('Confirm', 'Are you sure you want to delete?').result
				.then(function(btn){
					console.log('yes');
					var baseRemoveBranch = Restangular.one('dealers/'+dealerId+'/branch/'+branchId);
					baseRemoveBranch.remove().then(function(rsp){
						if(rsp.meta.status == 200){
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
							$scope.initViewDealer();
						}else{
							$scope.alerts = [];
							$scope.alerts.push({type: 'danger', msg: rsp.meta.msg});
						}
					});
				});
		    };


		    $scope.deleteModel = function(makeId, modelId){
				$scope.init();				
				dialogs.confirm('Confirm', 'Are you sure you want to delete?').result
				.then(function(btn){
					console.log('yes');					
					var baseRemoveModel = Restangular.one('dealers/'+$scope.dealerId+'/make/'+makeId+'/model/'+modelId);
					baseRemoveModel.remove().then(function(rsp){
						if(rsp.meta.status == 200){
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
							$scope.initViewDealer();
						}else{
							$scope.alerts = [];
							$scope.alerts.push({type: 'danger', msg: rsp.meta.msg});
						}
					});
				});
			};

			$scope.deleteMake = function(makeId){
				$scope.init();				
				dialogs.confirm('Confirm', 'Are you sure you want to delete?').result
				.then(function(btn){
					console.log('yes');					
					var baseRemoveMake = Restangular.one('dealers/'+$scope.dealerId+'/make/'+makeId);
					baseRemoveMake.remove().then(function(rsp){
						if(rsp.meta.status == 200){
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
							$scope.initViewDealer();
						}else{
							$scope.alerts = [];
							$scope.alerts.push({type: 'danger', msg: rsp.meta.msg});
						}
					});
				});
			};

			var baseDealer = Restangular.one('dealers', dealerId);
			baseDealer.get().then(function(dealer){				
				$scope.dealer = dealer;
				$scope.image = dealer.image_url + "?timestamp=" + Date.now();				
			});
		};
	
		// Converting cropped Image dataURI to blob
        $scope.dataURIToBlob = function(dataURI){
          console.log("dataURI", dataURI);
          
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
    	// End of dataURI to Blob function   

						
		$scope.initEditDealer = function() {
			$scope.init();							
			var dealerId = $stateParams.dealerId;
													
			$scope.myImage='';
			$scope.myCroppedImage='';
         	$scope.editImage = true;
          	$scope.imgExists = false;
					       					       
			$scope.imageFile;
			$scope.onFileSelect = function($files){
				console.log("$files",$files )
				if($files.length != 0){ 
	              $scope.imgExists = true;
	                var file = $files[0];
	                var reader = new FileReader();
	                reader.onload = function ($files) {
	                  $scope.$apply(function($scope){
	                    $scope.myImage= $files.target.result;
	                  });
	                };
	                reader.readAsDataURL(file);
	            }  								
			};

			$scope.addNewPhone = function() {
				$scope.dealer.phone.push("");
				$scope.index++;
				$scope.newPhone=null;
			};
			$scope.deletePhone = function(index) {								
				$scope.dealer.phone.splice(index, 1);
			};

			$scope.addNewUnique = function() {
				$scope.dealer.unique_feature.push("");
				$scope.index++;
				$scope.newunique_feature=null;
			};

			$scope.deleteUnique = function(index) {
				$scope.dealer.unique_feature.splice(index, 1);							
			};

							
			var image = new Image();
			image.onload = function(){
				document.querySelector("#dealerImage").getContext("2d").drawImage(this,0,0);
			};
						
			$scope.getDealer = function(dealerId) {
				var baseDealer = Restangular.one('dealers', dealerId);			 	
			 	baseDealer.get().then(
					function(dealer){						
						$scope.dealer = dealer;						
						$scope.image = dealer.image_url + "?timestamp=" + Date.now();
					}, function(rsp) {
						console.log(rsp);
					});
			};

			$scope.updateDealer = function() {
				console.log("dealer", $scope.dealer);							
		        var croppedImage = document.querySelector('#croppedImage').getAttribute("ng-src");
		        var blob = $scope.dataURIToBlob(croppedImage);                            
		       	$scope.dealer.plan = $scope.dealer.plan._id;																
				var editDealer = Restangular.copy($scope.dealer);
				editDealer.put().then(function(data) {								
					$scope.data = data;
					if (data.meta.status == 200) {						
						if($scope.imgExists){							 
				              // GET S3POLICY AND SIGNATURE FROM SERVER              
				                var getPolicy = Restangular.one('s3Policy');                
				                getPolicy.get({mimeType: blob.type, type: "dealers"}).then(function(data){
				                console.log("getPolicy rsp :",data.response);
				                    
			                    // SENDS DEALERS CROPPED IMAGE FILE TO AMAZON S3
			                      $scope.upload = Upload.upload({
			                          url: 'https://' + data.response.bucket + '.s3.amazonaws.com/',
			                          method: 'POST',
			                          fields: {
			                            key: data.response.keyPath + dealerId + '.' + blob.type.substring(6),
			                            AWSAccessKeyId: data.response.AWSAccessKeyId,
			                            acl: 'public-read',
			                            'success_action_status' : '201',
			                            policy: data.response.s3Policy,
			                            signature: data.response.s3Signature,
			                            "Content-Type": blob.type,
			                          },
			                          file: blob,
			                      });
			                      $scope.upload.then(function(response){
			                          if(response.status === 201){			                              
			                              var x2js = new X2JS();
			                              var data = x2js.xml_str2json(response.data);
			                              console.log("amazon rsp data:", data);
			                              var parsedData;
			                              parsedData = {
			                                  location: data.PostResponse.Location,
			                                  bucket: data.PostResponse.Bucket,
			                                  key: data.PostResponse.Key,
			                                  etag: data.PostResponse.ETag
			                              };			                              
			                              // SEND AMAZON S3 FILE TO SERVER CONTROLLER
			                              var dealerId = $stateParams.dealerId;
			                              var baseChangeImage = Restangular.one('dealers/' + dealerId + '/image-url');
			                              baseChangeImage.image_url = parsedData.location;
			                              baseChangeImage.put().then(function(data){
			                                $scope.data = data;
			                                $scope.status = data.meta.status + ":" + data.meta.msg;
			                                if(data.meta.status == 200) {                                    
			                                    $scope.alerts = [];
			                                    $scope.alerts.push({type: 'success',
			                                    msg: 'Image uploaded successfully'});                        
			                                }else{
			                                  $scope.alerts = [];
			                                  $scope.alerts.push({type: 'danger',
			                                    msg: 'Image upload failed'});
			                                }
			                            }, function(response){
			                              console.log(response);
			                              $scope.alerts = [];
			                              $scope.alerts.push({type: 'danger',
			                                msg: "Unable to upload!"});
			                              });  
			                          }else{
			                              console.log("upload Failed");
			                          }
			                      });                      
				                });
						}else{
							$scope.alerts = [];
							$scope.alerts.push({
								type : 'success',
								msg : data.meta.msg
							});
						}
					} else {
						$scope.alerts = [];
						$scope.alerts.push({
							type : 'danger',
							msg : data.meta.msg
						});
					}
				});
			};
		
			$scope.getDealer(dealerId);
								
		};
});
'use strict'; 

angular.module('autodealerApp').controller('AdsmediaCtrl',
	function($scope, Restangular, dialogs, $stateParams, Auth, Upload) {
		$scope.init = function() {
		
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
			$scope.OriginalImg = "#OriginalImg";
			$scope.Img = "Img";
			$scope.AdsThumbIMg = "#ThumbIMg";
			$scope.ThumbIMg = "ThumbIMg";
		};

		if(Auth.isStaff() || Auth.isCustomer()){
			$scope.staffOrCustomer = true;
		}

		if(Auth.isBranchAdmin() || Auth.isStaff() || Auth.isCustomer()){
			$scope.deleteAction = false;
		}else{
			$scope.deleteAction = true;
		}

		$scope.initAdsmedia = function(){
			$scope.init();
			
			$scope.filterOptions = {
				filterText : "",
				useExternalFilter : true
			};

			$scope.currentPage = 1;
			$scope.numPerPage = 20;
			$scope.maxPages = 4;

			var baseAdsmedia = Restangular.all('ads-media');
			baseAdsmedia.getList($scope.params).then(function(adsmedia){
				$scope.adsmedia = adsmedia;
				$scope.totalAdsMedia = $scope.adsmedia.length;
				
				var image = new Image();
					image.onload = function(){
						document.querySelector("#adsImage").getContext("2d").drawImage(this,0,0);
					};

				$scope.$watch('currentPage + numPerPage', function(){
					if($scope.currentPage > 0){
						var filters = {};
						$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
						filters.offset = $scope.offset;
						filters.limit = $scope.numPerPage;
						var baseAdsmedias = Restangular.all('ads-media');
						baseAdsmedias.getList(filters).then(function(adsmedias){
							$scope.adsmedias = adsmedias;
							return adsmedias;

						})
					}
				})
			});

			
		}
		$scope.deleteAdsMedia = function(row){
				var id = row;
				dialogs.confirm('Confirm', 'Are you sure you want delete ?').result
				.then(function(btn){
					console.log('yes');
					var adsmedias = Restangular.one('ads-media', id);
					adsmedias.remove().then(function(rsp){
						if(rsp.meta.status == 200){
							$scope.alerts = [];
							$scope.alerts.push({type: 'success',
												msg: rsp.meta.msg});
							$scope.initAdsmedia();
						}else{
							$scope.alerts = [];
							$scope.alerts.push({type: 'danger',
										msg: rsp.meta.msg});
						}

					});
				});
			}
		
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


//				create adsmedia	

			$scope.initCreateAdsmedia = function() {
				$scope.init();
				$scope.adsmedia = {};
				$scope.imageFile;
				$scope.createImage = true;
			    $scope.onFileSelect = function($files){
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

        $scope.addAdsmedia = function() { 
	        	var originalImg = document.querySelector('#OriginalImg').getAttribute("ng-src"); 
	        	var thumbImg = document.querySelector('#ThumbImg').getAttribute("ng-src"); 
	        	console.log("originalImg data:", originalImg);

	        	var baseAdsmedia = Restangular.all('ads-media');
	        	baseAdsmedia.post($scope.adsmedia).then(
	        		function(dataRsp) {
	        			console.log("data", dataRsp.meta.status);
	        			$scope.data = dataRsp;

    			if (dataRsp.meta.status == 201) {
    				if(originalImg){
    					var blob = $scope.dataURIToBlob(originalImg); 
    					
		               // GET S3POLICY AND SIGNATURE FROM SERVER              
		               var getPolicy = Restangular.one('s3Policy');                
		               getPolicy.get({mimeType: blob.type, type: $scope.Img}).then(function(data){
		               	console.log("getPolicy rsp :",data.response);
		               	console.log("Rsp :", dataRsp);

	                    // SENDS OFFERS CROPPED IMAGE FILE TO AMAZON S3
	                    $scope.upload = Upload.upload({
	                    	url: 'https://' + data.response.bucket + '.s3.amazonaws.com/',
	                    	method: 'POST',
	                    	fields: {
	                    		key: data.response.keyPath + dataRsp.response.adsmedia._id + '.' + blob.type.substring(6),
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
	                          // file.progress = parseInt(100);
	                          if(response.status === 201){
	                          	console.log("success..");
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
	                          	console.log("parsedData :", parsedData);
	                          
	                          	var baseChangeImage = Restangular.one('ads-media/' + dataRsp.response.adsmedia._id + '/image-url');
	                          	baseChangeImage.image_url = parsedData.location;
	                          	$scope.image_url = baseChangeImage.image_url;
	                          	/* Thuumb Url Save */
	                          	if(thumbImg){
	                          		var blob = $scope.dataURIToBlob(thumbImg); 
	                          		
					               // GET S3POLICY AND SIGNATURE FROM SERVER              
					               var getPolicy = Restangular.one('s3Policy');                
					               getPolicy.get({mimeType: blob.type, type: $scope.Img}).then(function(data){
					               	console.log("getPolicy rsp :",data.response);
					               	console.log("Rsp :", dataRsp);

				                    // SENDS OFFERS CROPPED IMAGE FILE TO AMAZON S3
				                    $scope.upload = Upload.upload({
				                    	url: 'https://' + data.response.bucket + '.s3.amazonaws.com/',
				                    	method: 'POST',
				                    	fields: {
				                    		key: data.response.keyPath + dataRsp.response.adsmedia._id + '.' + blob.type.substring(6),
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
				                          // file.progress = parseInt(100);
				                          if(response.status === 201){
				                          	console.log("success..");
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
				                          	/*$scope.imageUploads.push(parsedData);*/
				                          	$scope.thumb_imageUrl = parsedData.location;
				                          	console.log("$scope.image_Url", $scope.image_url);
				                          	console.log("$scope.thumb_imageUrl", $scope.thumb_imageUrl);
				                          	var baseChangeImage = Restangular.one('ads-media/' + dataRsp.response.adsmedia._id + '/image-url');
				                          	baseChangeImage.image_url = $scope.image_url;
				                          	baseChangeImage.thumbnail_url = $scope.thumb_imageUrl;
				                              //baseChangeImage.thumbnail_url = parsedData.location;
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
									}
								/* End Thumb Url */
								}else{
									console.log("upload Failed");
									}
								});                      
							});
							}else{
								$scope.alerts = [];
								$scope.alerts.push({type: 'success',
									msg: dataRsp.meta.msg});
								}
								} else {
									$scope.alerts = [];
									$scope.alerts.push({type: 'danger',
										msg: dataRsp.meta.msg});
									}
								}, function(response) {
								console.log(response);
								$scope.alerts = [];
								$scope.alerts.push({type: 'danger',
									msg: "Unable to add!"});
							});
						};
					};


			//						edit ads media

			$scope.initEditAdsmedia = function() {
				$scope.init();
				var adsmediaId = $stateParams.adsmediaId;
				$scope.imageFile;
				$scope.createImage = true;
				       
				        $scope.onFileSelect = function($files){
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

				        var image = new Image();
							image.onload = function(){
								document.querySelector("#OriginalImg").getContext("2d").drawImage(this,0,0);
							};

				        $scope.getAdsmedia = function(adsmediaId) {
				        	var baseAdsmedia = Restangular.one('ads-media', adsmediaId);
				        	baseAdsmedia.get().then(
				        		function(adsmedia){
				        			console.log("adsmedia", adsmedia);
				        			$scope.adsmedia = adsmedia;
				        		}, function(rsp) {
				        			console.log(rsp);
				        		});
				        };
//							update adsmedia

		$scope.updateAdsmedia = function() {
			var originalImg = document.querySelector('#OriginalImg').getAttribute("ng-src"); 
			var thumbImg = document.querySelector('#ThumbImg').getAttribute("ng-src"); 
			console.log("originalImg data:", originalImg);

			var editAdsmedia = Restangular.copy($scope.adsmedia);
			editAdsmedia.put().then(
				function(data) {
					console.log("data...", data);
					$scope.data = data;
					if (data.meta.status == 200) {
						if(originalImg){
							var blob = $scope.dataURIToBlob(originalImg); 
							/*$scope.imageUploads = [];*/
		               // GET S3POLICY AND SIGNATURE FROM SERVER              
		               var getPolicy = Restangular.one('s3Policy');                
		               getPolicy.get({mimeType: blob.type, type: $scope.Img}).then(function(data){
		               	console.log("getPolicy rsp :",data.response);
		               	console.log("Rsp.. :", data);

		                // SENDS OFFERS CROPPED IMAGE FILE TO AMAZON S3
		                $scope.upload = Upload.upload({
		                	url: 'https://' + data.response.bucket + '.s3.amazonaws.com/',
		                	method: 'POST',
		                	fields: {
		                		key: data.response.keyPath + adsmediaId + '.' + blob.type.substring(6),
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
		                  // file.progress = parseInt(100);
		                  if(response.status === 201){
		                  	console.log("success..");
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
		                  	console.log("parsedData :", parsedData);
		                  	/*$scope.imageUploads.push(parsedData);*/
		                  	var baseChangeImage = Restangular.one('ads-media/' + adsmediaId + '/image-url');
		                  	baseChangeImage.image_url = parsedData.location;
		                  	$scope.image_url = baseChangeImage.image_url;
		                  	/* Thuumb Url Save */
		                  	if(thumbImg){
		                  		var blob = $scope.dataURIToBlob(thumbImg); 
		                  		/*$scope.imageUploads = [];*/
				               // GET S3POLICY AND SIGNATURE FROM SERVER              
				               var getPolicy = Restangular.one('s3Policy');                
				               getPolicy.get({mimeType: blob.type, type: $scope.Img}).then(function(data){
				               	console.log("getPolicy rsp :",data.response);
				               	console.log("Rsp :", data);

			                    // SENDS OFFERS CROPPED IMAGE FILE TO AMAZON S3
			                    $scope.upload = Upload.upload({
			                    	url: 'https://' + data.response.bucket + '.s3.amazonaws.com/',
			                    	method: 'POST',
			                    	fields: {
			                    		key: data.response.keyPath + adsmediaId + '.' + blob.type.substring(6),
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
		                          // file.progress = parseInt(100);
		                          if(response.status === 201){
		                          	console.log("success..");
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
		                          	/*$scope.imageUploads.push(parsedData);*/
		                          	$scope.thumb_imageUrl = parsedData.location;
		                          	console.log("$scope.image_Url", $scope.image_url);
		                          	console.log("$scope.thumb_imageUrl", $scope.thumb_imageUrl);
		                          	var baseChangeImage = Restangular.one('ads-media/' + adsmediaId + '/image-url');
		                          	baseChangeImage.image_url = $scope.image_url;
		                          	baseChangeImage.thumbnail_url = $scope.thumb_imageUrl;
		                              //baseChangeImage.thumbnail_url = parsedData.location;
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
							}
							/* End Thumb Url */
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
			}, function(response) {
					console.log(response);
					$scope.alerts = [];
					$scope.alerts.push({type: 'danger',
						msg: "Unable to update!"});
				});
				};
				$scope.getAdsmedia(adsmediaId);
			};
		});
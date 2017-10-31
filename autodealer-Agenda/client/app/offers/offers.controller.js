'use strict'; 

angular.module('autodealerApp')
		.controller('OffersCtrl',
				function($scope, Restangular, dialogs, $stateParams, Auth, Upload) {
					$scope.init = function() {
						/*$scope.access = Auth.isManager();
						$scope.accessSales = Auth.isSales();
						$scope.customer = Auth.isCustomer();
						$scope.staff = Auth.isStaff();
						$scope.engineer = Auth.isEngineer();*/
						$scope.alerts = [];
						$scope.closeAlert = function(index) {
							$scope.alerts.splice(index, 1);
						};
					};

			if(Auth.isStaff() || Auth.isCustomer()){
				$scope.staffOrCustomer = true;
			}

			if(Auth.isBranchAdmin() || Auth.isStaff() || Auth.isCustomer()){
				$scope.deleteAction = false;
			}else{
				$scope.deleteAction = true;
			}		


			$scope.initOffers = function(){
				$scope.init();
				$scope.filterOptions = {
					filterText : "",
					useExternalFilter : true
				};

				$scope.currentPage = 1;
				$scope.numPerPage = 20;
				$scope.maxPages = 4;

				var baseOffers = Restangular.all('offers');
				baseOffers.getList().then(function(offers){
					$scope.offers = offers;
					$scope.totalOffers = $scope.offers.length;

				var image = new Image();
					image.onload = function(){
					document.querySelector("#offersImage").getContext("2d").drawImage(this,0,0);
					};

				$scope.$watch('currentPage + numPerPage', function(){
					if($scope.currentPage > 0){
					var filters = {};
					$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
					filters.offset = $scope.offset;
					filters.limit = $scope.numPerPage;
					var baseOffers = Restangular.all('offers');
					baseOffers.getList(filters).then(function(offersList){
						$scope.offersList = offersList;
						$scope.totaloffers = offersList.length;
						return offersList;
						})
					 }
					})
				});
			}
			// single delete
			$scope.deleteOffers = function(row){
				var id = row;
				console.log("id", row);
				dialogs.confirm('Confirm', 'Are you want to delete?').result
				.then(function(btn){
					console.log('yes');
					var offers = Restangular.one('offers', id);
					offers.remove().then(function(rsp){
						if(rsp.meta.status == 200){
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
							$scope.initOffers();
						}else{
							$scope.alerts = [];
							$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
						}
					});
				});
			}
			/*
					$scope.initOffers = function() {
						$scope.init();
						$scope.filterOptions = {
							filterText : "",
							useExternalFilter : true
						};
						$scope.totalServerItems = 0;
						$scope.pagingOptions = {
							pageSizes : [ 15, 25, 50 ],
							pageSize : 15,
							currentPage : 1
						};
						$scope.getList = function() {
						  $scope.getOffersPagedDataAsync($scope.params);
						};
						
						$scope.maxPages = function() {
							return parseInt(Math.ceil($scope.totalServerItems / $scope.pagingOptions.pageSize));
						};
						
						$scope.validateCurrentPage = function() {
							if($scope.pagingOptions.currentPage > $scope.maxPages()) {
								$scope.pagingOptions.currentPage = $scope.maxPages();
							}
							if($scope.pagingOptions.currentPage < 1) {
								$scope.pagingOptions.currentPage = 1;
							}
							$scope.pagingOptions.currentPage = parseInt($scope.pagingOptions.currentPage);
						};
						$scope.$watch('totalServerItems', function(newVal, oldVal) {
							if(newVal !== oldVal) {
								$scope.validateCurrentPage();
							}
						}, true);
						
						$scope.$watch('pagingOptions', function(newVal, oldVal) {
											console.log(newVal);
											console.log(oldVal);
											if(newVal.currentPage !== oldVal.currentPage) {
												$scope.validateCurrentPage();
											}
											$scope.getOffersPagedDataAsync($scope.params);
										}, true);
					
						$scope.mySelection = [];

						$scope.gridOptions = {
							data : 'offers',
							enablePaging : true,
							showFooter : true,
							totalServerItems : 'totalServerItems',
							pagingOptions : $scope.pagingOptions,
							filterOptions : $scope.filterOptions,
							selectedItems : $scope.mySelection,
							keepLastSelected: false,
							multiSelect: Auth.isManager(),
							selectWithCheckboxOnly :Auth.isManager(),
							showSelectionCheckbox :Auth.isManager(),
						};
						$scope.gridOptions.columnDefs = [
								{
									field : 'image',
									displayName : 'Logo'
								},{
									field : 'name',
									displayName : 'Offer Name'
								},{
									field : 'from',
									displayName : 'From',
									cellFilter: 'date:\'dd/MM/yyyy \''
								},{
									field : 'to',
									displayName : 'to',
									cellFilter: 'date:\'dd/MM/yyyy \''
								},{
									field : '',
									displayName : 'Actions',
									sortable : false,
									cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
											+ '<a href="javascript:void(0)" ng-show="access || accessSales" ui-sref="^.edit({offersId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a>'

											+ '<a href="javascript:void(0)" ng-show="customer || engineer || staff || engineer" ui-sref="^.view({offersId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-primary" data-original-title="View">View</a>'

											+ '<a href="javascript:void(0)"'
											+ ' ng-click="deleteRow(row)" ng-show="access" data-toggle="tooltip" title=""'
											+ ' class="btn btn-danger" data-original-title="Delete"><i class="fa fa-times"></i></a></div></div>'
								} ];
						
						
//						delete function
						
						$scope.deleteRow = function(row) {
							dialogs.confirm('Confirm',
									'Are you sure you want to delete?').result
									.then(function(btn) {
										console.log('yes');
										var offersToDelete = row.entity;
										offersToDelete.remove({
											
										}).then(function(rsp) {
											console.log(rsp);
											if (rsp.meta.status == 200) {
												$scope.alerts = [];
												$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
												$scope.loadOffersTable();
											} else {
												$scope.alerts = [];
												$scope.alerts.push({type: 'danger',
													msg: rsp.meta.msg});
											}
										});
									}, function(btn) {
										console.log('no');
									});
						};
						
		//			multiple deletions
						
						$scope.multiDelete = function(){
						if($scope.mySelection.length >= 1){
						dialogs.confirm('Confirm',
						'Are you sure you want to delete?').result
						.then(function(btn) {
							$scope.init();
							$scope.mySelectionIds = [];
							for(var i=0; i < $scope.mySelection.length; i++){
								$scope.mySelectionIds[i] = $scope.mySelection[i]._id;
							}
							console.log("Array of ids:", $scope.mySelectionIds);
							
							var baseOffers = Restangular.all('offers');
							baseOffers.customDELETE('', '', {'Content-Type': 'application/json'},
									{ids: $scope.mySelectionIds}).then(function(data) {
							    console.log("data:",data);
							    $scope.data = data;
							    $scope.status = data.meta.status + ": " + data.meta.msg;    
					    		
							    if (data.meta.status == 200) {
								    $scope.alerts = [];
							    	$scope.alerts.push({type: 'success',
										msg: data.meta.msg});
							    	$scope.loadOffersTable();
							    	$scope.gridOptions.selectAll(false);
							    } else {
							    	$scope.alerts = [];
							    	$scope.alerts.push({type: 'danger',
										msg: data.meta.msg});
							    }						
							  }, function(response) {
							    console.log(response);
							    $scope.alerts = [];
							    $scope.alerts.push({type: 'danger',
									msg: "Unable to delete!"});
							  });
							},
							function(btn) {
								console.log('no');
							});
						}else{
						$scope.alerts = [];
						$scope.alerts.push({type: 'danger',
						msg: "Select Offers to delete"});
					}
				};
						
//				get Offers in index page
						
					$scope.getOffersPagedDataAsync = function(filters) {
						var pageSize = $scope.pagingOptions.pageSize;
						var page = $scope.pagingOptions.currentPage;
						var offset = (page - 1) * pageSize;
						var limit = $scope.pagingOptions.pageSize;
						$scope.getOffers(filters, offset, limit).then(
								function(offers) {
									$scope.setPagingData(offers, page,
											pageSize, offers.total);
								});
					};

					$scope.getOffers = function(filters, offset, limit) {
						var baseOffers = Restangular.all('offers');
						filters = filters ? filters : {};
						filters.offset = offset;
						filters.limit = limit;
						return baseOffers.getList(filters).then(
								function(offers) {
									
									return offers;
								});
					};

					$scope.setPagingData = function(data, page, pageSize,
							total) {
						$scope.offers = data;
						$scope.totalServerItems = total;
						if (!$scope.$$phase) {
							$scope.$apply();
						}
					};

					$scope.loadOffersTable = function() {
						$scope.getOffersPagedDataAsync($scope.params);
					};

					$scope.loadOffersTable();
				};
			*/		
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

		
		$scope.initAllBranches = function() {
		$scope.init();
		var baseAllBranches = Restangular.all('dealers/branches/all');
		return baseAllBranches.getList().then(function(branches) {					
			$scope.allBranches = branches;
			return branches;
		});
	  };				
//					create Offers

				$scope.initCreateOffers = function() {
						$scope.init();
						$scope.offers = {};
						$scope.imageFile;
						$scope.myImage='';
				        $scope.myCroppedImage='';
				        $scope.editImage = true;
				        $scope.imgExists = false;

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

						$scope.addOffers = function() {
							var croppedImage = document.querySelector('#croppedImage').getAttribute("ng-src");                                  
					        console.log("croppedImage data:", croppedImage);
					        console.log("typeof croppedImage: ", typeof(croppedImage));               

					        var blob = $scope.dataURIToBlob(croppedImage);                            
					        console.log("blob Image:", blob);
					        
							var baseOffers = Restangular.all('offers');
							/*baseOffers.post($scope.offers).then(
									function(data) {
										console.log("data", data);
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
									});*/

					baseOffers.post($scope.offers).then(
							function(dataRsp) {
								console.log("data", dataRsp);
								$scope.data = dataRsp;
//										$scope.status = data.meta.status + ": " + data.meta.msg;
								
						if (dataRsp.meta.status == 201) {
							// Image Upload on S3 Amazon
							if($scope.imgExists){
							 $scope.imageUploads = [];
				              // GET S3POLICY AND SIGNATURE FROM SERVER              
				                var getPolicy = Restangular.one('s3Policy');                
				                getPolicy.get({mimeType: blob.type, type: "offers"}).then(function(data){
				                    console.log("getPolicy rsp :",data.response);
				                    console.log("Rsp :", dataRsp);
				                    
			                    // SENDS OFFERS CROPPED IMAGE FILE TO AMAZON S3
			                      $scope.upload = Upload.upload({
			                          url: 'https://' + data.response.bucket + '.s3.amazonaws.com/',
			                          method: 'POST',
			                          fields: {
			                            key: data.response.keyPath + dataRsp.response.offers._id + '.' + blob.type.substring(6),
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
			                          	  var x2js = new X2JS();
			                              /*var data = xml2json.parser(response.data);*/
			                              var data = x2js.xml_str2json(response.data);
			                              console.log("amazon rsp data:", data);
			                              var parsedData;
			                              /*parsedData = {
			                                  location: data.postresponse.location,
			                                  bucket: data.postresponse.location,
			                                  key: data.postresponse.key,
			                                  etag: data.postresponse.etag
			                              };*/

			                              parsedData = {
			                                  location: data.PostResponse.Location,
			                                  bucket: data.PostResponse.Bucket,
			                                  key: data.PostResponse.Key,
			                                  etag: data.PostResponse.ETag
			                              };
			                              console.log("parsedData :", parsedData);
			                              $scope.imageUploads.push(parsedData);
			                              //var image_url = parsedData.location;
			                              //$rootScope.$broadcast("update_image", image_url);
			                              // SEND AMAZON S3 FILE TO SERVER CONTROLLER
			                              /*var offerId = $scope.offerId;*/
			                              var baseChangeImage = Restangular.one('offers/' + dataRsp.response.offers._id + '/image-url');
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
							}
							//
							else{
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
						

//						edit offers
						
						$scope.initEditOffer = function() {

							var offerId = $stateParams.offersId;
							$scope.init();
							$scope.imageFile;
							console.log("OFFF", offerId);
							$scope.myImage='';
				          	$scope.myCroppedImage='';
				          	$scope.editImage = true;
				          	$scope.imgExists = false;
				          	console.log("imgExists", $scope.imgExists);
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
								/*console.log("imageFile", $files);
								$scope.imageFile = $files[0];*/
							};

							var image = new Image();
							image.onload = function(){
								document.querySelector("#offerImage").getContext("2d").drawImage(this,0,0);
							};
							/*image.src = "http://localhost:9000/image/offer/" +offerId + ".jpg";*/
							
							console.log("offer", offerId);
							$scope.getOffers = function(offerId) {
							var baseOffers = Restangular.one('offers', offerId);
							 baseOffers.get().then(
									function(offers){
										console.log("offers", offers);
										$scope.offers = offers;
										$scope.image = offers.image_url + "?timestamp=" + Date.now();
									}, function(rsp) {
										console.log(rsp);
									});
							};
//							update offers

								$scope.updateOffer = function() {
							     var croppedImage = document.querySelector('#croppedImage').getAttribute("ng-src");                                  
						       	 console.log("croppedImage data:", croppedImage);
						         console.log("typeof croppedImage: ", typeof(croppedImage));               

						         /*var blob = $scope.dataURIToBlob(croppedImage);                            
						       	 console.log("blob Image:", blob);	*/

								var editOffer = Restangular.copy($scope.offers);
								editOffer.put().then(
										function(data) {
											console.log("data...", data);
											$scope.data = data;
											/*if (data.meta.status == 200) {
													$scope.alerts = [];
													$scope.alerts.push({
														type : 'success',
														msg : data.meta.msg
													});
											} */
						if (data.meta.status == 200) {
							if($scope.imgExists){
										/*$scope.image = new FormData();
										$scope.image.append('file', blob, $stateParams.offersId);

										var offerImgUpload = Restangular.one('offers',$stateParams.offersId);
										offerImgUpload.withHttpConfig({transformRequest: angular.identify})
										.customPOST($scope.image, 'image/upload',undefined, {'content-Type': undefined})
												.then(function(data){
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
										});	*/
						$scope.imageUploads = [];
				          // GET S3POLICY AND SIGNATURE FROM SERVER              
			                var getPolicy = Restangular.one('s3Policy');                
			                getPolicy.get({mimeType: blob.type, type: "offers"}).then(function(data){
			                    console.log("getPolicy rsp :",data.response);
			                    /*console.log("Rsp :", data);*/
			                    
		                    // SENDS OFFERS CROPPED IMAGE FILE TO AMAZON S3
		                      $scope.upload = Upload.upload({
		                          url: 'https://' + data.response.bucket + '.s3.amazonaws.com/',
		                          method: 'POST',
		                          fields: {
		                            key: data.response.keyPath + offerId + '.' + blob.type.substring(6),
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
		                              $scope.imageUploads.push(parsedData);
		                              //var image_url = parsedData.location;
		                              //$rootScope.$broadcast("update_image", image_url);
		                              // SEND AMAZON S3 FILE TO SERVER CONTROLLER
		                              var offerId = $stateParams.offersId;
		                              console.log("Offer", offerId);
		                              var baseChangeImage = Restangular.one('offers/' + offerId + '/image-url');
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
						}
							else {
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
						$scope.getOffers(offerId);
							
					};
				});
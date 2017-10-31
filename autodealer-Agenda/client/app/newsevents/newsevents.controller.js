'use strict'; 

angular.module('autodealerApp')
		.controller('NewseventsCtrl',
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
						$scope.OriginalImg = "#OriginalImg";
						$scope.Img = "NewsImg";
						$scope.AdsThumbIMg = "#ThumbIMg";
						$scope.ThumbIMg = "NewsThumbIMg";
					};

			if(Auth.isStaff() || Auth.isCustomer()){
				$scope.staffOrCustomer = true;
			}

			if(Auth.isBranchAdmin() || Auth.isStaff() || Auth.isCustomer()){
				$scope.deleteAction = false;
			}else{
				$scope.deleteAction = true;
			}		

			$scope.initNewsevents = function(){
				$scope.init();
				$scope.filterOptions = {
					filterText : "",
					useExternalFilter : true
				};

				$scope.currentPage = 1;
				$scope.numPerPage = 5;
				$scope.maxPages = 4;

				var baseNewsevent = Restangular.all('news-events');
				baseNewsevent.getList().then(function(newsevents){
					$scope.newsevents = newsevents;
					$scope.total = $scope.newsevents.length;

					var image = new Image();
					image.onload = function(){
						document.querySelector("#newsevents").getContext("2d").drawImage(this,0,0);
					}

					$scope.$watch('currentPage + numPerPage', function(){
						if($scope.currentPage > 0){
							var filters = {};
							$scope.offset = ($scope.currentPage -1) * $scope.numPerPage;
							filters.offset = $scope.offset;
							filters.limit = $scope.numPerPage;
							var baseNewsevents = Restangular.all('news-events');
							baseNewsevents.getList(filters).then(function(newsevents){
								$scope.newsevents = newsevents;
								return newsevents;
							})
						}

					})
				})
			}
			// single delete

			$scope.deleteNewsEvents = function(row){
				var id = row;
				console.log("id", id);
				dialogs.confirm('Confirm', 'Are you sure you want to delete ?').result
				.then(function(btn){
					console.log('yes');
					var baseNewsevents = Restangular.one('news-events', id);
					baseNewsevents.remove().then(function(rsp){
						if(rsp.meta.status == 200){
							$scope.alerts = [];
							$scope.alerts.push({type: 'Success', msg: rsp.meta.msg});
							$scope.initNewsevents();
						}else{
							$scope.alerts = [];
							$scope.alerts.push({type:'Danger', msg: rsp.meta.msg});
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
			/*
					$scope.initNewsevents = function() {
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
						  $scope.getNewseventsPagedDataAsync($scope.params);
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
											$scope.getNewseventsPagedDataAsync($scope.params);
										}, true);
					
						$scope.mySelection = [];

						$scope.gridOptions = {
							data : 'newsevents',
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
									field : 'event_name',
									displayName : 'Event Name'
								},{
									field : 'address',
									displayName : 'address'
								},{
									field : 'from',
									displayName : 'From',
									cellFilter: 'date:\'dd/MM/yyyy \''
								},{
									field : 'to',
									displayName : 'To',
									cellFilter: 'date:\'dd/MM/yyyy \''
								},{
									field : '',
									displayName : 'Actions',
									sortable : false,
									cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
											+ '<a href="javascript:void(0)" ng-show="access || accessSales" ui-sref="^.edit({newseventsId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a>'
											+ '<a href="javascript:void(0)" ng-show="customer || staff || engineer" ui-sref="^.view({newseventsId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-primary" data-original-title="Edit">View</a>'
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
										var newseventToDelete = row.entity;
										newseventToDelete.remove({
											
										}).then(function(rsp) {
											console.log(rsp);
											if (rsp.meta.status == 200) {
												$scope.alerts = [];
												$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
												$scope.loadNewseventsTable();
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
							
							var baseNewsevent = Restangular.all('news-events');
							baseNewsevent.customDELETE('', '', {'Content-Type': 'application/json'},
									{ids: $scope.mySelectionIds}).then(function(data) {
							    console.log("data:",data);
							    $scope.data = data;
							    $scope.status = data.meta.status + ": " + data.meta.msg;    
					    		
							    if (data.meta.status == 200) {
								    $scope.alerts = [];
							    	$scope.alerts.push({type: 'success',
										msg: data.meta.msg});
							    	$scope.loadNewseventsTable();
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
						msg: "Select NewsEvents to delete"});
					}
				};
						
//				get News Event in index page
						
						$scope.getNewseventsPagedDataAsync = function(filters) {
							var pageSize = $scope.pagingOptions.pageSize;
							var page = $scope.pagingOptions.currentPage;
							var offset = (page - 1) * pageSize;
							var limit = $scope.pagingOptions.pageSize;
							$scope.getNewsevents(filters, offset, limit).then(
									function(newsevents) {
										$scope.setPagingData(newsevents, page,
												pageSize, newsevents.total);
									});
						};

						$scope.getNewsevents = function(filters, offset, limit) {
							var baseNewsevent = Restangular.all('news-events');
							filters = filters ? filters : {};
							filters.offset = offset;
							filters.limit = limit;
							return baseNewsevent.getList(filters).then(
									function(newsevents) {
										console.log(newsevents);
										return newsevents;
									});
						};

						$scope.setPagingData = function(data, page, pageSize,
								total) {
							$scope.newsevents = data;
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};

						$scope.loadNewseventsTable = function() {
							$scope.getNewseventsPagedDataAsync($scope.params);
						};

						$scope.loadNewseventsTable();
					};
					
	  			*/
						
//					create newsevents

				$scope.initCreateNewsevent = function() {
						$scope.init();
						$scope.newsevents = {};
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

				$scope.addNewsevents = function() {
					var originalImg = document.querySelector('#OriginalImg').getAttribute("ng-src"); 
		        	var thumbImg = document.querySelector('#ThumbImg').getAttribute("ng-src"); 
		        	console.log("originalImg data:", originalImg);

					var baseNewsevent = Restangular.all('news-events');
					baseNewsevent.post($scope.newsevents).then(
					function(dataRsp) {
					console.log("data::", dataRsp);
					$scope.data = dataRsp;

					if (dataRsp.meta.status == 201) {
						if(originalImg){
						var blob = $scope.dataURIToBlob(originalImg); 
    					/*$scope.imageUploads = [];*/
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
	                    		key: data.response.keyPath + dataRsp.response.newsevents._id + '.' + blob.type.substring(6),
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
	                          	var baseChangeImage = Restangular.one('news-events/' + dataRsp.response.newsevents._id + '/image-url');
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
					               	console.log("Rsp :", dataRsp);

				                    // SENDS OFFERS CROPPED IMAGE FILE TO AMAZON S3
				                    $scope.upload = Upload.upload({
				                    	url: 'https://' + data.response.bucket + '.s3.amazonaws.com/',
				                    	method: 'POST',
				                    	fields: {
				                    		key: data.response.keyPath + dataRsp.response.newsevents._id + '.' + blob.type.substring(6),
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
				                          	var baseChangeImage = Restangular.one('news-events/' + dataRsp.response.newsevents._id + '/image-url');
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


//						edit newsevents
						
						$scope.initEditNewsevent = function() {
					
							$scope.init();
							var newseventId = $stateParams.newseventsId;
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

							console.log("newseventId", newseventId);
							$scope.getNewsevents = function(newseventId) {
							var baseNewsevent = Restangular.one('news-events', newseventId);
							 baseNewsevent.get().then(
									function(newsevents){
										console.log("newsevents", newsevents);
										$scope.newsevents = newsevents;
									}, function(rsp) {
										console.log(rsp);
									});
							};
//							update newsevents

					$scope.updateNewsevent = function() {
					var originalImg = document.querySelector('#OriginalImg').getAttribute("ng-src"); 
		        	var thumbImg = document.querySelector('#ThumbImg').getAttribute("ng-src"); 
			    	console.log("originalImg data:", originalImg);

					var editNewsevent = Restangular.copy($scope.newsevents);
					editNewsevent.put().then(
					 function(dataRsp) {
						console.log("data...", dataRsp);
						$scope.data = dataRsp;
					   if (dataRsp.meta.status == 200) {
						if(originalImg){
						var blob = $scope.dataURIToBlob(originalImg); 
    					/*$scope.imageUploads = [];*/
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
	                    		key: data.response.keyPath + newseventId + '.' + blob.type.substring(6),
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
	                          	var baseChangeImage = Restangular.one('news-events/' + newseventId + '/image-url');
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
					               	console.log("Rsp :", dataRsp);

				                    // SENDS OFFERS CROPPED IMAGE FILE TO AMAZON S3
				                    $scope.upload = Upload.upload({
				                    	url: 'https://' + data.response.bucket + '.s3.amazonaws.com/',
				                    	method: 'POST',
				                    	fields: {
				                    		key: data.response.keyPath + newseventId + '.' + blob.type.substring(6),
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
			                          	var baseChangeImage = Restangular.one('news-events/' + newseventId + '/image-url');
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
									msg : dataRsp.meta.msg
								});
							}
						} else {
							$scope.alerts = [];
							$scope.alerts.push({
								type : 'danger',
								msg : dataRsp.meta.msg
							});
						}
					}, function(response) {
						console.log(response);
						$scope.alerts = [];
						$scope.alerts.push({type: 'danger',
							msg: "Unable to update!"});
					});
					};
					$scope.getNewsevents(newseventId);
						
				};
		});
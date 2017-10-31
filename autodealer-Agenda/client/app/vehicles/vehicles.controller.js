'use strict'; 

angular.module('autodealerApp')
		.controller('VehiclesCtrl',
				function($scope, Restangular, dialogs, $stateParams, Auth, Upload) {
					$scope.init = function() {	
					$scope.params = {};
					$scope.currentUser = Auth.getCurrentUser();
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
			$scope.initAllVehicles();
		}

		$scope.reset = function(){
			$scope.params = "";
			$scope.initAllVehicles($scope.params)
		}
		$scope.initVehicles = function(){
			$scope.init();
			
			$scope.filterOptions = {
				filterText : "",
				useExternalFilter : true
			};
		$scope.initAllVehicles = function(){
			$scope.currentPage = 1;
			$scope.numPerPage = 20;
			$scope.maxPages = 4;

			var baseVehciles = Restangular.all('vehicles');
			baseVehciles.getList($scope.params).then(function(vehicles){
				$scope.vehicles = vehicles;
				
				console.log("totalVehicles", $scope.totalVehicles);
				
				/*for(var i=0; i < $scope.vehicles.length; i++){
					console.log("$scope.vehicles.dealers.makes", $scope.vehicles[i].dealer.makes);
						for(var j=0; j<$scope.vehicles[i].dealer.makes.length; j++){
							 console.log("$scope.vehicles[i].make", $scope.vehicles[i].make);
							 console.log("$scope.vehicles[i].dealer.makes[i]", $scope.vehicles[i].dealer.makes[j]._id);	
							if($scope.vehicles[i].dealer.makes[j]._id == $scope.vehicles[i].make){
								$scope.vehicles[i].make = $scope.vehicles[i].dealer.makes[j].name
								$scope.make = $scope.vehicles[i].make;
							}
						}
					}*/

				var dealerId = $scope.currentUser.dealer._id;
								var makeid = [];
								var ModelsId = [];
								//$scope.mySelectionIds = [];
								$scope.myModels = [];
								for(var i=0; i<$scope.vehicles.length; i++){
									$scope.mySelectionIds = $scope.vehicles[i].make;
									$scope.myModels = $scope.vehicles[i].model;
									ModelsId.push($scope.myModels);
									makeid.push($scope.mySelectionIds);
									}
									// get Makes List
								var MakesList = [];
								var ModelsList = [];
								console.log("MakesList", makeid.length);

								for(var i=0; i<makeid.length; i++){
									var baseMakes = Restangular.one('dealers/'+dealerId+ '/make/'+makeid[i]);
									baseMakes.get().then(function(makes){
										$scope.Makes = makes;
										$scope.MakName = $scope.Makes.make.name;
										MakesList.push($scope.MakName);
										$scope.Make = MakesList;
										console.log("MakesList", MakesList);
									});
								}
							for(var j=0; j<ModelsId.length; j++){
										console.log("ModelsId", ModelsId.length);
									var baseModel = Restangular.one('dealers/'+dealerId+ '/make/'+makeid[j]+ '/model/'+ModelsId[j]);
									baseModel.get().then(function(Models){
									$scope.Model = Models;
									$scope.ModelName = $scope.Model.model.name;
									ModelsList.push($scope.ModelName);
									$scope.Model = ModelsList;
									console.log("ModelsList", ModelsList);
									});
								}


				var image = new Image();
				image.onload = function(){
				document.querySelector("#vehiclesImage").getContext("2d").drawImage(this,0,0);
				};

				$scope.$watch('currentPage + numPerPage', function(){
					if($scope.currentPage > 0){
						var filters = {};
						$scope.offset = ($scope.currentPage - 1) * $scope.numPerPage;
						filters.offset = $scope.offset;
						filters.limit = $scope.numPerPage;
						$scope.params.offset = filters.offset;
						$scope.params.limit = filters.limit;
						var baseVehicles = Restangular.all('vehicles');
						baseVehicles.getList($scope.params).then(function(vehicles){
							$scope.vehicles = vehicles;
							$scope.totalVehicles = $scope.vehicles.length;
							console.log("vehiclesTotal", $scope.vehicles);
							return vehicles;
						})
					}
				});
			});
		  }
		}

		$scope.deleteVehicles = function(row){
			var id = row;
			console.log('id', id);
			dialogs.confirm('Confirm', 'Are you sure you want to delete ?').result
			.then(function(btn){
				console.log('yes');
				var baseVehicles = Restangular.one('vehicles', id);
				baseVehicles.remove().then(function(rsp){
					if(rsp.meta.status == 200){
						$scope.alerts = [];
						$scope.alerts.push({type: 'success', msg: rsp.meta.msg});
						$scope.initVehicles();
					}else{
						$scope.alerts = [];
						$scope.alerts.push({type: 'danger', msg: rsp.meta.msg});
					}
				})
			})
		}

		/*
					$scope.initVehicles = function() {
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
						  $scope.getVehiclesPagedDataAsync($scope.params);
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
						
						$scope.$watch('pagingOptions',
										function(newVal, oldVal) {
											console.log(newVal);
											console.log(oldVal);
											if(newVal.currentPage !== oldVal.currentPage) {
												$scope.validateCurrentPage();
											}
											$scope.getVehiclesPagedDataAsync($scope.params);
										}, true);

						$scope.mySelection = [];

						$scope.gridOptions = {
							data : 'vehicles',
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
									field : 'make.name',
									displayName : 'Make'
								},{
									field : 'model.name',
									displayName : 'Model'
								},{
									field : 'dealer.name',
									displayName : 'Dealer'
								},{
									field : 'ex_Showroom_price',
									displayName : 'Ex-Showroom Price'
								},{
									field : 'rto',
									displayName : 'RTO'
								},{
									field : 'on_road_price',
									displayName : 'On Road Price'
								},{
									field : '',
									displayName : 'Actions',
									sortable : false,
									cellTemplate : '<div class="text-center"><div class="btn-group btn-group-xs">'
											+ '<a href="javascript:void(0)" ng-show="access || accessSales" ui-sref="^.edit({vehiclesId: row.entity._id})"' 
											+ ' data-toggle="tooltip" title=""'
											+ ' class="btn btn-info" data-original-title="Edit"><i class="fa fa-pencil"></i></a>'
											+ '<a href="javascript:void(0)" ng-show="customer || staff || engineer" ui-sref="^.view({vehiclesId: row.entity._id})"' 
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
										var vehiclesToDelete = row.entity;
										vehiclesToDelete.remove({
											
										}).then(function(rsp) {
											// var index =
											// $scope.customers.indexOf(customerToDelete);
											console.log(rsp);
											
											if (rsp.meta.status == 200) {
												$scope.alerts = [];
												$scope.alerts.push({type: 'success',
														msg: rsp.meta.msg});
												
												$scope.loadVehiclesTable();
											} else {
												// display error msg
												// rsp.meta.msg
												$scope.alerts = [];
												$scope.alerts.push({type: 'danger',
													msg: rsp.meta.msg});
											}

										});
									}, function(btn) {
										console.log('no');
									});
							// row.entity.$deleteData({ testId:
							// row.entity.testId });
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
							
							var baseVehciles = Restangular.all('vehicles');
							baseVehciles.customDELETE('', '', {'Content-Type': 'application/json'},
									{ids: $scope.mySelectionIds}).then(function(data) {
							    console.log("data:",data);
							    $scope.data = data;
							    $scope.status = data.meta.status + ": " + data.meta.msg;    
					    		
							    if (data.meta.status == 200) {
								    $scope.alerts = [];
							    	$scope.alerts.push({type: 'success',
										msg: data.meta.msg});
							    	$scope.loadVehiclesTable();
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
						msg: "Select vehicles to delete"});
					}
				};

				
						
//				get Vehicles in index page
						
						$scope.getVehiclesPagedDataAsync = function(filters) {
							var pageSize = $scope.pagingOptions.pageSize;
							var page = $scope.pagingOptions.currentPage;
							var offset = (page - 1) * pageSize;
							var limit = $scope.pagingOptions.pageSize;
							$scope.getVehicles(filters, offset, limit).then(
							function(vehicles) {
							$scope.setPagingData(vehicles, page,
									pageSize, vehicles.total);
							});
						};

						$scope.getVehicles = function(filters, offset, limit) {
							var baseVehicles = Restangular.all('vehicles');
							filters = filters ? filters : {};
							filters.offset = offset;
							filters.limit = limit;
							return baseVehicles.getList(filters).then(
									function(vehicles) {
										console.log(vehicles);
										return vehicles;
									});
						};

						$scope.setPagingData = function(data, page, pageSize, total) {
							$scope.vehicles = data;
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};

						$scope.loadVehiclesTable = function() {
							$scope.getVehiclesPagedDataAsync($scope.params);
						};

						$scope.loadVehiclesTable();
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
	 			
						
//					create vehicle	
				$scope.initCreateVehicle = function() {
						$scope.init();
						$scope.vehicle = {};
						$scope.imageFile;
						$scope.myImage='';
				        $scope.myCroppedImage='';
				        $scope.editImage = true;
				        $scope.imgExists = false;
				        $scope.LimitExceeds = false;
			
						// Begin of checkLimit Exceeds
						var planLimit = Auth.getCurrentUser().dealer.plan.plan_limits;			
						var baseVehicles = Restangular.all('vehicles');
						baseVehicles.post($scope.vehicle).then(function(vehicles){	
							console.log("vehicles", vehicles);
							if(vehicles.total < planLimit.vehicles){
								$scope.LimitExceeds = false;
							}else{
								$scope.LimitExceeds = true;
								$scope.alerts.push({type: 'danger',msg: 'Plan Limit Exceeds To Create New Vehicle'});
							}	
						});			
						// End of checkLimit Exceeds

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

						console.log("$scope.vehicle", $scope.vehicle);
						$scope.addVehicle = function() {
							var croppedImage = document.querySelector('#croppedImage').getAttribute("ng-src");                                  
					        console.log("croppedImage data:", croppedImage);
					        console.log("typeof croppedImage: ", typeof(croppedImage));               

					        var blob = $scope.dataURIToBlob(croppedImage);                            
					        console.log("blob Image:", blob);

							var baseVehicle = Restangular.all('vehicles');
							
							baseVehicle.post($scope.vehicle).then(
									function(dataRsp) {
										console.log("data", dataRsp);
										$scope.data = dataRsp;
		
					if (dataRsp.meta.status == 201) {
  						if($scope.imgExists){
								$scope.imageUploads = [];
				               // GET S3POLICY AND SIGNATURE FROM SERVER              
				                var getPolicy = Restangular.one('s3Policy');                
				                getPolicy.get({mimeType: blob.type, type: "vehicles"}).then(function(data){
				                    console.log("getPolicy rsp :",data.response);
				                    console.log("Rsp :", dataRsp);
				                    
			                    // SENDS OFFERS CROPPED IMAGE FILE TO AMAZON S3
			                      $scope.upload = Upload.upload({
			                          url: 'https://' + data.response.bucket + '.s3.amazonaws.com/',
			                          method: 'POST',
			                          fields: {
			                            key: data.response.keyPath + dataRsp.response.vehicle._id + '.' + blob.type.substring(6),
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
			                              var baseChangeImage = Restangular.one('vehicles/' + dataRsp.response.vehicle._id + '/image-url');
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
							$scope.alerts.push({type: 'success',
									msg: dataRsp.meta.msg});
							}
							} else {
								$scope.alerts = [];
								$scope.alerts.push({type: 'danger',
									msg: dataRsp.meta.msg});
							}/*
											$scope.alerts = [];
											$scope.alerts.push({type: 'success',
													msg: data.meta.msg});
											
											} else {
												$scope.alerts = [];
												$scope.alerts.push({type: 'danger',
													msg: data.meta.msg});
											}*/
									}, function(response) {
										console.log(response);
										$scope.alerts = [];
										$scope.alerts.push({type: 'danger',
											msg: "Unable to add!"});
									});
														
							};
						};
						

//						edit Vehicle
						
						$scope.initEditVehicle = function() {
					
							$scope.init();
							var vehicleId = $stateParams.vehiclesId;

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
							/*	console.log("imageFile", $files);
								$scope.imageFile = $files[0];*/
							};

							var image = new Image();
							image.onload = function(){
								document.querySelector("#vehicleImage").getContext("2d").drawImage(this,0,0);
							};
						/*	image.src = "http://localhost:9000/image/vehicle/" +vehicleId + ".jpg";*/

							console.log("vehicleId", vehicleId)
							$scope.getVehicle = function(vehicleId) {
							var baseVehcile = Restangular.one('vehicles', vehicleId);
							 baseVehcile.get().then(
									function(vehicle){
										console.log("vehicle", vehicle);
										$scope.vehicle = vehicle;
										$scope.image = vehicle.image_url + "?timestamp=" + Date.now(); 
									}, function(rsp) {
										console.log(rsp);
									});
							};
//							update vehicle

								$scope.updateVehicle = function() {

								  var croppedImage = document.querySelector('#croppedImage').getAttribute("ng-src");                                  
						       	 console.log("croppedImage data:", croppedImage);
						         console.log("typeof croppedImage: ", typeof(croppedImage));               

						         var blob = $scope.dataURIToBlob(croppedImage);                            
						       	 console.log("blob Image:", blob);	

								var editvehicle = Restangular.copy($scope.vehicle);
								editvehicle.put().then(
										function(data) {
											console.log("data...", data);
											$scope.data = data;
											/*if (data.meta.status == 200) {
													$scope.alerts = [];
													$scope.alerts.push({
														type : 'success',
														msg : data.meta.msg
													});
											}*/
							if (data.meta.status == 200) {
								if($scope.imgExists){
							 $scope.imageUploads = [];
					          // GET S3POLICY AND SIGNATURE FROM SERVER              
				                var getPolicy = Restangular.one('s3Policy');                
				                getPolicy.get({mimeType: blob.type, type: "vehicles"}).then(function(data){
				                    
			                    // SENDS OFFERS CROPPED IMAGE FILE TO AMAZON S3
			                      $scope.upload = Upload.upload({
			                          url: 'https://' + data.response.bucket + '.s3.amazonaws.com/',
			                          method: 'POST',
			                          fields: {
			                            key: data.response.keyPath + vehicleId + '.' + blob.type.substring(6),
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
			                              // SEND AMAZON S3 FILE TO SERVER CONTROLLER
			                              var vehicleId = $stateParams.vehiclesId;
			                              console.log("Offer", vehicleId);
			                              var baseChangeImage = Restangular.one('vehicles/' + vehicleId + '/image-url');
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
					// End Image Upload
							}else{
							$scope.alerts = [];
							$scope.alerts.push({
								type : 'success',
								msg : data.meta.msg
							});
						}
					}else {
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
					$scope.getVehicle(vehicleId);
						
				};

				// drop down list
						$scope.initAllDealers = function() {
						$scope.init();
						var basedealers = Restangular.all('dealers/all');
						return basedealers.getList(/*{
							dealer : $scope.dealer
						}*/).then(function(dealers) {
							$scope.allDealers = dealers;
							return dealers;
						});
					};
					/*$scope.initAllMakeslist = function() {
						$scope.init();
						var basemakes = Restangular.all('dealers/makes/all');
						return basemakes.getList().then(function(makes) {
							$scope.allMakes = makes;
							return makes;
						});
			          };*/

				//chained select for make and models

				$scope.initAllModel = function(make) {
					var basemodels = Restangular.all('dealers/models/all');
					return basemodels.getList({make: make}).then(function(models) {
						console.log("model", models);
						$scope.allModels = models;
						return models;
					});
				};
	
				$scope.initAllMakes = function (){
					var basemakes = Restangular.all("dealers/makes/all");
					return basemakes.getList().then(function(makes){
						console.log("makes", makes);
						$scope.allMakes = makes;
						return makes;
					})
				}


					// add Rto + ex show room Price + insurence
					$scope.calcAmount = function(){
						$scope.vehicle.on_road_price = $scope.vehicle.ex_Showroom_price + $scope.vehicle.rto + $scope.vehicle.insurance ;
					}

				});
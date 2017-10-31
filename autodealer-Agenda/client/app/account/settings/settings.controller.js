'use strict';

angular.module('autodealerApp')
  .controller('SettingsCtrl', function ($scope, Auth, Restangular, $http, $window, $rootScope, Upload) {
    $scope.errors = {};
/*
    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
  });*/

 $scope.init = function() {        
        $scope.alerts = [];
        $scope.closeAlert = function(index) {          
          $scope.alerts.splice(index, 1);
          //$window.location.reload();
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
    // End of dataURI to Blob function   

    $scope.initChangePassword = function() {
      $scope.init();
      $scope.user = {};
      $scope.changePassword = function(){        
        var userId = Auth.getCurrentUser()._id; 
        console.log('user id', userId);
        var baseChangePassword = Restangular.one('users/'+ userId +'/password');
        baseChangePassword.old_password     = $scope.user.old_password;
        baseChangePassword.new_password     = $scope.user.new_password;
        baseChangePassword.confirm_password = $scope.user.confirm_password;
        baseChangePassword.put().then(function(data) { 
          console.log("rsp data:", data);         
          if (data.meta.status == 200) {
            $scope.alerts = [];
            $scope.alerts.push({type: 'success',
              msg: "Password changed successfully"});
          } else {
            $scope.alerts = [];
            $scope.alerts.push({type: 'danger',
              msg: data.meta.msg});
          }          
        }, function(response) {
            console.log(response);
            $scope.alerts = [];
            $scope.alerts.push({type: 'danger',
              msg: "Unable to change password!"});
         }); 
      };
    }; 


    $scope.initUserProfile = function(){
      $scope.init();
      var userId = Auth.getCurrentUser()._id;

      // ng-img-crop 
          var file;       
          $scope.myImage='';
          $scope.myCroppedImage='';
          $scope.editImage = true;
          $scope.imgExists = false;

          $scope.handleFileSelect = function($files) {
          console.log("file", $files);
            if($files.length != 0){ 
              $scope.imgExists = true;
                file = $files[0];
                var reader = new FileReader();
                reader.onload = function ($files) {
                  $scope.$apply(function($scope){
                    $scope.myImage= $files.target.result;
                  });
                };
                reader.readAsDataURL(file);
            }         
          };              

      // End of ng-img-crop            

      // Get userObj to display the name
      $scope.getUser = function(userId) {
          var baseUser = Restangular.one('users', userId);
          baseUser.get({dealer: $scope.dealer}).then(function(user) {
            console.log(user);
            $scope.user = user;
          }, function(rsp) {
            console.log(rsp);
          });
      };

      // updateName function
      $scope.updateName = function(){
        var userId = Auth.getCurrentUser()._id;        
        var baseChangeName = Restangular.one('users/'+ userId +'/name');
        baseChangeName.name     = $scope.user.name;
        baseChangeName.put().then(function(data) { 
          console.log("rsp data:", data);         
          if (data.meta.status == 200) {
            $scope.alerts = [];
            $scope.alerts.push({type: 'success',
              msg: "Name changed successfully"});
          } else {
            $scope.alerts = [];
            $scope.alerts.push({type: 'danger',
              msg: data.meta.msg});
          }          
        }, function(response) {
            console.log(response);
            $scope.alerts = [];
            $scope.alerts.push({type: 'danger',
              msg: "Unable to change name!"});
         });       
      };
      // End of updateName function    

      // updateImage function
      $scope.updateImage = function(){
        console.log("Update Image...");
        var croppedImage = document.querySelector('#croppedImage').getAttribute("ng-src");                                  
        console.log("croppedImage data:", croppedImage);
        console.log("typeof croppedImage: ", typeof(croppedImage));               

        var blob = $scope.dataURIToBlob(croppedImage);                            
        console.log("blob Image:", blob);

       if($scope.imgExists){
              $scope.imageUploads = [];
              // GET S3POLICY AND SIGNATURE FROM SERVER              
                var getPolicy = Restangular.one('s3Policy');                
                getPolicy.get({mimeType: blob.type, type: "users"}).then(function(data){
                    console.log("getPolicy rsp :",data.response);
                    
                    // SENDS USERS CROPPED IMAGE FILE TO AMAZON S3
                      $scope.upload = Upload.upload({
                          url: 'https://' + data.response.bucket + '.s3.amazonaws.com/',
                          method: 'POST',
                          fields: {
                            key: data.response.keyPath + data.response.username + '.' + blob.type.substring(6),
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
                        console.log("response", response);
                          file.progress = parseInt(100);
                          if(response.status === 201){
                              $scope.imgExists = false;
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
                              var image_url = parsedData.location;
                              $rootScope.$broadcast("update_image", image_url);
                              // SEND AMAZON S3 FILE TO SERVER CONTROLLER
                              var userId = Auth.getCurrentUser()._id;
                              var baseChangeImage = Restangular.one('users/' + userId + '/image-url');
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
                }, function(rsp) {
                  console.log(rsp);
                });
        }
      };    
      // End of updateImage function

      $scope.getUser(userId);
    }; 

  });

'use strict';

angular.module('autodealerApp')
  .controller('LoginCtrl', function ($scope, Auth, $location,Restangular,localStorageService) {
    $scope.init = function(){
      $scope.user = {};
      $scope.errors = {};      
    };
    $scope.alerts = [];
      $scope.closeAlert = function(index) {        
        $scope.alerts.splice(index, 1);
      };    
    /*$scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };*/
    $scope.initLogin = function() {
      $scope.init();                 
      $scope.signIn = function(){  
          console.log("Login On Process...");
          console.log("Username and Password :", $scope.user);        
           Auth.login($scope.user, function(rsp){           
            $scope.user = {};
            $scope.alerts = [];
            $scope.alerts.push({type: 'danger',
                msg: rsp.data.meta.msg}); 
          });  
          /*Auth.login($scope.user);*/
         /* var authLogin = Restangular.all('users/auth/login');           
            authLogin.post($scope.user).then(function(data) { */                
             /* console.log("response data:", data);                  
              console.log("response access_token :", data.access_token);
              console.log("response referesh_token :", data.refresh_token);
              console.log("response expires :", data.expires_in);
              console.log("response token_type :", data.token_type); */                          
              
              /*if(localStorageService.isSupported){
                console.log("Supported");
              }else{
                console.log("Not Supported");
              }*/ 
              
              /*var storageType = localStorageService.getStorageType();
              console.log("storageType :", storageType);
              
              localStorageService.set("access_token",data.access_token);
              localStorageService.set("refresh_token",data.refresh_token);
              localStorageService.set("expires_in",data.expires_in);
              localStorageService.set("token_type",data.token_type);
              $location.path('/');
            });      */     
      };                 

    };
  });

'use strict';

angular.module('autodealerApp')
  .factory('Auth', function Auth($location, Restangular, $injector,$rootScope, $http, localStorageService,$cookies, $q) {
    var currentUser = {};
    var maxtries = 0;    
    
    return {  
      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */      

      login: function(user, callback){              
        var authLogin = Restangular.all('auth/login');           
            authLogin.post(user).then(function(data) {                                        
              console.log("Successfully LoggedIn:", data);                                             
              localStorageService.set("access_token",data.access_token);              
              localStorageService.set("expires_in",data.expires_in);
              localStorageService.set("token_type",data.token_type);
              Restangular.one('users','me').get().then(function(user) {
                console.log("user path", user);
                currentUser = user;    
                localStorageService.set("email", user.email);
                $location.path('/');
              }, function(err) {
                console.log(err);
              });             
            }, function(err) {
             /* console.log("Invalid username or password :", err);
              return err;  */                        
              callback(err);
            }); 
      },


      refreshToken: function(){        
        var deferred = $q.defer(); 
        var username = {};
        var cookies = $cookies.autodealer_refresh_token;
        //console.log("cookies", cookies);                      
        if(cookies){
          username.username = localStorageService.get("email");
          var authRefreshToken = Restangular.all('auth/refresh-token');           
              authRefreshToken.post(username).then(function(data) {   
                localStorageService.clearAll();                          
                localStorageService.set("access_token",data.access_token);              
                localStorageService.set("expires_in",data.expires_in);
                localStorageService.set("token_type",data.token_type);
                Restangular.one('users','me').get().then(function(user) {
                  currentUser = user;                
                  localStorageService.set("email", user.email);
                  deferred.resolve(data);
                }, function(err) {
                  console.log(err);
                  deferred.reject(err);
                });
              }, function(err) {
                deferred.reject(err);
              }); 
          return deferred.promise;
        }else{          
          localStorageService.clearAll();          
          currentUser = {};              
          $location.path('/login');
        } 
      },
      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {                
        var authLogout = Restangular.all('auth/logout');           
            authLogout.post().then(function(data) {
              console.log("logout rsp data :", data);   
              localStorageService.clearAll(); 
              currentUser = {};              
              $location.path('/login');
        });            
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(data) {
            $cookieStore.put('token', data.token);
            currentUser = User.get();
            return cb(user);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        if(currentUser.hasOwnProperty('role'))
          return currentUser;
        else if (currentUser.then) {
          return currentUser;
        } else if(localStorageService.get('access_token')) {
          //currentUser = User.get();
          return currentUser = Restangular.one('users/me').get().then(function(user) {
            console.log("currentUser:", currentUser);
            currentUser = user;
            return currentUser;
          });
        } else {
          currentUser = {};
          return currentUser;
        }
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      /*isLoggedInAsync: function(cb) {
        console.log("login async test", currentUser);
       if(currentUser.hasOwnProperty('$object')) {
          console.log("isLoggedInAsync success",currentUser);
          currentUser.then(function(user) {
            console.log("async user", user);
            currentUser = user;
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          console.log("returning false");
          cb(false);
        }
      },*/

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isManager: function() {    	  
        return currentUser.role == 'MANAGER';
      },
      isStaff: function() {
        return currentUser.role === 'STAFF';
      },
      isCustomer: function() {
        return currentUser.role === 'CUSTOMER';
      },
      isSuperAdmin: function() {
        return currentUser.role === 'SUPER_ADMIN';
      },      
      isDealerAdmin: function() {
        return currentUser.role === 'DEALER_ADMIN';
      },
      isBranchAdmin: function() {
        return currentUser.role === 'BRANCH_ADMIN';
      },
      /**
       * Get auth token
       */
      getAccessToken: function() {
        return localStorageService.get('access_token');
      },

      getRefreshToken: function() {
        return localStorageService.get('refresh_token');
      },

      setMaxTries: function() {
        maxtries++;
      },

      getmaxTries: function() {
        return maxtries;
      },

      resetTries: function() {
        maxtries = 0;
      }

    };
  });

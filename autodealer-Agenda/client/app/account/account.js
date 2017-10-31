'use strict';

angular.module('autodealerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('unauthorized', {
        url: '/unauthorized',
        templateUrl: 'app/account/login/unauthorized.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
       .state('app.changePassword', {
        url: '/change-password',
        templateUrl: 'app/account/settings/change_password.html',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .state('app.userProfile', {
        url: '/user-profile',
        templateUrl: 'app/account/settings/user_profile.html',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  });
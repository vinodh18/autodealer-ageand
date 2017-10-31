  'use strict';

angular.module('autodealerApp')
.config(function ($stateProvider) {
	  $stateProvider
	  .state('app.reports', {
	      url: '/reports',
	      template: '<ui-view/>',
	       abstract: true,
	    })
	   .state('app.reports.list', {
	      url: '/',
	      templateUrl: 'app/reports/reports.html',
	      controller: 'ReportsCtrl',
	       authenticate: true,
	       role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
	    })
	    .state('app.reports.bookedlist', {
	      url: '/booked',
	      templateUrl: 'app/reports/bookedServices.html',
	      controller: 'ReportsCtrl',
	       authenticate: true,
	       role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
	    })
	     .state('app.reports.revenuelist', {
	      url: '/revenue',
	      templateUrl: 'app/reports/revenue.html',
	      controller: 'ReportsCtrl',
	       authenticate: true,
	       role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
	    })
	      .state('app.reports.enginnerlist', {
	      url: '/engineer',
	      templateUrl: 'app/reports/engineerReports.html',
	      controller: 'ReportsCtrl',
	       authenticate: true,
	       role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
	    })
	     .state('app.reports.saleslist', {
	      url: '/sales',
	      templateUrl: 'app/reports/salesReports.html',
	      controller: 'ReportsCtrl',
	       authenticate: true,
	       role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
	    })
	     .state('app.reports.enquirylist', {
	      url: '/enquiry',
	      templateUrl: 'app/reports/enquiryReports.html',
	      controller: 'ReportsCtrl',
	       authenticate: true,
	       role: ['DEALER_ADMIN', 'MANAGER', 'BRANCH_ADMIN', 'STAFF']
	    });
	});

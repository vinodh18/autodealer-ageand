'use strict';

angular.module('autodealerApp')
   .controller('DashboardCtrl', function ($scope, $http, Restangular, Auth) {	

	$scope.init = function(){
	  		$scope.serviceStatus = ["SCHEDULED", "INPROGRESS", "PAYMENT_DUE"]
		  	$scope.statusColors = [];
			$scope.statusColors["INPROGRESS"] = "#23b7e5";
			$scope.statusColors["SCHEDULED"] = "#7266ba";
			$scope.statusColors["PAYMENT_DUE"] = "#f05050";
			$scope.serviceListView = [];
			$scope.serviceListView["INPROGRESS"] = "app.jobcards.InprogressList";
			$scope.serviceListView["SCHEDULED"] = "app.jobcards.ScheduledList";
			$scope.serviceListView["PAYMENT_DUE"] = "app.jobcards.PaymentDueList";

		  	$scope.dateRange = {};
		  	$scope.piedateRange = {};
			$scope.dateRange.startDate = moment().subtract(28,'days');
			$scope.dateRange.endDate = moment();			

			$scope.ranges = {
		         'Today': [moment(), moment()],
		         'Yesterday': [moment().subtract(1,'days'), moment().subtract(1,'days')],
		         'Last 7 Days': [moment().subtract(6,'days'), moment()],
		         'Last 30 Days': [moment().subtract(28,'days'), moment()],
		         'This Month': [moment().startOf('month'), moment().endOf('month')],
		         'Last Month': [moment().subtract(1,'month').startOf('month'), moment().subtract(1,'month').endOf('month')]
		      };
	};

	$scope.formatNumber = function(num) {
		if(num){
    		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    	}else{
    		return 0;
    	}
	};

	$scope.statusLink = function(status){
		if(status == "INPROGRESS"){
			return "app.jobcards.Inprogresslist";
			}
			else if(status == "PAYMENT_DUE"){
			  return "app.jobcards.paymentduelist";
			}
			else if(status == "SCHEDULED"){
			  return "app.jobcards.scheduledlist";
			}
		}

	$scope.initDashboard = function(){
		$scope.init();		

		if(Auth.isDealerAdmin()){
			$scope.accessBranchWise = true;
		}else{
			$scope.accessBranchWise = false;
		}

		if(Auth.isStaff() || Auth.isCustomer()){
			$scope.isStaff = true;
		}

		if(Auth.isCustomer()){
			$scope.isCustomer = true;
		}			

		$scope.searchByBranch = function(params){			
			$scope.params = params;			
			$scope.initServicesCount();
			$scope.initRevenueCounts();
		};

		$scope.initServicesCount = function() {
		  $scope.init();
		  if(Auth.isBranchAdmin() || Auth.isManager() || Auth.isStaff()){
		  	$scope.params = {};
			$scope.params.branch = Auth.getCurrentUser().branch;
		  }
		  			  
		  var baseServiceRequestCount = Restangular.one('jobcards/serviceCounts');
			return baseServiceRequestCount.get($scope.params).then(
				function(rspData) {	
					console.log('rspData', rspData.lastMonth_service[0].count);							
					$scope.serviceCountsArr = [];
					$scope.serviceToday 	= rspData.today_service[0].count;					
					$scope.serviceYesterday = rspData.yesterday_service[0].count;			
					$scope.serviceThismonth = rspData.thisMonth_service[0].count;					
					$scope.serviceLastmonth = rspData.lastMonth_service[0].count;									

					$scope.serviceCounts = rspData.status_count;						
					for(var i=0; i < $scope.serviceStatus.length; i++){
						for(var j=0; j < $scope.serviceCounts.length; j++){							
							if($scope.serviceStatus[i] === $scope.serviceCounts[j].name){								
								$scope.serviceCountsArr.push({
									name: $scope.serviceCounts[i].name,
									total: $scope.serviceCounts[i].total,
									amount: $scope.serviceCounts[i].amount,
									color: $scope.statusColors[$scope.serviceCounts[i].name],
									stats: $scope.serviceListView[$scope.serviceCounts[i].name],
								});
							}
						}
					}

					$scope.from_date = moment().subtract(29, 'days').format('YYYY/MM/DD');
					$scope.to_date = moment().format('YYYY/MM/DD');						
					$scope.chartMonths = [];
					$scope.chartDates = [];
					$scope.myData = [];
					$scope.pieData = [];
					var line_row = [];
					var a = $scope.from_date;
					var b = $scope.to_date;
					b = moment(b).add('days',1);
					
					for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){
					 	$scope.chartDates[k] = [k,m.format('YYYY/MM/DD')];					  	
						k++;
					}

					for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){	
						var flag = 0;											
						for(var j = 0 ; j < rspData.service_stats.length; j++) {												
							if(m.format('YYYY/M/D') === rspData.service_stats[j].date) {													
								var pt = [k,rspData.service_stats[j].count];
								line_row.push(pt);							
								k++;
								flag = 1;
							}
						}
						if(flag != 1) {
							var pt = [k,0];
							line_row.push(pt);							
							k++;
						}
					}
										
					var limit = 5;
					$scope.cdates = [];																	
					var offset = parseInt($scope.chartDates.length >= limit ? $scope.chartDates.length / limit : 1);									
					for(var i=0; i < $scope.chartDates.length; i++){
						if(i % offset == 0){											
							$scope.cdates.push($scope.chartDates[i]);
						}										
					}

					$scope.serviceData = [{
							data:  line_row,
							points: { show: true, radius: 4}, 
							splines: { show: true, tension: 0.45, lineWidth: 3, fill: 0 }
					}];


					$scope.serviceLineChartOptions = {
					  	colors: ['#23b7e5'],
						legend: {show : true, container: '#legend-container'},
						grid: {borderWidth: 0, hoverable: true, clickable: true},
						yaxis: {show: true},
						xaxis: {show: true, ticks: $scope.cdates, tickLength: 0},
						tooltip: true,
	            		tooltipOpts: { content: '%y Services',  defaultTheme: false, shifts: { x: 0, y: 20 } }
					};
			});		 				 	  
		};

		$scope.initRevenueCounts = function() {
		  	
		  $scope.init();			  
		  var baseServiceOverviewCount = Restangular.one('jobcards/revenueCounts');
			return baseServiceOverviewCount.get($scope.params).then(function(result) {				
				$scope.today = result.stats.today_service[0].count;
				$scope.todayAmount = result.stats.today_service[0].amount;
				$scope.yesterday = result.stats.yesterday_service[0].count;
				$scope.yesterdayAmount = result.stats.yesterday_service[0].amount;
				$scope.thismonth = result.stats.thisMonth_service[0].count;
				$scope.thismonthAmount = result.stats.thisMonth_service[0].amount;
				$scope.lastmonth = result.stats.lastMonth_service[0].count;
				$scope.lastMonthAmount = result.stats.lastMonth_service[0].amount;				
				$scope.paymentDue = result.stats.payment_due[0].count;
				$scope.paymentDueAmount = result.stats.payment_due[0].amount;

				$scope.from_date = moment().subtract(29, 'days').format('YYYY/MM/DD');
				$scope.to_date = moment().format('YYYY/MM/DD');	
				$scope.chartMonths = [];
				$scope.chartDates = [];
				$scope.myData = [];
				$scope.pieData = [];
				var line_row = [];
				var a = $scope.from_date;
				var b = $scope.to_date;
				b = moment(b).add('days',1);
				
				for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){
				 	$scope.chartDates[k] = [k,m.format('YYYY/MM/DD')];					  	
					k++;
				}

				for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){	
					var flag = 0;											
					for(var j = 0 ; j < result.stats.service_stats.length; j++) {												
						if(m.format('YYYY/M/D') === result.stats.service_stats[j].date) {													
							var pt = [k,result.stats.service_stats[j].amount];
							line_row.push(pt);							
							k++;
							flag = 1;
						}
					}
					if(flag != 1) {
						var pt = [k,0];
						line_row.push(pt);							
						k++;
					}
				}
									
				var limit = 4;
				$scope.cdates = [];																	
				var offset = parseInt($scope.chartDates.length >= limit ? $scope.chartDates.length / limit : 1);									
				for(var i=0; i < $scope.chartDates.length; i++){
					if(i % offset == 0){											
						$scope.cdates.push($scope.chartDates[i]);
					}										
				}

				$scope.revenueData = [{
						data:  line_row,
						points: { show: true, radius: 4}, 
						splines: { show: true, tension: 0.45, lineWidth: 3, fill: 0 }
				}];


				$scope.revenueLineChartOptions = {
				  	colors: ['#27c24c'],
					legend: {show : true, container: '#legend-container'},
					grid: {borderWidth: 0, hoverable: true, clickable: true},
					yaxis: {show: true},
					xaxis: {show: true, ticks: $scope.cdates, tickLength: 0},
					tooltip: true,
            		tooltipOpts: { content: '<span>&#8377</span> %y.2',  defaultTheme: false, shifts: { x: 0, y: 20 } }
				};

			});		 				 	  
	  };  


	  /*$scope.serviceBreakdownStats = function(){	  	
		$scope.from_date = moment().subtract(29, 'days').format('YYYY/MM/DD');
		$scope.to_date = moment().format('YYYY/MM/DD');		

	  	var baseReports = Restangular.one('jobcards/serviceCounts');
	  	return baseReports.get($scope.params).then(
			function(responseData) {					
				$scope.chartMonths = [];
				$scope.chartDates = [];
				$scope.myData = [];
				$scope.pieData = [];
				var line_row = [];
				var a = $scope.from_date;
				var b = $scope.to_date;
				b = moment(b).add('days',1);
				
				for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){
				 	$scope.chartDates[k] = [k,m.format('YYYY/MM/DD')];					  	
					k++;
				}

				for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){	
					var flag = 0;											
					for(var j = 0 ; j < responseData.service_stats.length; j++) {												
						if(m.format('YYYY/M/D') === responseData.service_stats[j].date) {													
							var pt = [k,responseData.service_stats[j].count];
							line_row.push(pt);							
							k++;
							flag = 1;
						}
					}
					if(flag != 1) {
						var pt = [k,0];
						line_row.push(pt);							
						k++;
					}
				}
									
				var limit = 5;
				$scope.cdates = [];																	
				var offset = parseInt($scope.chartDates.length >= limit ? $scope.chartDates.length / limit : 1);									
				for(var i=0; i < $scope.chartDates.length; i++){
					if(i % offset == 0){											
						$scope.cdates.push($scope.chartDates[i]);
					}										
				}

				$scope.serviceData = [{
						data:  line_row,
						points: { show: true, radius: 4}, 
						splines: { show: true, tension: 0.45, lineWidth: 3, fill: 0 }
				}];


				$scope.serviceLineChartOptions = {
				  	colors: ['#23b7e5'],
					legend: {show : true, container: '#legend-container'},
					grid: {borderWidth: 0, hoverable: true, clickable: true},
					yaxis: {show: true},
					xaxis: {show: true, ticks: $scope.cdates, tickLength: 0},
					tooltip: true,
            		tooltipOpts: { content: '%y Services',  defaultTheme: false, shifts: { x: 0, y: 20 } }
				};									
			});
	  };*/


	  /*$scope.revenueBreakdownStats = function(){	  	  			 
		$scope.from_date = moment().subtract(29, 'days').format('YYYY/MM/DD');
		$scope.to_date = moment().format('YYYY/MM/DD');		

	  	var baseReports = Restangular.one('jobcards/revenueCounts');
	  	return baseReports.get($scope.params).then(
			function(responseData) {						
				$scope.chartMonths = [];
				$scope.chartDates = [];
				$scope.myData = [];
				$scope.pieData = [];
				var line_row = [];
				var a = $scope.from_date;
				var b = $scope.to_date;
				b = moment(b).add('days',1);
				
				for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){
				 	$scope.chartDates[k] = [k,m.format('YYYY/MM/DD')];					  	
					k++;
				}

				for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){	
					var flag = 0;											
					for(var j = 0 ; j < responseData.stats.service_stats.length; j++) {												
						if(m.format('YYYY/M/D') === responseData.stats.service_stats[j].date) {													
							var pt = [k,responseData.stats.service_stats[j].amount];
							line_row.push(pt);							
							k++;
							flag = 1;
						}
					}
					if(flag != 1) {
						var pt = [k,0];
						line_row.push(pt);							
						k++;
					}
				}
									
				var limit = 4;
				$scope.cdates = [];																	
				var offset = parseInt($scope.chartDates.length >= limit ? $scope.chartDates.length / limit : 1);									
				for(var i=0; i < $scope.chartDates.length; i++){
					if(i % offset == 0){											
						$scope.cdates.push($scope.chartDates[i]);
					}										
				}

				$scope.revenueData = [{
						data:  line_row,
						points: { show: true, radius: 4}, 
						splines: { show: true, tension: 0.45, lineWidth: 3, fill: 0 }
				}];


				$scope.revenueLineChartOptions = {
				  	colors: ['#27c24c'],
					legend: {show : true, container: '#legend-container'},
					grid: {borderWidth: 0, hoverable: true, clickable: true},
					yaxis: {show: true},
					xaxis: {show: true, ticks: $scope.cdates, tickLength: 0},
					tooltip: true,
            		tooltipOpts: { content: '<span>&#8377</span> %y.2',  defaultTheme: false, shifts: { x: 0, y: 20 } }
				};									
			});
	  };*/


	  $scope.initAllBranches = function() {
		$scope.init();
		var baseAllBranches = Restangular.all('dealers/branches/all');
		return baseAllBranches.getList().then(function(branches) {					
			$scope.allBranches = branches;
			return branches;
		});
	  };

	};
});
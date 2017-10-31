'use strict';

angular.module('autodealerApp')
   .controller('ReportsCtrl', function ($scope, Restangular, dialogs, $stateParams, Auth) {
	  $scope.params={};
//    Getting counts 

	  $scope.init = function(){
		  /*$scope.staff = Auth.getCurrentUser()._id;*/
		  $scope.colors = ['#556B2F', '#FFA500', '#663333', '#00CC33', '#CC0033'];
		  $scope.boxcolors = [ "#FFA500", "#663333", "#00CC33"];
			$scope.access = Auth.isManager();
			$scope.dateRange = {};
			$scope.compleDateRange = {};

			$scope.dateRange.startDate = moment().subtract('days', 6);
			$scope.dateRange.endDate = moment();

			$scope.compleDateRange.startDate = moment();
			$scope.compleDateRange.endDate = moment();

			$scope.ranges = {
		         'Today': [moment(), moment()],
		         'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
		         'Last 7 Days': [moment().subtract('days', 6), moment()],
		         'Last 30 Days': [moment().subtract('days', 29), moment()],
		         'This Month': [moment().startOf('month'), moment().endOf('month')],
		         'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
		      };
			//$scope.status;
			$scope.alerts = [];
			$scope.closeAlert = function(index) {
				//console.log($scope.alert);
				//delete $scope.alert;
				$scope.alerts.splice(index, 1);
		};
	  };

	  $scope.initDateRanges = function() {
			$scope.dateRange = {};
			$scope.dateRange.startDate = moment().subtract('days', 6);
			$scope.dateRange.endDate = moment();
		};

	   $scope.initCompleteDateRanges = function() {
			$scope.compleDateRange = {};
			$scope.compleDateRange.startDate = moment().subtract('days', 6);
			$scope.compleDateRange.endDate = moment();
		};

		$scope.initStats = function(){
		$scope.init();	
		$scope.$watch('dateRange', function(dateRange) {								
			$scope.from_date = moment(dateRange.startDate._d).format('YYYY/MM/DD');
			$scope.to_date = moment(dateRange.endDate._d).format('YYYY/MM/DD');
			$scope.params.from_date = $scope.from_date;
			$scope.params.to_date = $scope.to_date;	
		}, true);
		
		$scope.serviceStatusExport = function(){
			console.log("Export Params", $scope.params);
			Restangular.one('jobcards/serviceStatusExport').get($scope.params).then(
					function(result) {
						function s2ab(s){
							var buf = new ArrayBuffer(s.length);
							var view = new Uint8Array(buf);
							for(var i=0; i!=s.length;++i) view[i] = s.charCodeAt(i) & 0xFF;
							return buf;
						}
						saveAs(new Blob([s2ab(result)],{type: ""}),"serviceStatusReport.xlsx");
					});
		};
	  var path = Auth.isCustomer()? 'jobcards/userstats' 
						  	: 'jobcards/stats';	
	  var baseStats = Restangular.one(path);	  
			return baseStats.get($scope.params).then(
					function(result){
				console.log("Services stats :",  result);
				$scope.result = result;	
				$scope.callChart($scope.result);				
				$scope.getServices();
			});
		};
		
		// completed stats count 

		$scope.initCompStats = function(){
		$scope.init();	
		$scope.$watch('compleDateRange', function(compleDateRange) {								
			$scope.from_date = moment(compleDateRange.startDate._d).format('YYYY/MM/DD');
			$scope.to_date = moment(compleDateRange.endDate._d).format('YYYY/MM/DD');
			$scope.params.from_date = $scope.from_date;
			$scope.params.to_date = $scope.to_date;	
		}, true);

		$scope.revenueExport = function(){
			Restangular.one('jobcards/revenueExport').get($scope.params).then(
					function(result) {
						function s2ab(s){
							var buf = new ArrayBuffer(s.length);
							var view = new Uint8Array(buf);
							for(var i=0; i!=s.length;++i) view[i] = s.charCodeAt(i) & 0xFF;
							return buf;
						}
						saveAs(new Blob([s2ab(result)],{type: ""}),"RevenueReport.xlsx");
					});
		};

		$scope.engineerExport = function(){
			Restangular.one('jobcards/engineerExport').get($scope.params).then(
					function(result) {
						function s2ab(s){
							var buf = new ArrayBuffer(s.length);
							var view = new Uint8Array(buf);
							for(var i=0; i!=s.length;++i) view[i] = s.charCodeAt(i) & 0xFF;
							return buf;
						}
						saveAs(new Blob([s2ab(result)],{type: ""}),"EngineerReport.xlsx");
					});
		};
		/*
		if(Auth.isStaff()){
			$scope.params.staff =  $scope.staff;			
		}*/
		/*$scope.serviceStatusExport = function(){
			console.log("Export Params", $scope.params);
			Restangular.one('services/serviceStatusExport').get($scope.params).then(
					function(result) {
						function s2ab(s){
							var buf = new ArrayBuffer(s.length);
							var view = new Uint8Array(buf);
							for(var i=0; i!=s.length;++i) view[i] = s.charCodeAt(i) & 0xFF;
							return buf;
						}
						saveAs(new Blob([s2ab(result)],{type: ""}),"serviceStatusReport.xlsx");
					});
		};*/
		
	 /* var path = Auth.isCustomer()? 'services/userstats' 
						  	: 'services/stats';	*/

	  var baseStats = Restangular.one("jobcards/revenue");	  
			return baseStats.get($scope.params).then(
					function(result){
				//console.log("Services stats :" + result);
				$scope.result = result;	
				$scope.completedChart($scope.result);
				$scope.getRevenue();
			});
		};

		$scope.resetStatus = function(){								
				$scope.initDateRanges();
				$scope.initCompleteDateRanges();
				$scope.params.make = '';
				$scope.params.model = '';
			};	
		
				
	//  date range picker
		
		 $scope.toggleMin = function() {
			    $scope.minDate = $scope.minDate ? null : new Date();
			  };
			  $scope.toggleMin();

			  $scope.dateOptions = {
			    formatYear: 'yy',
			    startingDay: 1
			  };

			  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
			  $scope.format = $scope.formats[0];
			  
		
//		Reports search count
		
		$scope.getServices = function() {
			var path = Auth.isCustomer()? 'jobcards/userstats' 
				  	: 'jobcards/stats';	
			var baseStats = Restangular.one(path);	  
			return baseStats.get($scope.params).then(
					function(result){
				$scope.testCountReport = [];
				//console.log("Services stats :", result.ServiceStatus);
				$scope.result = result;	
				$scope.callChart($scope.result);
				$scope.getBookedServicePagedDataAsync($scope.params);
				$scope.serviceStatusCount = result.ServiceStatus;
				// console.log("invoicestatus:", $scope.invoiceStatusCount);

				for(var i=0; i < $scope.serviceStatusCount.name.length; i++ ){																															
					//var name = $scope.serviceStatusCount.name[i] == 'PENDING' ? 'SERVICES DUE' : $scope.serviceStatusCount.name[i];
					var test = {name: $scope.serviceStatusCount.name[i], 
					    total: $scope.serviceStatusCount.count[i],
					    amount: $scope.serviceStatusCount.amount[i],
					    colors: $scope.boxcolors[i] 												    
					    };
					    console.log("test..", test.name);

					    $scope.testCountReport.push(test);		    
				}
				$scope.total_amount = 0;
			for(var i=0; i < $scope.serviceStatusCount.name.length; i++ ){																															
				 $scope.total_amount = $scope.serviceStatusCount.amount[i] + $scope.total_amount;
				    	    
			}	
			});
		};
		

		/*   */
				
		$scope.callChart = function(result){
			$scope.chartMonth = [];
			$scope.myData = [];
			$scope.chartDates = [];
			
			var line_row = [];
			  var a = moment($scope.params.from_date).format('YYYY/MM/DD');
			  var b = moment($scope.params.to_date).format('YYYY/MM/DD');
			  b = moment(b).add('days',1);
			 // console.log("DATE from", a);
			  //console.log("DATE to", b);
			  for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){
			  	$scope.chartDates[k] = [k,m.format('YYYY/MM/DD')];
			  	//console.log("chartDates", $scope.chartDates[k]);
				k++;
			  }

			   for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){	
				var flag = 0;											
				for(var j = 0 ; j < result.stats_breakdown.service_stats.length; j++) {												
					if(m.format('YYYY/M/D') === result.stats_breakdown.service_stats[j].date) {													
						var pt = [k,result.stats_breakdown.service_stats[j].count];
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
			//console.log("line_row", line_row);
			var limit = 7;
			$scope.cdates = [];																	
			var offset = parseInt($scope.chartDates.length >= limit ? $scope.chartDates.length / limit : 1);									
			for(var i=0; i < $scope.chartDates.length; i++){
				if(i % offset == 0){											
					$scope.cdates.push($scope.chartDates[i]);
				}										
			}

			/*$scope.mychart = [{data: line_row}];*/

			$scope.mychart = [{data: line_row, points: {show: true, radius: 6}, 
			splines:{show: true, tension: 0.45, lineWidth: 5, fill: 0}}];
			
			$scope.chartOptions = {
					/*lines: {show: true, fill: false},*/
					colors: ['#5482FF'],
                    points: {show: true, radius: 4, fillColor: '#cccccc'},
                    /*colors: $scope.colors,*/
                    legend: {show: true, container: '#legend-container'},
                    grid: {borderWidth: 0, hoverable: true, clickable: true},
                    yaxis: {show: true},
                    xaxis: {show: true, ticks: $scope.cdates},
					background: '#232323',
					tooltip: true,
					tooltipOpts: { content: 'Date: %x <br> Services: %y.0', defaultTheme: false, shifts: { x: 10, y: -25 } }
	               
                };


			/*$scope.barOptions = {
	            	label: 'Service',
	            	bars: {show: true, lineWidth: 0, barWidth: 0.1, align: "center", fillcolor: {colors: [{opacity: 0.5}, {opacity: 0.5}]}},
	            	colors: ['#5482FF'],
	            	legend: {show: true, position: 'nw', margin: [15,10]},
	            	grid: {borderWidth: 0},
	            	yaxis: {show: true},
	            	xaxis: {show: true, ticks: $scope.cdates, tickLength: 0}
	            };*/
			var previousPoint = null, ttlabel = null;
           $('#chart_line').bind('plothover', function(event, pos, item) {

                if (item) {
                    if (previousPoint !== item.dataIndex) {
                        previousPoint = item.dataIndex;

                        $('#chart-tooltip').remove();
                        var x = item.datapoint[0], y = item.datapoint[1];
                        var dateArr = $scope.chartMonth[item.dataIndex];
                       $('<div id="chart-tooltip" class="chart-tooltip">' + ttlabel + '</div>')
                            .css({top: item.pageY - 50, left: item.pageX - 50}).appendTo("body").show();
                    }
                }
                else {
                    $('#chart-tooltip').remove();
                    previousPoint = null;
                }
            });
		};
	// 		count display on table form

					$scope.initBooked = function() {
						//$scope.init();
					/*$scope.$watch('dateRange', function(dateRange) {								
						$scope.from_date = moment(dateRange.startDate._d).format('YYYY/MM/DD');
						$scope.to_date = moment(dateRange.endDate._d).format('YYYY/MM/DD');
						$scope.params.from_date = $scope.from_date;
						$scope.params.to_date = $scope.to_date;	
						$scope.getBookedServicePagedDataAsync($scope.params);
					}, true);*/
						console.log("$scope.params", $scope.params);
						$scope.getList = function() {
						  $scope.getBookedServicePagedDataAsync($scope.params);
						};

						$scope.filterOptions = {
							filterText : "",
							useExternalFilter : true
						};
						
						$scope.totalServerItems = 0;

						$scope.pagingOptions = {
							pageSizes : [15, 25, 50],
							pageSize : 15,
							currentPage : 1
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
								$scope.getBookedServicePagedDataAsync($scope.params);
							}, true);
						
						
						$scope.mySelection = [];
						$scope.gridOptions = {
							data : 'scheduled_stats',
							enablePaging : true,
							showFooter : true,
							totalServerItems : 'totalServerItems',
							pagingOptions : $scope.pagingOptions,
							filterOptions : $scope.filterOptions,
							selectedItems : $scope.mySelection,
							keepLastSelected: false,
							multiSelect : false,
							/*multiSelect: Auth.isManager(),
							selectWithCheckboxOnly :Auth.isManager(),
							showSelectionCheckbox :Auth.isManager(),*/
						};
						
						$scope.gridOptions.columnDefs = [
								{
									field : 'date',
									displayName : 'Date'
								},{
									field : 'scheduled',
									displayName : 'Scheduled'
								},{
									field : 'pending',
									displayName : 'Payment Due'
								},{
									field : 'completed',
									displayName : 'Paid'
								},{
									field : 'total',
									displayName : 'Total'
								}];
						
//				get Booked Service in index page
						
					$scope.getBookedServicePagedDataAsync = function(filters) {
						var pageSize = $scope.pagingOptions.pageSize;
						var page = $scope.pagingOptions.currentPage;
						var offset = (page - 1) * pageSize;
						var limit = $scope.pagingOptions.pageSize;
						$scope.getBookedService(filters, offset, limit).then(
								function(stats) {
								$scope.setPagingData(stats, page,
								pageSize, stats.stats_length);
							});
					};

					$scope.getBookedService = function(filters, offset, limit) {
						var baseOffers = Restangular.one('jobcards/stats');
						filters = filters ? filters : {};
						filters.offset = offset;
						filters.limit = limit;
						return baseOffers.get(filters).then(
								function(services) {
									return services;
								});
					};

					$scope.setPagingData = function(data, page, pageSize, total) {
						console.log("data..//..", total);

					$scope.scheduled_stats = data.table_stats;
					$scope.totalServerItems = total;
					console.log("$scope.totalServerItems", $scope.totalServerItems);
					if (!$scope.$$phase) {
						$scope.$apply();
					}
				};

				$scope.loadBookesServiceTable = function() {
					$scope.getBookedServicePagedDataAsync($scope.params);
				};

				$scope.loadBookesServiceTable();
			};



	/* Booked Service Pie Count display table */


					$scope.initPiechart = function() {
						//$scope.init();

						/*$scope.piefilterOptions = {
							filterText : "",
							useExternalFilter : true
						};*/
						
						$scope.totalServerItems = 0;
						$scope.piepagingOptions = {
							pageSizes : [ 15, 25, 50 ],
							pageSize : 15,
							currentPage : 1
						};
						$scope.getPieLists = function() {
						  $scope.getTopvehiclesPagedDataAsync();
						};
						
						$scope.maxPages = function() {
							return parseInt(Math.ceil($scope.totalServerItems / $scope.piepagingOptions.pageSize));
						};
						
						$scope.validateCurrentPiePage = function() {
							if($scope.piepagingOptions.currentPage > $scope.maxPages()) {
								$scope.piepagingOptions.currentPage = $scope.maxPages();
							}
							if($scope.piepagingOptions.currentPage < 1) {
								$scope.piepagingOptions.currentPage = 1;
							}
							$scope.piepagingOptions.currentPage = parseInt($scope.piepagingOptions.currentPage);
						};
						$scope.$watch('totalServerItems', function(newVal, oldVal) {
							if(newVal !== oldVal) {
								$scope.validateCurrentPiePage();
							}
						}, true);
						
						$scope.$watch('piepagingOptions', function(newVal, oldVal) {
								console.log(newVal);
								console.log(oldVal);
								if(newVal.currentPage !== oldVal.currentPage) {
									$scope.validateCurrentPiePage();
								}
								$scope.getTopvehiclesPagedDataAsync();
							}, true);
						
						
						$scope.mySelection = [];
						$scope.gridOption = {
							data : 'top_vehicles',
							enablePaging : true,
							showFooter : false,
							totalServerItems : 'totalServerItems',
							multiSelect : false,
							piepagingOptions : $scope.piepagingOptions/*,
							filterOptions : $scope.piefilterOptions,
							selectedItems : $scope.mySelection,
							keepLastSelected: false*/
						};
						
						$scope.gridOption.columnDefs = [
								{
									field : 'name',
									displayName : 'Name'
								},{
									field : 'count',
									displayName : 'Count'
								}];
						
//				get Booked Service in index page
						
					$scope.getTopvehiclesPagedDataAsync = function(filters) {
						var pageSize = $scope.piepagingOptions.pageSize;
						var page = $scope.piepagingOptions.currentPage;
						var offset = (page - 1) * pageSize;
						var limit = $scope.piepagingOptions.pageSize;
						$scope.getPieTable(filters, offset, limit).then(
								function(stats) {
								$scope.setpiePagingData(stats, page,
								pageSize, stats.top_vehicles.length);
							});
					};

					$scope.getPieTable = function(filters, offset, limit) {
						var baseTopvehicles = Restangular.one('jobcards/topvehicles');
						
						filters = filters ? filters : {};
						filters.offset = offset;
						filters.limit = limit;
						return baseTopvehicles.get().then(
								function(topvehicles) {
									return topvehicles;
								});
					};

					$scope.setpiePagingData = function(data, page, pageSize, total) {
						console.log("totalPieItems", total);
							$scope.top_vehicles = data.top_vehicles;
							$scope.totalPieItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};
					

				$scope.loadTopvehiclesTable = function() {
					$scope.getTopvehiclesPagedDataAsync($scope.params);
				};

				$scope.loadTopvehiclesTable();
			};


	/* Booked Service Top 5 Vehicles display pie chart */ 

		$scope.topvehicles = function(){
				/*var path = Auth.isCustomer()? 'services/userstats' 
					  	: 'services/stats';	*/
			var pieStats = Restangular.one("jobcards/topvehicles");	 
			console.log("pie stats", pieStats) ;
			return pieStats.get($scope.pieparams).then(function(result){
				//$scope.testCountReport = [];
				$scope.pieCountReport = [];
				//console.log("Service stats :" + result);
				$scope.result = result;	
				//console.log("Pie Service stats :", result);
				
				$scope.servicePieCount = result.top_vehicles;

				console.log("pie chart requested stats", $scope.servicePieCount.length);
				//console.log("servicestatus:", $scope.serviceStatusCount);
				
				for(var i=0; i < $scope.servicePieCount.length; i++){																															
					var tests = {label: $scope.servicePieCount[i].name, 
					  		     data: $scope.servicePieCount[i].count,
					   // amount: $scope.servicePieCount.amount[i],
					   // colors: $scope.colors[i]												    
					    };
						$scope.pieCountReport.push(tests);		    
				}		
				console.log("array", $scope.pieCountReport);
				/*$scope.total_amount = 0;
				for(var i=0; i < $scope.servicePieCount.name.length; i++ ){																															
					 $scope.pie_amount = $scope.servicePieCount.amount[i] + $scope.total_amount;
					    	    
				}*/

				 $scope.pieOptions = 
		                 {
		                series: { pie: { show: true, innerRadius: 0.5, stroke: { width: 0 }, label: { show: true, threshold: 0.05 } } },
		                colors: ['#556B2F','#FFA500','#663333','#00CC33', '#5482FF'],
		                grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#ccc' },   
		                tooltip: true,
		                tooltipOpts: {content: '%s: %p.0%'}
		              }
			});
		};


	// Revenue chart

	/*$scope.getServices = function() {
			var path = Auth.isCustomer()? 'services/userstats' 
				  	: 'services/stats';	
			var baseStats = Restangular.one(path);	  
			return baseStats.get($scope.params).then(
					function(result){
				$scope.testCountReport = [];
				console.log("Services stats :", result.ServiceStatus);
				$scope.result = result;	
				$scope.callChart($scope.result);
				$scope.serviceStatusCount = result.ServiceStatus;	
				// console.log("invoicestatus:", $scope.invoiceStatusCount);
				for(var i=0; i < $scope.serviceStatusCount.name.length; i++ ){																															
					var test = {name: $scope.serviceStatusCount.name[i], 
					    total: $scope.serviceStatusCount.count[i],
					    amount: $scope.serviceStatusCount.amount[i],
					    colors: $scope.colors[i] 												    
					    };
						$scope.testCountReport.push(test);		    
				}
				$scope.total_amount = 0;
			for(var i=0; i < $scope.serviceStatusCount.name.length; i++ ){																															
				 $scope.total_amount = $scope.serviceStatusCount.amount[i] + $scope.total_amount;
				    	    
			}	
							
			});
		};
*/
		$scope.getRevenue = function() {
			  
			  var baseServiceRevenueCount = Restangular.one('jobcards/revenue');
				return baseServiceRevenueCount.get($scope.params).then(
				  function(result) {
					//console.log("baseServiceOverviewCount Service", result);
					 $scope.testRevenueReport = [];
					 $scope.pieCountReport = [];
					 $scope.RevenueReports = [];
					 $scope.completedReport = [];
					/*$scope.yesterday = result.yesterday;
					$scope.sevendays = result.sevendays;
					$scope.month = result.month;*/		
					$scope.today = result.today_service[0].count;
					$scope.todayAmount = result.today_service[0].amount;
					$scope.yesterday = result.yesterday_service[0].count;
					$scope.yesterdayAmount = result.yesterday_service[0].amount;
					$scope.thismonth = result.thisMonth_service[0].count;
					$scope.thismonthAmount = result.thisMonth_service[0].amount;
					$scope.lastmonth = result.lastMonth_service[0].count;
					$scope.lastMonthAmount = result.lastMonth_service[0].amount;
					/*$scope.completedAmount = result.today_service[0].amount;
					$scope.pendingAmount = result.today_pending_service[0].amount;*/
						
					$scope.result = result;	
					$scope.completedChart($scope.result);
					$scope.getRevenuePagedDataAsync($scope.params);
					//$scope.initRevenue();
					//$scope.serviceStatusCount = result.ServiceStatus;
					$scope.serviceRevenueCount = result.engineer_stats;
					
					for(var i=0; i < $scope.serviceRevenueCount.length; i++ ){		
							if($scope.serviceRevenueCount[i].name == "COMPLETED"){
							var test = {
								name: $scope.serviceRevenueCount[i].name ? $scope.serviceRevenueCount[i].name : "TOTAL", 
							    total: $scope.serviceRevenueCount[i].count,
							    amount: $scope.serviceRevenueCount[i].amount,
							    TotalAmount: $scope.serviceRevenueCount[i].test,
							    colors: "#00CC33"
							    };
								$scope.completedReport.push(test);
						}
					}
					$scope.Engcolors = ["#663333", "#00CC33", "#23b7e5"]
					for(var i=0; i < $scope.serviceRevenueCount.length; i++ ){
							//var name = $scope.serviceRevenueCount[i].name == 'PENDING' ? 'SERVICES DUE' : $scope.serviceRevenueCount[i].name;
							var test = {
								name: $scope.serviceRevenueCount[i].name ? $scope.serviceRevenueCount[i].name : "TOTAL", 
							    total: $scope.serviceRevenueCount[i].count,
							    amount: $scope.serviceRevenueCount[i].amount,
							    TotalAmount: $scope.serviceRevenueCount[i].test,
							    colors: $scope.Engcolors[i] 												    
							    };
								$scope.testRevenueReport.push(test);
						}
						$scope.revcolors = ["#663333", "#00CC33"];
					for(var i=0; i < $scope.serviceRevenueCount.length; i++ ){
							if($scope.serviceRevenueCount[i].name != "Total"){	
								console.log("Revenue $scope.serviceRevenueCount[i].name", $scope.serviceRevenueCount[i].name);
							//var name = $scope.serviceRevenueCount[i].name == 'PENDING' ? 'SERVICES DUE' : $scope.serviceRevenueCount[i].name;
							var test = {name: $scope.serviceRevenueCount[i].name, 
							    total: $scope.serviceRevenueCount[i].count,
							    amount: $scope.serviceRevenueCount[i].amount,
							    colors: $scope.revcolors[i] 												    
							    };
								$scope.RevenueReports.push(test);
							}
						}
						if($scope.thismonthAmount < $scope.lastMonthAmount) {
							//console.log(true);
							$scope.arrowdown = true;
							$scope.arrowup = false;
							}else{
								//console.log("false");
								$scope.arrowdown = false;
								$scope.arrowup = true;
							}
						$scope.value = $scope.lastMonthAmount - $scope.thismonthAmount;
					/*$scope.serviceRevenueCount.amount = 0;
					for(var i=0; i < $scope.serviceRevenueCount.name.length; i++ ){																															
						 $scope.total_amount = $scope.serviceRevenueCount.amount[i] + $scope.total_amount;
						    	    
					}	*/
				$scope.servicePieCount = result.top_vehicles;
				console.log("pie chart requested stats", $scope.servicePieCount.length);
				for(var i=0; i < $scope.servicePieCount.length; i++){																															
					var tests = {label: $scope.servicePieCount[i].name, 
					  		     data: $scope.servicePieCount[i].count,
					    };
						$scope.pieCountReport.push(tests);		    
				}	
				/*console.log("array", $scope.pieCountReport);*/
				 $scope.pieOptions = 
		                 {
		                series: { pie: { show: true, innerRadius: 0.5, stroke: { width: 0 }, label: { show: true, threshold: 0.05 } } },
		                colors: ['#556B2F','#FFA500','#663333','#00CC33', '#5482FF'],
		                grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#ccc' },   
		                tooltip: true,
		                tooltipOpts: {content: '%s: %p.0%'}
		              }
							
				});		 				 	  
		  }; 
	
	/* Display pending and completed count, amount on table format*/

			$scope.initRevenue = function() {
						//$scope.init();

			/*$scope.$watch('compleDateRange', function(compleDateRange) {								
			$scope.from_date = moment(compleDateRange.startDate._d).format('YYYY/MM/DD');
			$scope.to_date = moment(compleDateRange.endDate._d).format('YYYY/MM/DD');
			$scope.params.from_date = $scope.from_date;
			$scope.params.to_date = $scope.to_date;	
			 $scope.getRevenuePagedDataAsync($scope.params);
				}, true);*/

					console.log("$scope.params", $scope.params);
						$scope.getList = function() {
						  $scope.getRevenuePagedDataAsync($scope.params);
						};
						

						$scope.filterOptions = {
							filterText : "",
							useExternalFilter : true
						};
						
						$scope.totalServerItems = 0;

						$scope.pagingOptions = {
							pageSizes : [15, 25, 50],
							pageSize : 15,
							currentPage : 1
						};
						
						$scope.maxPages = function() {
							return parseInt(Math.ceil($scope.totalServerItems / $scope.pagingOptions.pageSize));
						};
						
						$scope.validateCurrentRevPage = function() {
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
								$scope.validateCurrentRevPage();
							}
						}, true);
							
						$scope.$watch('pagingOptions', function(newVal, oldVal) {
								console.log("newVal", newVal);
								console.log("oldVal", oldVal);
								if(newVal.currentPage !== oldVal.currentPage) {
									$scope.validateCurrentRevPage();
								}
								$scope.getRevenuePagedDataAsync($scope.params);
							}, true);
						
						
						$scope.mySelection = [];
						$scope.gridOptions = {
							data : 'revenue_tablestats',
							enablePaging : true,
							showFooter : true,
							totalServerItems : 'totalServerItems',
							pagingOptions : $scope.pagingOptions,
							filterOptions : $scope.filterOptions,
							selectedItems : $scope.mySelection,
							keepLastSelected: false,
							multiSelect : false,
						};
						
						$scope.gridOptions.columnDefs = [
								{
									field : 'date',
									displayName : 'Date'
								},{
									field : 'completed.count',
									displayName : 'Paid Count'
								},{
									field : 'pending.count',
									displayName : 'Payment_Due Count'
								},{
									field: 'completed.amount',
									displayName: 'Paid Amount'
								},{
									field: 'pending.amount',
									displayName: 'Payment_Due Amount'
								},
								{
									field: 'total',
									displayName: 'Total Amount'
								}];
						
//				get Booked Service in index page
						
					$scope.getRevenuePagedDataAsync = function(filters) {
						var pageSize = $scope.pagingOptions.pageSize;
						var page = $scope.pagingOptions.currentPage;
						var offset = (page - 1) * pageSize;
						var limit = $scope.pagingOptions.pageSize;
						$scope.getRevenueTable(filters, offset, limit).then(
								function(stats) {
								$scope.setRevenuePagingData(stats, page,
								pageSize, stats.revenue_tablelength);
							});
					};

					$scope.getRevenueTable = function(filters, offset, limit, total) {
						var baseRevenue = Restangular.one('jobcards/revenue');
						filters = filters ? filters : {};
						filters.offset = offset;
						filters.limit = limit;
						return baseRevenue.get(filters).then(
								function(RevenueVehicles) {
									$scope.totalServerItems = total;
									//console.log("RevenueVehicles", RevenueVehicles);
									return RevenueVehicles;
								});
					};

					$scope.setRevenuePagingData = function(data, page, pageSize, total) {
						console.log("data SS", data);
							$scope.revenue_tablestats = data.revenue_tablestats;
							
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};
					

				$scope.loadRevenueTable = function() {
					$scope.getRevenuePagedDataAsync($scope.params);
				};

				$scope.loadRevenueTable();
			};
			
			/* End */

			/* Enginner Stats (Service Reports Display COmpleted And Pending Count )*/

			$scope.initEngineer = function() {
			
			/*$scope.$watch('compleDateRange', function(compleDateRange) {								
			$scope.from_date = moment(compleDateRange.startDate._d).format('YYYY/MM/DD');
			$scope.to_date = moment(compleDateRange.endDate._d).format('YYYY/MM/DD');
			$scope.params.from_date = $scope.from_date;
			$scope.params.to_date = $scope.to_date;	
			 $scope.getEngPagedDataAsync($scope.params);
				}, true);*/

					console.log("$scope.params", $scope.params);
						$scope.getList = function() {
						  $scope.getEngPagedDataAsync($scope.params);
						};
						

						$scope.EngfilterOptions = {
							filterText : "",
							useExternalFilter : true
						};
						
						$scope.totalServerItems = 0;

						$scope.EngpagingOptions = {
							pageSizes : [15, 25, 50],
							pageSize : 15,
							currentPage : 1
						};
						
						$scope.maxPages = function() {
							return parseInt(Math.ceil($scope.totalServerItems / $scope.EngpagingOptions.pageSize));
						};
						
						$scope.validateCurrentRevPage = function() {
							if($scope.EngpagingOptions.currentPage > $scope.maxPages()) {
								$scope.EngpagingOptions.currentPage = $scope.maxPages();
							}
							if($scope.EngpagingOptions.currentPage < 1) {
								$scope.EngpagingOptions.currentPage = 1;
							}
							$scope.EngpagingOptions.currentPage = parseInt($scope.EngpagingOptions.currentPage);
						};
						$scope.$watch('totalServerItems', function(newVal, oldVal) {
							if(newVal !== oldVal) {
								$scope.validateCurrentRevPage();
							}
						}, true);
							
						$scope.$watch('EngpagingOptions', function(newVal, oldVal) {
								console.log("newVal", newVal);
								console.log("oldVal", oldVal);
								if(newVal.currentPage !== oldVal.currentPage) {
									$scope.validateCurrentRevPage();
								}
								$scope.getEngPagedDataAsync($scope.params);
							}, true);
						
						
						$scope.mySelection = [];
						$scope.gridOptions = {
							data : 'revenue_tablestats',
							enablePaging : true,
							showFooter : true,
							totalServerItems : 'totalServerItems',
							pagingOptions : $scope.EngpagingOptions,
							filterOptions : $scope.EngfilterOptions,
							selectedItems : $scope.mySelection,
							keepLastSelected: false,
							multiSelect : false,
						};
						
						$scope.gridOptions.columnDefs = [
								{
									field : 'date',
									displayName : 'Date'
								},{
									field : 'completed.count',
									displayName : 'Completed Count'
								},{
									field : 'pending.count',
									displayName : 'Pending Count'
								}/*,{
									field: 'completed.amount',
									displayName: 'Completed Amount'
								},{
									field: 'pending.amount',
									displayName: 'Pending Amount'
								}*/,
								{
									field: 'count',
									displayName: 'Total Count'
								}];
						
//				get Booked Service in index page
						
					$scope.getEngPagedDataAsync = function(filters) {
						var pageSize = $scope.EngpagingOptions.pageSize;
						var page = $scope.EngpagingOptions.currentPage;
						var offset = (page - 1) * pageSize;
						var limit = $scope.EngpagingOptions.pageSize;
						$scope.getRevenueTable(filters, offset, limit).then(
								function(stats) {
								$scope.setRevenuePagingData(stats, page,
								pageSize, stats.revenue_tablelength);
							});
					};

					$scope.getRevenueTable = function(filters, offset, limit, total) {
						var baseRevenue = Restangular.one('jobcards/revenue');
						filters = filters ? filters : {};
						filters.offset = offset;
						filters.limit = limit;
						return baseRevenue.get(filters).then(
								function(RevenueVehicles) {
									$scope.totalServerItems = total;
									//console.log("RevenueVehicles", RevenueVehicles);
									return RevenueVehicles;
								});
					};

					$scope.setRevenuePagingData = function(data, page, pageSize, total) {
							$scope.revenue_tablestats = data.revenue_tablestats;
							
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};
				
				$scope.loadRevenueTable = function() {
					$scope.getEngPagedDataAsync($scope.params);
				};

				$scope.loadRevenueTable();
			};
			
			/* End */

			/* Engineer Stats (Display Completed Amount On Table)*/  
			$scope.initEngComp = function() {
			
			/*$scope.$watch('compleDateRange', function(compleDateRange) {								
			$scope.from_date = moment(compleDateRange.startDate._d).format('YYYY/MM/DD');
			$scope.to_date = moment(compleDateRange.endDate._d).format('YYYY/MM/DD');
			$scope.params.from_date = $scope.from_date;
			$scope.params.to_date = $scope.to_date;	
			 $scope.getRevenuePagedDataAsync($scope.params);
				}, true);*/

						$scope.getList = function() {
						  $scope.getRevenuePagedDataAsync($scope.params);
						};
						

						$scope.filterOptions = {
							filterText : "",
							useExternalFilter : true
						};
						
						$scope.totalServerItems = 0;

						$scope.pagingOptions = {
							pageSizes : [15, 25, 50],
							pageSize : 15,
							currentPage : 1
						};
						
						$scope.maxPages = function() {
							return parseInt(Math.ceil($scope.totalServerItems / $scope.pagingOptions.pageSize));
						};
						
						$scope.validateCurrentRevPage = function() {
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
								$scope.validateCurrentRevPage();
							}
						}, true);
							
						$scope.$watch('pagingOptions', function(newVal, oldVal) {
								console.log("newVal", newVal);
								console.log("oldVal", oldVal);
								if(newVal.currentPage !== oldVal.currentPage) {
									$scope.validateCurrentRevPage();
								}
								$scope.getRevenuePagedDataAsync($scope.params);
							}, true);
						
						
						$scope.mySelection = [];
						$scope.gridOptions = {
							data : 'revenue_tablestats',
							enablePaging : true,
							showFooter : true,
							totalServerItems : 'totalServerItems',
							pagingOptions : $scope.pagingOptions,
							filterOptions : $scope.filterOptions,
							selectedItems : $scope.mySelection,
							keepLastSelected: false,
							multiSelect : false,
						};
						
						$scope.gridOptions.columnDefs = [
								{
									field : 'date',
									displayName : 'Date'
								},{
									field : 'completed.count',
									displayName : 'Completed Count'
								},{
									field : 'completed.amount',
									displayName : 'Completed Amount'
								}/*,{
									field: 'completed.amount',
									displayName: 'Completed Amount'
								},{
									field: 'pending.amount',
									displayName: 'Pending Amount'
								},
								{
									field: 'count',
									displayName: 'Total Count'
								}*/];
						
//				get Booked Service in index page
						
					$scope.getRevenuePagedDataAsync = function(filters) {
						var pageSize = $scope.pagingOptions.pageSize;
						var page = $scope.pagingOptions.currentPage;
						var offset = (page - 1) * pageSize;
						var limit = $scope.pagingOptions.pageSize;
						$scope.getRevenueTable(filters, offset, limit).then(
								function(stats) {
								$scope.setRevenuePagingData(stats, page,
								pageSize, stats.revenue_tablelength);
							});
					};

					$scope.getRevenueTable = function(filters, offset, limit, total) {
						var baseRevenue = Restangular.one('jobcards/revenue');
						filters = filters ? filters : {};
						filters.offset = offset;
						filters.limit = limit;
						return baseRevenue.get(filters).then(
								function(RevenueVehicles) {
									$scope.totalServerItems = total;
									//console.log("RevenueVehicles", RevenueVehicles);
									return RevenueVehicles;
								});
					};

					$scope.setRevenuePagingData = function(data, page, pageSize, total) {
						console.log("data SS", data);
							$scope.revenue_tablestats = data.revenue_tablestats;
							
							$scope.totalServerItems = total;
							if (!$scope.$$phase) {
								$scope.$apply();
							}
						};
					

				$scope.loadRevenueTable = function() {
					$scope.getRevenuePagedDataAsync($scope.params);
				};

				$scope.loadRevenueTable();
			};
		/* End */

			/* Top vehicel Table Display on Revenue chart page */
			$scope.initRevenuePie = function() {
						$scope.init();

						$scope.filterOptions = {
							filterText : "",
							useExternalFilter : true
						};
						
						$scope.totalServerItems = 0;
						$scope.piepagingOptions = {
							pageSizes : [ 15, 25, 50 ],
							pageSize : 15,
							currentPage : 1
						};
						$scope.getList = function() {
						  $scope.getBookedServicePagedDataAsync($scope.params);
						};
						
						$scope.maxPages = function() {
							return parseInt(Math.ceil($scope.totalServerItems / $scope.piepagingOptions.pageSize));
						};
						
						$scope.validateCurrentPage = function() {
							if($scope.piepagingOptions.currentPage > $scope.maxPages()) {
								$scope.piepagingOptions.currentPage = $scope.maxPages();
							}
							if($scope.piepagingOptions.currentPage < 1) {
								$scope.piepagingOptions.currentPage = 1;
							}
							$scope.piepagingOptions.currentPage = parseInt($scope.piepagingOptions.currentPage);
						};
						$scope.$watch('totalServerItems', function(newVal, oldVal) {
							if(newVal !== oldVal) {
								$scope.validateCurrentPage();
							}
						}, true);
						
						$scope.$watch('piepagingOptions', function(newVal, oldVal) {
								console.log(newVal);
								console.log(oldVal);
								if(newVal.currentPage !== oldVal.currentPage) {
									$scope.validateCurrentPage();
								}
								$scope.getBookedServicePagedDataAsync($scope.params);
							}, true);
						
						
						$scope.mySelection = [];
						$scope.PiegridOptions = {
							data : 'top_vehicles',
							enablePaging : true,
							showFooter : false,
							totalServerItems : 'totalServerItems',
							piepagingOptions : $scope.piepagingOptions,
							filterOptions : $scope.filterOptions,
							selectedItems : $scope.mySelection,
							keepLastSelected: false,
							multiSelect : false,
						};
						
						$scope.PiegridOptions.columnDefs = [
								{
									field : 'name',
									displayName : 'Name'
								},{
									field : 'count',
									displayName : 'Count'
								}];
						
//				get Booked Service in index page
						
					$scope.getBookedServicePagedDataAsync = function(filters) {
						var pageSize = $scope.piepagingOptions.pageSize;
						var page = $scope.piepagingOptions.currentPage;
						var offset = (page - 1) * pageSize;
						var limit = $scope.piepagingOptions.pageSize;
						$scope.getBookedService(filters, offset, limit).then(
								function(stats) {
									console.log("stats", stats);
								$scope.setPagingData(stats, page,
								pageSize, stats.result.top_vehicles.length);
							});
					};

					$scope.getBookedService = function(filters, offset, limit) {
						var baseOffers = Restangular.one('jobcards/topcompleted');
						filters = filters ? filters : {};
						filters.offset = offset; 
						filters.limit = limit;
						return baseOffers.get($scope.params).then(
								function(services) {
									return services;
								});
					};

					$scope.setPagingData = function(data, page, pageSize, total) {
					$scope.top_vehicles = data.result.top_vehicles;
					console.log("$scope.top_vehicles...//...", $scope.top_vehicles);
					$scope.totalServerPieItems = total;
					if (!$scope.$$phase) {
						$scope.$apply();
					}
				};

				$scope.loadBookesServiceTable = function() {
					$scope.getBookedServicePagedDataAsync($scope.params);
				};

				$scope.loadBookesServiceTable();
			};

			
			/* End */

	// completed spline chart

	$scope.completedChart = function(result){
		console.log("result..:", result);
			/*console.log("result...", result.stats_breakdown.service_stats);*/
			$scope.chartMonth = [];
			$scope.myData = [];
			$scope.chartDates = [];

			var line_row = [];
			var count_row = [];
			  var a = moment($scope.params.from_date).format('YYYY/MM/DD');
			  var b = moment($scope.params.to_date).format('YYYY/MM/DD');
			  b = moment(b).add('days',1);
			  console.log("DATE from", a);
			  console.log("DATE to", b);
			  for(var k=0, m = moment(a); m.isBefore(b); m.add('days',1)){
			  	$scope.chartDates[k] = [k,m.format('YYYY/MM/DD')];
			  	console.log("chartDates", $scope.chartDates[k]);
				k++;
			  }

			   for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){	
				var flag = 0;								
				for(var j = 0; j < result.completed_stats.length; j++) {

					if(m.format('YYYY/M/D') === result.completed_stats[j].date) {
						var pt = [k,result.completed_stats[j].amount];
						line_row.push(pt);	
						var cou = [k,result.completed_stats[j].count];
						count_row.push(cou);								
						k++;
						flag = 1;
					}
				}
				if(flag != 1) {
					var pt = [k,0];
					line_row.push(pt);	
					var cou = [k,0];
					count_row.push(cou);						
					k++;
				}
			}
			console.log("line_row", line_row);
			var limit = 7;
			$scope.cdates = [];																	
			var offset = parseInt($scope.chartDates.length >= limit ? $scope.chartDates.length / limit : 1);									
			for(var i=0; i < $scope.chartDates.length; i++){
				if(i % offset == 0){											
					$scope.cdates.push($scope.chartDates[i]);
				}										
			}
			
			$scope.mychart = [{data: line_row, points: {show: true, radius: 6},
			splines:{show: true, tension: 0.45, lineWidth: 5, fill: 0}}];

			$scope.countchart = [{data: count_row, points: {show: true, radius: 6}, 
			splines:{show: true, tension: 0.45, lineWidth: 5, fill: 0}}];
			
			
			 $scope.chartOptions = {
						/*lines: {show: true, fill: false},*/
						colors: ['#00CC33'],
	                    points: {show: true, radius: 4, fillColor: '#cccccc'},
	                  
	                    legend: {show: true, container: '#legend-container'},
	                    grid: {borderWidth: 0, hoverable: true, clickable: true},
	                    yaxis: {show: true},
	                    xaxis: {show: true, ticks: $scope.cdates},
						background: '#232323',
						tooltip: true,
						tooltipOpts: { content: 'Date: %x <br> Services: %y.0', defaultTheme: false, shifts: { x: 10, y: -25 } }
	                };
			 var previousPoint = null, ttlabel = null;
	           $('#line_chart').bind('plothover', function(event, pos, item) {

	                if (item) {
	                    if (previousPoint !== item.dataIndex) {
	                        previousPoint = item.dataIndex;

	                        $('#chart-tooltip').remove();
	                        var x = item.datapoint[0], y = item.datapoint[1];
	                        var dateArr = $scope.chartMonth[item.dataIndex];
	                        $('<div id="chart-tooltip" class="chart-tooltip">' + ttlabel + '</div>')
	                            .css({top: item.pageY - 50, left: item.pageX - 50}).appendTo("body").show();
	                    }
	                }
	                else {
	                    $('#chart-tooltip').remove();
	                    previousPoint = null;
	                }
	            });
           
		};


				$scope.initAllBranch = function() {
						$scope.init();
						var basebranches = Restangular.all('branches/all');
						return basebranches.getList(/*{
							customervehicles : $scope.customervehicles
						}*/).then(function(branches) {
							$scope.allBranches = branches;
							return branches;
						});
					};

					$scope.initAllDealer = function() {
						$scope.init();
						var basedealers = Restangular.all('dealers/all');
						return basedealers.getList(/*{
							customervehicles : $scope.customervehicles
						}*/).then(function(dealers) {
							$scope.allDealers = dealers;
							return dealers;
						});
					};
					
					$scope.initAllServicetypes = function() {
						$scope.init();
						var baseservicetypes = Restangular.all('service-types/all');
						return baseservicetypes.getList().then(function(servicetypes) {
							$scope.allServicetypes = servicetypes;
							return servicetypes;
						});
					};

					$scope.initAllMake = function() {
						$scope.init();
						var basemakes = Restangular.all('dealers/makes/all');
						return basemakes.getList().then(function(makes) {
							$scope.allMakes = makes;
							return makes;
						});
					};

					$scope.initAllModel = function() {
						$scope.init();
						var basemodels = Restangular.all('dealers/models/all');
						return basemodels.getList().then(function(models) {
							$scope.allModels = models;
							return models;
						});
					};

					$scope.initAllUser = function() {
						$scope.init();
						var baseusers = Restangular.all('users/all');
						return baseusers.getList({engineer: "ENGINEER"}).then(function(users) {
							$scope.allUsers = users;
							return users;
						});
					};
  });

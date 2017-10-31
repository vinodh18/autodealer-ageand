'use strict';
angular.module('autodealerApp', 
    ['ngAnimate', 'ngCookies', 'ngResource', 'ngSanitize',  'ngFileUpload', 'imageupload',
         'ui.router', 'ui.sortable', 'ui.bootstrap', 'ui.utils', 'ui.load', 'ui.jq', 'restangular',
         'ngGrid',  'LocalStorageModule', 'dialogs.main', 'ngImgCrop',
          'dialogs.default-translations', 'angular-flot', 'ngBootstrap', 'ui.select',
            'ui.bootstrap.datetimepicker', 'angularMoment', 'pascalprecht.translate', 
          'ngStorage', 'angularSpinner'])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider,
     $httpProvider, RestangularProvider, $injector, dialogsProvider) {
    $stateProvider.state('app', {
        templateUrl: 'app/app.html',
        abstract: true,
        resolve: {
            user: ['Auth', function(Auth) {
                    console.log("resolving CurrentUser");
                    return Auth.getCurrentUser();
                }]
        }
    });
    dialogsProvider.useBackdrop('static');
    dialogsProvider.useEscClose(true);
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    RestangularProvider.setBaseUrl('/api');
    //RestangularProvider.setDefaultHttpFields({withCredentials: true});
    RestangularProvider.setRestangularFields({
        id: "_id"
    });
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        
        var customersPattern = /\/api\/customers\/(.+)/g;
        var dealersPattern = /\/api\/dealers\/(.+)/g;
        var dealerImageUploadPattern = /\api\/dealers\/(.+)\/image\/upload/g;
        
        var getBranchesPattern = /\/api\/dealers\/(.+)\/branch\/(.+)/g;
        var getMakesPattern = /\/api\/dealers\/(.+)\/make\/(.+)/g;
        var getModelsPattern = /\/api\/dealers\/(.+)\/make\/(.+)\/model\/(.+)/g;
        var makesPattern = /\/api\/makes\/(.+)/g;
        var modelsPattern = /\/api\/models\/(.+)/g;
        var servicesPattern = /\/api\/jobcards\/(.+)/g;
        var customerVehiclesPattern = /\/api\/customer-vehicles\/(.+)/g;
        var vehicleTypesPattern = /\/api\/vehicle-types\/(.+)/g;
        var serviceTypesPattern = /\/api\/service-types\/(.+)/g;
        var warrantyTypesPattern = /\/api\/warranty-types\/(.+)/g;
        var adsmediaPattern = /\/api\/ads-media\/(.+)/g;
        var newseventsPattern = /\/api\/news-events\/(.+)/g;
        var offerPattern = /\/api\/offers\/(.+)/g;
        var vehiclesPattern = /\/api\/vehicles\/(.+)/g;
        var usersPattern = /\/api\/users\/(.+)/g;
        var emailTemplatePattern = /\/api\/email-templates\/(.+)/g;
        var planPattern = /\/api\/plans\/(.+)/g;
        var labourChargePattern = /\/api\/labour-charges\/(.+)/g;
        var miscchargePattern = /\/api\/misc-charges\/(.+)/g;
        var accessoriesPattern =  /\/api\/accessories\/(.+)/g;
        var partsGroupPattern =  /\/api\/parts-groups\/(.+)/g;
        var jobCardsMastersPattern =  /\/api\/jobcard-masters\/(.+)/g;
        var partPattern =  /\/api\/parts\/(.+)/g;

        var extractedData = {};
        console.log(operation);
        console.log(url);
        

        // .. to look for getList operations

         if (url === '/api/email-templates') {
            if (operation === "getList") {
                // .. and handle the data and meta data
                extractedData = data.response.email_templates;
                extractedData.total = data.response.total;
            } else if (operation === "get") {
                extractedData = data.response.email_templates;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        if(url === '/api/plans') { 
          if (operation === "getList") { 
            // .. and handle the data and meta data 
            extractedData = data.response.plans; 
            extractedData.total = data.response.total; 
          } 
          extractedData.meta = data.meta; 
          return extractedData; 
        }
        
        if(url === '/api/jobcards/serviceCounts') {
            if (operation === "get") { 
                extractedData = data.response.stats;
            }            
            return extractedData;
        }

        if(url === '/api/jobcards/revenueCounts') {
            if (operation === "get") { 
                extractedData = data.response;
            }            
            return extractedData;
        }

        if(url === '/api/dealers/branches/all') {
            if (operation === "getList") {                
                extractedData = data.response.allBranches;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }
         if(url === '/api/dealers/makes/all') {
            if (operation === "getList") {                
                extractedData = data.response.allMakes;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        if(url === '/api/jobcards/serviceBreakdownStats') {
            if (operation === "get") { 
                extractedData = data.response;
            }        
            return extractedData;
        }

        if(url === '/api/jobcards/revenueBreakdownStats') {
            if (operation === "get") { 
                extractedData = data.response;
            }        
            return extractedData;
        }

        if(url === '/api/dealers/makes/all') {
            if (operation === "getList") { 
                extractedData = data.response.allMakes;
            }        
            return extractedData;
        }

        if(url === '/api/dealers/models/all') {
            if (operation === "getList") { 
                extractedData = data.response.allModels;
            }        
            return extractedData;
        }


        if(getBranchesPattern.test(url)){
            if(operation==="get"){
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
        } 

        if(getMakesPattern.test(url)){
            if(operation==="get"){
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
        } 

        if(getModelsPattern.test(url)){
            if(operation==="get"){
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
        } 
           
         if(url === '/api/jobcards/serviceStatusExport') {
                    if (operation === "get") { 
                        extractedData = data.response;
                    }
                    //extractedData.meta = data.meta;
                    return extractedData;
                }
           
            if(url === '/api/jobcards/revenueExport'){
                if(operation === 'get'){
                    extractedData = data.response;
                }
                return extractedData;
            }
            
            if(url === "/api/jobcards/engineerExport"){
                if(operation == 'get'){
                    extractedData = data.response;
                }
                return extractedData;
            }

        if (url === '/api/users/check-email') {
          if (operation === "get") {
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
            }

        if (url === '/api/makes/check-name') {
          if (operation === "get") {
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
            }

        if (url === '/api/models/check-model') {
          if (operation === "get") {
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
            }

        if (url === '/api/users/check-username') {
            if (operation === "get") {
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
            }


        if(dealerImageUploadPattern.test(url)){
                    if(operation==="post"){
                        extractedData = data.response;
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
                }

          if(url === '/api/jobcards/stats') {
                    if (operation === "get") {
                        // .. and handle the data and meta data
                        extractedData = data.response.stats;
                        //extractedData.total = data.response.total;                        
                    }
                    console.log("App data..", data);
                    extractedData.meta = data.meta;
                    return extractedData;
                }  
            if(url === '/api/jobcards/status') {
                    if (operation === "get") {
                        // .. and handle the data and meta data
                        extractedData = data.response.result;
                        //extractedData.total = data.response.total;                        
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
                }  
             if(url === '/api/jobcards/all-completed') {
                if (operation === "get") {
                    // .. and handle the data and meta data
                    extractedData = data.response.result;
                    //extractedData.total = data.response.total;                        
                }
                extractedData.meta = data.meta;
                return extractedData;
            }  
            if(url === '/api/jobcards/completed-paid') {
                if (operation === "get") {
                    // .. and handle the data and meta data
                    extractedData = data.response.result;
                    //extractedData.total = data.response.total;                        
                }
                extractedData.meta = data.meta;
                return extractedData;
            }  
        if(url === '/api/jobcards/request') {
                    if (operation === "get") {
                        // .. and handle the data and meta data
                        extractedData = data.response.result;
                        //extractedData.total = data.response.total;                        
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
                }
         if(url === '/api/jobcards/overview') {
                    if (operation === "get") {
                        // .. and handle the data and meta data
                        extractedData = data.response.stats;
                        //extractedData.total = data.response.total;                        
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
                } 
            if(url === '/api/jobcards/topvehicles') {
                    if (operation === "get") {
                        // .. and handle the data and meta data
                        extractedData = data.response.result;
                        //extractedData.total = data.response.total;                        
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
                } 

             if(url === '/api/jobcards/breakdown') {
                    if (operation === "get") {
                        // .. and handle the data and meta data
                        extractedData = data.response.result;
                        //extractedData.total = data.response.total;                        
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
                } 

             if(url === '/api/jobcards/servicestats') {
                    if (operation === "get") {
                        // .. and handle the data and meta data
                        extractedData = data.response.result;
                        //extractedData.total = data.response.total;                        
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
                } 
            if(url === '/api/jobcards/revenue') {
                    if (operation === "get") {
                        // .. and handle the data and meta data
                        extractedData = data.response.stats;
                        //extractedData.total = data.response.total;                        
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
                } 

        if(url === '/api/jobcards/userstats') {
                    if (operation === "get") {
                        // .. and handle the data and meta data
                        extractedData = data.response.stats;
                        //extractedData.total = data.response.total;                        
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
                }
                

             if(url === '/api/customers') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.customers;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.customer;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }
                if(url === '/api/customers/all') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.customers;
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
              } 

            if(url === '/api/dealers') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.dealers;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.dealers;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }
                if(url === '/api/dealers/all') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.dealers;
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
              } 

           if(url === '/api/labour-charges') {
                if (operation === "getList") {
                    // .. and handle the data and meta data
                    extractedData = data.response.labourcharges;
                    extractedData.total = data.response.total;
                } else if (operation === "get") {
                    extractedData = data.response.labourcharge;
                }
                extractedData.meta = data.meta;
                if(data.response){
                    extractedData.response = data.response;
                }
                return extractedData;
            }
            
            if(url === '/api/misc-charges') {
                if (operation === "getList") {
                    // .. and handle the data and meta data
                    extractedData = data.response.misccharges;
                    extractedData.total = data.response.total;
                } else if (operation === "get") {
                    extractedData = data.response.misccharge;
                }
                extractedData.meta = data.meta;
                if(data.response){
                    extractedData.response = data.response;
                }
                return extractedData;
            }
            
            if(url === '/api/accessories') {
                if (operation === "getList") {
                    // .. and handle the data and meta data
                    extractedData = data.response.accessories;
                    extractedData.total = data.response.total;
                } else if (operation === "get") {
                    extractedData = data.response.accessories;
                }
                extractedData.meta = data.meta;
                if(data.response){
                    extractedData.response = data.response;
                }
                return extractedData;
            }
            
            if(url === '/api/parts-groups') {
                if (operation === "getList") {
                    // .. and handle the data and meta data
                    extractedData = data.response.partsgroups;
                    extractedData.total = data.response.total;
                } else if (operation === "get") {
                    extractedData = data.response.partsgroup;
                }
                extractedData.meta = data.meta;
                if(data.response){
                    extractedData.response = data.response;
                }
                return extractedData;
            }
            if(url === '/api/parts-groups/all') {
            if (operation === "getList") { 
                extractedData = data.response.partsgroup;
            }        
            return extractedData;
        }
            
             if(url === '/api/jobcard-masters') {
                if (operation === "getList") {
                    // .. and handle the data and meta data
                    extractedData = data.response.jobcardmasters;
                    extractedData.total = data.response.total;
                } else if (operation === "get") {
                    extractedData = data.response.jobcardmasters;
                }
                extractedData.meta = data.meta;
                if(data.response){
                    extractedData.response = data.response;
                }
                return extractedData;
            }

             if(url === '/api/parts') {
                if (operation === "getList") {
                    // .. and handle the data and meta data
                    extractedData = data.response.parts;
                    extractedData.total = data.response.total;
                } else if (operation === "get") {
                    extractedData = data.response.parts;
                }
                extractedData.meta = data.meta;
                if(data.response){
                    extractedData.response = data.response;
                }
                return extractedData;
            }
            /*if(url === '/api/branches') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.branches;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.branches;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }
                if(url === '/api/branches/all') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.branches;
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
              } 

              if(url === '/api/makes') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.makes;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.makes;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }
                if(url === '/api/makes/all') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.makes;
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
              } 

            if(url === '/api/models') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.models;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.models;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }
                if(url === '/api/models/all') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.models;
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
              }
*/
            if(url === '/api/jobcards') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.services;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.services;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }

                if(url === '/api/jobcards/feedback') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.services;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.services;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }

                 if(url === '/api/jobcards/pending') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.services;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.services;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }

                 if(url === '/api/jobcards/users') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.services;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.services;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }

                if(url === '/api/jobcards/all') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.services;
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
              } 

               if(url === '/api/service-types') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.servicetypes;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.servicetypes;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }
                if(url === '/api/service-types/all') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.servicetypes;
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
              } 
            if(url === '/api/customer-vehicles') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.customervehicles;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.customervehicles;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }
                if(url === '/api/customer-vehicles/all') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.customervehicles;
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
              } 

            if(url === '/api/vehicle-types') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.vehicletypes;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.vehicletypes;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }
                if(url === '/api/vehicle-types/all') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.vehicletypes;
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
              } 

              if(url === '/api/warranty-types') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.warrantytypes;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.warrantytypes;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }
                if(url === '/api/warranty-types/all') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.warrantytypes;
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
              } 

              if(url === '/api/ads-media') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.adsmedia;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.adsmedia;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }
             if(url === '/api/ads-media/all') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.adsmedia;
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
              } 

            if(url === '/api/news-events') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.newsevents;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.newsevents;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }
             if(url === '/api/news-events/all') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.newsevents;
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
              } 

          if(url === '/api/offers') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.offers;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.offers;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }
             if(url === '/api/offers/all') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.offers;
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
              } 

        if(url === '/api/vehicles') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.vehicles;
                        extractedData.total = data.response.total;
                    } else if (operation === "get") {
                        extractedData = data.response.vehicles;
                    }
                    extractedData.meta = data.meta;
                    if(data.response){
                        extractedData.response = data.response;
                    }
                    return extractedData;
                }
             if(url === '/api/vehicles/all') {
                    if (operation === "getList") {
                        // .. and handle the data and meta data
                        extractedData = data.response.vehicles;
                    }
                    extractedData.meta = data.meta;
                    return extractedData;
              } 

        if (url === '/api/users') {
            if (operation === "getList") {
                // .. and handle the data and meta data
                extractedData = data.response.users;
                extractedData.total = data.response.total;
            } else if (operation === "get") {
                extractedData = data.response.users;
            }
            extractedData.meta = data.meta;
            if(data.response){
                        extractedData.response = data.response;
                    }
            return extractedData;
        }
        if (url === '/api/users/all') {
            if (operation === "getList") {
                // .. and handle the data and meta data
                extractedData = data.response.users;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        if (url === '/api/auth/login') {
            if (operation === "post") {
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }
        if (url === '/api/auth/refresh-token') {
            if (operation === "post") {
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }
        if (url === '/api/auth/logout') {
            if (operation === "post") {
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }
        
        if (url === '/api/users/me') {
            if (operation === "get") {
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }
               
        if (url === '/api/plans/limit/customer') {
            if (operation === "get") {
                extractedData = data;
            }            
            return extractedData;
        }

        if (customersPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.customer;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        if (dealersPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.dealer;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        /*if (branchesPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.branch;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        if (makesPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.make;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

         if (modelsPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.model;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }*/

        if (servicesPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response;
                //extractedData.total = data.response.total;
            } else if(operation === "put"){
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        if (customerVehiclesPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.customervehicle;
                //extractedData.total = data.response.total;
            } else if(operation === "put"){
                extractedData = data.response;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

         if (vehicleTypesPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.vehicletype;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        if (serviceTypesPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.servicetype;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

         if (warrantyTypesPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.warrantytype;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        if (adsmediaPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.adsmedia;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        if (newseventsPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.newsevents;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        if (offerPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.offers;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

         if (vehiclesPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.vehicle;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }


        if (usersPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.user;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

         if (emailTemplatePattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.email_template;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

         if (planPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.plan;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        if (labourChargePattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.labourcharge;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        if (miscchargePattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.misccharge;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        if (accessoriesPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.accessory;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        if (partsGroupPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.partsgroup;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }

        if (jobCardsMastersPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.jobcardmaster;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }
        
        if (partPattern.test(url)) {
            if (operation === "get") {
                // .. and handle the data and meta data
                extractedData = data.response.part;
                //extractedData.total = data.response.total;
            }
            extractedData.meta = data.meta;
            return extractedData;
        }
       return data;
    });
}).factory('authInterceptor', function($rootScope, $q, localStorageService, $location) {
    return {
        // Add authorization token to headers
        request: function(config) {
            config.headers = config.headers || {};
           /* if (localStorageService.get('access_token')) {
                config.headers.Authorization = 'Bearer ' + localStorageService.get('access_token');
            }*/
              if(config.url == 'https://ibcapps-test.s3.amazonaws.com/'){
                return config;
            }            
            if (localStorageService.get('access_token')) {
                config.headers.Authorization = 'Bearer ' + localStorageService.get('access_token');
            }
            return config;
        }
    };
})
// Intercept 401s response
.run(function($rootScope, $urlRouter, $location, Auth, Restangular, localStorageService, $injector, $q, $http, $state) {
    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
        if (response.status === 401 && Auth.getmaxTries() < 3) {
            console.log("401 response error");
            if(response.config.url == '/api/auth/login'){                
                //$http(response.config).then(responseHandler, deferred.reject);
                return true;
            }
            Auth.setMaxTries();
            Auth.refreshToken().then(function(data) {
                Auth.resetTries();
                $http(response.config).then(responseHandler, deferred.reject);
            });
            return false;
        }
        /*if(response.status === 403 ){
				localStorageService.clearAll();
				$location.path('/login');
			}*/
        return true;
    });
    // Redirect to login if route requires auth and you're not logged in	
    $rootScope.$on('$stateChangeStart', function(event, next) {
        console.log("OnStateChange");
        if (Auth.getCurrentUser().then) {
            Auth.getCurrentUser().then(function(user) {
                if (next.authenticate && !Auth.isLoggedIn()) {
                    $location.path('/login');
                } else if ((next.role) && next.role != Auth.getCurrentUser().role) {
                    console.log("unauthorized");
                     var stateRole = next.role;
            var authUserRole = Auth.getCurrentUser().role;
            console.log('Auth user role : ', authUserRole);
            if((typeof stateRole === 'object' && (stateRole.indexOf(authUserRole) == -1)) ||
               (typeof stateRole === 'string' && stateRole != authUserRole)) {
                    $location.path('/unauthorized');
                    }
                }
            });
            return;
        }
        //console.log("next Role:", next.role);
        //console.log("getCurrentUser Role:", Auth.getCurrentUser().role);
        /*if (next.authenticate && !Auth.isLoggedIn()) {
            $location.path('/login');
        } else if ((next.role) && next.role != Auth.getCurrentUser().role) {
            console.log("unauthorized");
            $location.path('/unauthorized');


        }*/
    });

});
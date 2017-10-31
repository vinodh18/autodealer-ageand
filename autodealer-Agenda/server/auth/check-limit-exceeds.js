'use strict';

var mongoose = require('mongoose');
var moment = require('moment');
var config = require('../config/environment');
var compose = require('composable-middleware');
var CustomerModel = require('../api/customer/customer.model');
var VehicleModel = require('../api/vehicles/vehicles.model');
var JobCardModel = require('../api/jobcard/jobcard.model');

var ObjectId = require('mongoose').Types.ObjectId;

/**
 * Check whether the dealer doesn't exceeds the plan limits
 * Otherwise returns 403
 */
function limitExceeds(schema) {	
	return compose()		
	.use(function(req, res, next) {    	
    	var dealerObj = req.user.dealer;
    	var planLimitsObj = req.user.dealer.plan.plan_limits; 
    	
      if(schema === "VEHICLE") {
          if(req.user.dealer.plan.unlimited){
            next();
          }else{
        		VehicleModel.count({'dealer': new ObjectId(req.user.dealer._id)}, function(err, count) {
        			if(count < planLimitsObj.vehicles){
        				next();		
        			}else{
        				res.send(403);		
        			}
  			    });   
          }      	
     	} else if(schema === "JOBCARD") {
          var queryObj = {};
          var from = moment().startOf('month');
          var to =  moment().endOf('month');
          queryObj.dealer = new ObjectId(req.user.dealer._id);
          queryObj.service_date = {$gte: from._d, $lte: to._d};

          if(req.user.dealer.plan.unlimited){
            next();
          }else{
        		JobCardModel.count(queryObj, function(err, count) {            
              if(count < planLimitsObj.job_cards){
        				next();		
        			}else{
        				res.send(403);		
        			}
  			    });
          }           	
     	} else if(schema === "CUSTOMER") {
          if(req.user.dealer.plan.unlimited){
            next();
          }else{
        		CustomerModel.count({'dealer': new ObjectId(req.user.dealer._id)}, function(err, count) {
        			if(count < planLimitsObj.customers){
        				next();		
        			}else{
        				res.send(403);		
        			}
  			    });
          }           	
     	} else if(schema === "BRANCH") { 
        if(req.user.dealer.plan.unlimited){
            next();
        }else{     		
      		if(dealerObj.branches.length < planLimitsObj.customers){
      			next();		
      		}else{
      			res.send(403);		
      		}
        }    			      
     	} else if(schema === "MAKE") {
        if(req.user.dealer.plan.unlimited){
            next();
        }else{      		
    			if(dealerObj.makes.length < planLimitsObj.makes){
    				next();		
    			}else{
    				res.send(403);		
    			}	
        }  		      
     	} else if(schema === "MODEL") {
        if(req.user.dealer.plan.unlimited){
            next();
        }else{
       		var modelsCount = 0;      		
       		for(var i = 0; i < dealerObj.makes.length; i++){
       			modelsCount += dealerObj.makes[i].models.length;
       		}     		
    			if(modelsCount < planLimitsObj.models){
    				next();		
    			}else{
    				res.send(403);		
    			}
        }  
     	} else {
        throw new Error('Schema needs to check whether plan limit exceeds');
      }      
  	});
};


exports.limitExceeds = limitExceeds;
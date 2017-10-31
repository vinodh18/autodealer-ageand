'use strict';

var DealerModel = require('../dealer/dealer.model');
var UserModel = require('../user/user.model');
var CustomerModel = require('./customer.model');
var passport = require('passport');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');
var request = require('request');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');  
var validateJwt = expressJwt({ secret: config.secrets.accessToken });
var ObjectId = require('mongoose').Types.ObjectId;

var globalLimit = config.globalRowsLimit;

/**
 * Get list of Customers
 */


exports.index = function(req, res) {
	
	var queryObj = {};
	queryObj.dealer = req.user.dealer._id;
	if (req.query.name) {
		queryObj.name = req.query.name;
	}
	if (req.query.phone){
		queryObj.phone = req.query.phone;
	}		
	if(req.query.type && req.query.value){    	
    	var queryType = req.query.type;
    	var queryValue = req.query.value;
    	var value = new RegExp("^" + queryValue,"i");
    	if(queryType == 'name'){
    		queryObj.name = {$regex: value};
    	}else if(queryType == 'email'){
    		queryObj.email = {$regex: value};
    	}else if(queryType == 'phone'){
    		queryObj.phone = {$regex: value};
    	}   	
    }
	
	var customerLimit = req.query.limit ? req.query.limit : globalLimit;
	var customerOffset = req.query.offset ? req.query.offset : 0;
	if (customerLimit < 0 || customerLimit > globalLimit) {
		customerLimit = globalLimit;
	}
	CustomerModel.find(queryObj, null, {
		limit : customerLimit,
		skip : customerOffset
	})
	.populate('dealer')
	.exec(function(err, customers) {
		if (!customers) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			CustomerModel.count(queryObj, function(err, count) {
				var total = err ? 'N/A' : count;
				sendRsp(res, 200, 'ok', {
					total : total,
					customers : customers
				});
			});
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};



/**
 * select fields in display drop down
 */
exports.all = function(req, res) {
	var queryObj = {};
	if (req.query.name) {
		queryObj.name = {$regex: req.query.name};
	}	
	CustomerModel.find(queryObj, '_id name email', null, function(err, customers) {		
		if (!customers) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			sendRsp(res, 200, 'OK', {
				customers : customers
			});
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};


/**
 * Create a new Customer
 */
exports.create = function(req, res, next) {
	req.checkBody('name', 'Missing Params').notEmpty();
	req.checkBody('username', 'Missing Params').notEmpty();
	req.checkBody('email', 'Missing Params').notEmpty();
	req.checkBody('password', 'Missing Params').notEmpty();
	req.checkBody('phone', 'Missing Params').notEmpty();
		
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}

	// Create New User In AutoDealer
	var newUser = new UserModel({
		name 		: req.body.name,
		username	: req.body.username,
		password	: req.body.password,
		role		: 'CUSTOMER',
		email		: req.body.email,				
		dealer 		: req.user.dealer._id,
		branch		: req.body.branch
	});

	newUser.save(function(err, user){
		if(!err){
			log.info("User created");
			// Create New Customer In AutoDealer
			var newCustomer = new CustomerModel({
				_id				: user._id,
				name 			: req.body.name,
				email			: req.body.email,
				phone			: req.body.phone,
				address			: req.body.address,
				dealer 			: req.user.dealer._id,
			});

			newCustomer.save(function(err, customer) {
				if (!err) {
					log.info("Customer created");					
					var opts = [{path: 'dealer'}]
					CustomerModel.populate(customer, opts, function(err, customer){
						if(!err){
							sendRsp(res, 201, 'Created', {customer : customer });
						}
				 	});
				}else {
					if (err.name === 'ValidationError') {
						sendRsp(res, 400, 'Validation error');
					}  else {
						sendRsp(res, 500, 'Server error');
					}
					log.error('Internal error(%d): %s', res.statusCode, err.message);
				}
			});
		} else {
			if (err.name === 'ValidationError') {
				sendRsp(res, 400, 'Validation error');
			}  else {
				sendRsp(res, 500, 'Server error');
			}
			log.error('Internal error(%d): %s', res.statusCode, err.message);
		}
	  });	
};

/**
 * Get a single Customer
 */
exports.show = function(req, res, next) {
	var id = req.params.id;
	CustomerModel.findById(id)
	.populate('dealer')
	.exec(function (err, customer) {
		if (!customer) {
			sendRsp(res, 404, 'Not Found');
			return;
		}
		if (!err) {
			sendRsp(res, 200, 'OK', {
				customer : customer
			});
		} else {
			log.error('Internal error(%d): %s', res.statusCode,	err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};
		
/**
 * Delete a single Customer
 */
exports.destroy = function(req, res) {
	var customerId = req.params.id;	
	CustomerModel.findById(customerId, function(err, customer) {
		if (!customer) {
			sendRsp(res, 404, 'Customer Not Found');
			return;
		} else {
			// find user in autoDealer
			UserModel.findOne({"email" : customer.email}, function (err, user) {
	            if(!user) {
	              sendRsp(res, 404, 'User Not Found');
	            }else{          	          	
		           	user.remove(function (err,user) {
		            	if (!err) {
		                  	console.log("removed user in authModule");		
		                    customer.remove(function (err) {
			                    if(!err) {
			                        log.info("customer removed");
			                        var opts = [{path: 'dealer'}];
										CustomerModel.populate(customer, opts, function(err, customer){
											if(!err){
												sendRsp(res, 200, 'Deleted', {customer : customer});
											}
									});
			                    } else {
			                        log.error('Internal error(%d): %s',res.statusCode,err.message);
			                        sendRsp(res, 500, 'Server error');
			                    }
		                	});                 
		              	} else {
		                  log.error('Internal error(%d): %s',res.statusCode,err.message);
		                  sendRsp(res, 500, 'Server error');
		              	}
		          	});
		        }
	        }); 
        } 
    });		
};


//  multiple delete customers

exports.deleteMultiple = function (req ,res) {
	var customerIds = req.body.ids;	
	
	CustomerModel.remove({_id: {$in : customerIds}}, function (err) {		
	    if (!err) {
	       	sendRsp(res, 200, 'Customers Removed');
	    } else {
	        log.error('Internal error(%d): %s',res.statusCode, err.message);
	        sendRsp(res, 500, 'Server error');
	    }
	});	
};


/**
 * Update  Dealer
 */
exports.update = function(req, res, next) {
	req.checkBody('name', 'Missing Params').notEmpty();
	req.checkBody('phone', 'Missing Params').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}
	var customerId = req.params.id;
	CustomerModel.findById(customerId, function(err, customer) {
		if (!customer) {
			sendRsp(res, 404, 'Not Found');
		}
		customer.name 			= req.body.name;
		customer.email			= req.body.email;
		customer.phone			= req.body.phone;
		customer.address		= req.body.address;
		customer.dealer 		= req.user.dealer._id;
		customer.save(function(err) {
			if (!err) {
				log.info("Customer updated");
				var opts = [{path: 'dealer'}]
				CustomerModel.populate(customer, opts, function(err, customer){
					if(!err){	
						sendRsp(res, 200, 'Updated',{customer : customer});
					}
				});
			} else {
				if (err.name === 'ValidationError') {
					sendRsp(res, 400, 'Validation error');
				} else {
					sendRsp(res, 500, 'Server error');
				}
				log.error('Internal error(%d): %s', res.statusCode, err.message);
			}
		});
	});
};


/**
 * Authentication customerback
 */
exports.authCustomerback = function(req, res, next) {
	res.redirect('/');
};

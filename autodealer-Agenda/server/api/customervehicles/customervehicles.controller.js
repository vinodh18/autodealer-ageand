'use strict';
var CustomervehiclesModel = require('./customervehicles.model');
var CustomerModel = require('../customer/customer.model');
var UserModel = require('../user/user.model');
var VehicletypeModel = require('../vehicletype/vehicletype.model');
var passport = require('passport');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');
var ObjectId = require('mongoose').Types.ObjectId;
var globalLimit = config.globalRowsLimit;

/**
 * Get list of CustomerVehicles
 */

exports.index = function(req, res) {	
		var queryObj = {};

		if(req.user.role == "CUSTOMER"){
			queryObj.customer = req.user._id;
		}
		
		if (req.query.purchase_date) {
			queryObj.purchase_date = req.query.purchase_date;
		}
		
		if(req.query.reg_no){    	
		   	var queryValue = req.query.reg_no;
		   	var value = new RegExp("^" + queryValue,"i");
    	 	queryObj.reg_no = {$regex: value};
		}

		if(req.query.customer){
			queryObj.customer = req.query.customer;
		}
		if(req.query.vehicle_type){
			queryObj.vehicle_type = req.query.vehicle_type;
		}
		if(req.query.make){
			queryObj.make = req.query.make;
		}
		if(req.query.model){
			queryObj.model = req.query.model;
		}
		if(req.query.warranties){				
			queryObj['warranties.warranty_type'] = req.query.warranties;
		}
				
		var customervehiclesLimit = req.query.limit;
		var customervehiclesOffset = req.query.offset;
		if (customervehiclesLimit < 0 || customervehiclesLimit > globalLimit) {
			customervehiclesLimit = globalLimit;
		}			
		
		CustomervehiclesModel.find(queryObj, null, {
			limit : customervehiclesLimit,
			skip : customervehiclesOffset
		})
		.populate('customer')
		.populate('vehicle_type')
		.populate('warranties.warranty_type')
		.exec(function(err, customervehicles) {				
			if (!customervehicles) {
				sendRsp(res, 404, 'Not Found');
			}
			if (!err) {
				CustomervehiclesModel.count(queryObj, function(err, count) {
					var total = err ? 'N/A' : count;
					sendRsp(res, 200, 'ok', {
						total : total,
						customervehicles : customervehicles
					});
				});
			} else {
				log.error('Internal error(%d): %s', res.statusCode,
						err.message);
				sendRsp(res, 500, 'Server error');
			}
		});		
};



/**
 * select fields in display drop down
 */

exports.all = function(req, res) {

	var queryObj = {};
	if(req.user.role == "CUSTOMER"){
		queryObj.customer = req.user._id;
	}
	if(req.query.customer){
		queryObj.customer = req.query.customer;
	}
	CustomervehiclesModel.find(queryObj, '_id reg_no', null, function(err, customervehicles) {
		if (!customervehicles) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			sendRsp(res, 200, 'OK', {
				customervehicles : customervehicles
			});
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};


/**
 * Create a new customer vehicle
 */
 
exports.create = function(req, res, next) {
	req.checkBody('customer', 'Missing Params').notEmpty();
	req.checkBody('vehicle_type', 'Missing Params').notEmpty();
	req.checkBody('purchase_date', 'Missing Params').notEmpty();
	req.checkBody('reg_no', 'Missing Params').notEmpty();
	
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}
	
	var newCustomervehicles = new CustomervehiclesModel({
		customer 				: req.body.customer,
		vehicle_type			: req.body.vehicle_type,
		chassis_no				: req.body.chassis_no,
		engine_no				: req.body.engine_no,
		year 					: req.body.year,
		purchase_date 			: req.body.purchase_date,
		reg_no					: req.body.reg_no,
		insurance_expiry_date	: req.body.insurance_expiry_date,
		warranties				: req.body.warranties,
		make					: req.body.make,
		model 					: req.body.model
	});

	newCustomervehicles.save(function(err, customervehicle) {
		console.log("err", err);
		if (!err) {
			log.info("Customervehicles created");
			var opts = [{path: 'customer'}, {path: 'vehicle_type'}, {path: 'warranties.warranty_type'}]
  			CustomervehiclesModel.populate(customervehicle, opts, function(err, customervehicle){				
				if(!err){
					sendRsp(res, 201, 'Created', {customervehicle : customervehicle });
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
 * Get a single Customervehicles
 */

exports.show = function(req, res, next) {	
	var id = req.params.id;

	CustomervehiclesModel.findById(id)
	.populate("customer")
	.populate("vehicle_type")
	.populate("warranties.warranty_type")
	.exec(function (err, customervehicle) {
		if (!customervehicle) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			sendRsp(res, 200, 'OK', {
				customervehicle : customervehicle
			});
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});	
};
		
/**
 * Delete a single Customer
 */

exports.destroy = function(req, res) {	
	var customervehiclesId = req.params.id;
	CustomervehiclesModel.findById(customervehiclesId, function(err, customervehicles) {
		if (!customervehicles) {
			sendRsp(res, 404, 'Not Found');
		} else {
			customervehicles.remove(function(err) {
				if (!err) {
					log.info("CustomerVehicles removed");
					var opts = [{path: 'customer'}, {path: 'vehicle_type'}, {path: 'warranties.warranty_type'}]
					CustomervehiclesModel.populate(customervehicles, opts, function(err, customer){					
						if(!err){
							sendRsp(res, 200, 'Deleted',{customervehicle : customervehicles});
						}
					});
				} else {
					log.error('Internal error(%d): %s', res.statusCode,	err.message);
					sendRsp(res, 500, 'Server error');
				}
			});
		}
	});	
};


//  multiple delete CustomerVehicles

exports.deleteMultiple = function (req ,res) {
	UserModel.findById(req.user._id, function(err, customer) {
	var customervehiclesIds = req.body.ids;	
	
	CustomervehiclesModel.remove({_id: {$in : customervehiclesIds}}, function (err) {		
	    if (!err) {
	       	sendRsp(res, 200, 'CustomerVehicles Removed');
	    } else {
	        log.error('Internal error(%d): %s',res.statusCode, err.message);
	        sendRsp(res, 500, 'Server error');
	    	}
		});	
	});
};


/**
 * Update  CustomerVehicles
 */


exports.update = function(req, res, next) {
	req.checkBody('customer', 'Missing Params').notEmpty();
	req.checkBody('vehicle_type', 'Missing Params').notEmpty();
	req.checkBody('purchase_date', 'Missing Params').notEmpty();
	req.checkBody('reg_no', 'Missing Params').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}
	/*UserModel.findById(req.user._id, function(err, customer) {
		if(customer){*/
	var customervehiclesId = req.params.id;

	CustomervehiclesModel.findById(customervehiclesId, function(err, customervehicles) {
		if (!customervehicles) {
			sendRsp(res, 404, 'Not Found');
		}
		customervehicles.customer 				= req.body.customer;
		customervehicles.vehicle_type			= req.body.vehicle_type;
		customervehicles.chassis_no				= req.body.chassis_no;
		customervehicles.engine_no				= req.body.engine_no;
		customervehicles.year 					= req.body.year;
		customervehicles.purchase_date 			= req.body.purchase_date;
		customervehicles.reg_no					= req.body.reg_no;
		customervehicles.insurance_expiry_date	= req.body.insurance_expiry_date;
		customervehicles.warranties				= req.body.warranties;
		customervehicles.make					= req.body.make,
		customervehicles.model 					= req.body.model
		
		customervehicles.save(function(err) {
			console.log("err", err);
			if (!err) {
				log.info("CustomerVehicle updated");
				var opts = [{path: 'customer'}, {path: 'vehicle_type'}, {path: 'warranties.warranty_type'}]
				CustomervehiclesModel.populate(customervehicles, opts, function(err, customer){					
					if(!err){
						sendRsp(res, 200, 'Updated',{customervehicle : customervehicles});
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
/*}else{
		sendRsp(res, 404, 'Customer Not Found');
	}
});*/
};


/**
 * Authentication customerback
 */
exports.authCustomervehiclesback = function(req, res, next) {
	res.redirect('/');
};

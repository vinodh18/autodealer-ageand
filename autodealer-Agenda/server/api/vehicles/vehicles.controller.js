'use strict';

var VehiclesModel = require('./vehicles.model');
var passport = require('passport');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');
var globalLimit = config.globalRowsLimit;
var DealerModel 	= require('../dealer/dealer.model');
var mv		   	    = require('mv');


/**
 * Get list of Vehicles
 */

exports.index = function(req, res) { 
	
	var queryObj = {};
		req.query.dealer = req.user.dealer._id;

		if(req.query.dealer){
			queryObj.dealer = req.query.dealer;
		}
		if(req.query.model){
			queryObj.model = req.query.model;
		}
		if(req.query.make){
			queryObj.make = req.query.make;
		}
		console.log("queryObj", queryObj);
		var vehiclesLimit = req.query.limit;
		var vehiclesOffset = req.query.offset;
		if (vehiclesLimit < 0 || vehiclesLimit > globalLimit) {
			vehiclesLimit = globalLimit;
		}
		VehiclesModel.find(queryObj, null, {
			limit : vehiclesLimit,
			skip  : vehiclesOffset
		}).populate('dealer')
		.exec(function(err, vehicles) {
			if (!vehicles) {
				sendRsp(res, 404, 'Not Found');
			}
			if (!err) {
				VehiclesModel.count(queryObj, function(err, count) {
					var total = err ? 'N/A' : count;
					sendRsp(res, 200, 'ok', {
						total : total,
						vehicles : vehicles
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
/*
exports.all = function(req, res) {
	var queryObj = {};
	
	AdsmediaModel.find(queryObj, '_id title', null, function(err, adsmedia) {
		if (!adsmedia) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			sendRsp(res, 200, 'OK', {
				adsmedia : adsmedia
			});
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};
*/

/**
 * Create a new Vehicles
 */
 
exports.create = function(req, res, next) {
	req.checkBody('fuel_type', 'Missing Params').notEmpty();
	req.checkBody('make', 'Missing Params').notEmpty();
	req.checkBody('model', 'Missing Params').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}

	var newVehicles = new VehiclesModel({
		make				: req.body.make,
		model				: req.body.model,
		dealer 				: req.user.dealer,
		year				: req.body.year,
		on_road_price		: req.body.on_road_price,
		ex_showroom_price 	: req.body.ex_showroom_price,
		rto 				: req.body.rto,
		insurance 			: req.body.insurance,
		fuel_type 			: req.body.fuel_type,
		seat_capacity		: req.body.seat_capacity,
		image_url			: req.body.image_url
	});
	console.log("req.body", req.body);
	newVehicles.save(function(err, vehicles) {
		console.log("err", err);
		if (!err) {
			log.info("Vehicles created");
			var opts = [{path: 'dealer'}]
		    VehiclesModel.populate(vehicles, opts, function(err, vehicles){
		    	if(!err){
		        	sendRsp(res, 201, 'Created', {vehicle : vehicles });
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
 * Get a single vehicles
 */

exports.show = function(req, res, next) {
	var id = req.params.id;
	
	VehiclesModel.findById(id)
	.populate('dealer')		
	.exec(function (err, vehicles) {
		if (!vehicles) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			sendRsp(res, 200, 'OK', {vehicle : vehicles});			
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};
		
/**
 * Delete a single vehicles
 */

exports.destroy = function(req, res) {
	var vehiclesId = req.params.id;
	VehiclesModel.findById(vehiclesId, function(err, vehicles) {
		if (!vehicles) {
			sendRsp(res, 404, 'Not Found');
		} else {
			vehicles.remove(function(err) {
				if (!err) {
					log.info("Vehicles removed");
					var opts = [{path: 'dealer'}]
					VehiclesModel.populate(vehicles, opts, function(err, vehicles){					
					if(!err){
					sendRsp(res, 200, 'Deleted', {vehicle : vehicles});
						}
					});
				} else {
					log.error('Internal error(%d): %s', res.statusCode, err.message);
					sendRsp(res, 500, 'Server error');
				}
			});
		}
	});
};


//  multiple delete vehicles


exports.deleteMultiple = function (req ,res) {
	var vehiclesIds = req.body.ids;	
	
	VehiclesModel.remove({_id: {$in : vehiclesIds}}, function (err) {		
	    if (!err) {
	       	sendRsp(res, 200, 'Vehicles Removed');
	    } else {
	        log.error('Internal error(%d): %s',res.statusCode, err.message);
	        sendRsp(res, 500, 'Server error');
	    }
	});	
};


/**
 * Update  Offers
 */


exports.update = function(req, res, next) {
	req.checkBody('fuel_type', 'Missing Params').notEmpty();
	
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}
	var vehiclesId = req.params.id;
	console.log("vehiclesId", vehiclesId);
	VehiclesModel.findById(vehiclesId, function(err, vehicle) {
		if (!vehicle) {
			sendRsp(res, 404, 'Not Found');
		}
		
		vehicle.make				= req.body.make;
		vehicle.model				= req.body.model;
		vehicle.dealer 				= req.user.dealer;
		vehicle.on_road_price		= req.body.on_road_price;
		vehicle.ex_showroom_price 	= req.body.ex_showroom_price;
		vehicle.rto 				= req.body.rto;
		vehicle.insurance 			= req.body.insurance;
		vehicle.fuel_type 			= req.body.fuel_type;
		vehicle.seat_capacity		= req.body.seat_capacity;
		vehicle.year				= req.body.year;
		vehicle.image_url			= req.body.image_url;
		
		vehicle.save(function(err) {
			if (!err) {
				log.info("vehicles updated");
				var opts = [{path: 'dealer'}]
		        VehiclesModel.populate(vehicle, opts, function(err, vehicle){
		          if(!err){ 
		            sendRsp(res, 200, 'Updated',{vehicle : vehicle});
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


// Image Url Upload  For S3 Amazon

exports.imageURL = function(req, res){
	var id = req.params.id;
	VehiclesModel.findById(id, function(err, vehicle){
		if(!vehicle){
			sendRsp(res, 404, 'Not Found');
		}else{			
			vehicle.image_url = req.body.image_url
				
			vehicle.save(function(err) {
				if (!err) {
					log.info("vehicle updated");
					var opts = [{path: 'dealer'}]
					VehiclesModel.populate(vehicle, opts, function(err, vehicle){
						if(!err){
							sendRsp(res, 200, 'Updated', {vehicle : vehicle});
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
		}
	});
};

/**
 * Authentication vehicles back
 */
exports.authVehiclesback = function(req, res, next) {
	res.redirect('/');
};

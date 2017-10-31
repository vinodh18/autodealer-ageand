'use strict';

var VehicletypeModel = require('./vehicletype.model');
var passport = require('passport');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');
/*var ObjectId = require('mongoose').Types.ObjectId;*/
/*var async = require('async');*/
var globalLimit = config.globalRowsLimit;

/**
 * Get list of Vehicletypes
 */


exports.index = function(req, res) {
	
	var queryObj = {};
	
	if(req.query.name){    	
	  	var queryValue = req.query.name;
	   	var value = new RegExp("^" + queryValue,"i");
	 	queryObj.name = {$regex: value};
	}


	var vehicletypeLimit = req.query.limit;
	var vehicletypeOffset = req.query.offset;
	if (vehicletypeLimit < 0 || vehicletypeLimit > globalLimit) {
		vehicletypeLimit = globalLimit;
	}
			
	VehicletypeModel.find(queryObj, null, {
		limit : vehicletypeLimit,
		skip : vehicletypeOffset
	})
	.populate('dealer')
	.exec(function(err, vehicletypes) {
			if (!vehicletypes) {
				sendRsp(res, 404, 'Not Found');
			}
			if (!err) {
				VehicletypeModel.count(queryObj, function(err, count) {
					var total = err ? 'N/A' : count;
					sendRsp(res, 200, 'ok', {
						total : total,
						vehicletypes : vehicletypes
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
	queryObj.dealer = req.user.dealer._id;
	VehicletypeModel.find(queryObj, '_id name', null, function(err, vehicletypes) {
		if (!vehicletypes) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			sendRsp(res, 200, 'OK', {
				vehicletypes : vehicletypes
			});
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};


/**
 * Create a new Vehicletype
 */

 
exports.create = function(req, res, next) {
	req.checkBody('name', 'Missing Params').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}

	var newVehicletype = new VehicletypeModel({
		name  : req.body.name,
		dealer: req.user.dealer
	});
	
	newVehicletype.save(function(err, vehicletype) {
		if (!err) {
			log.info("Vehicletype created");
			var opts = [{path: 'dealer'}]
		    VehicletypeModel.populate(vehicletype, opts, function(err, vehicletype){
		    	if(!err){
		        	sendRsp(res, 201, 'Created', {vehicletype : vehicletype });
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
 * Get a single Vehicletype
 */


exports.show = function(req, res, next) {
	var id = req.params.id;
	VehicletypeModel.findById(id)
	.populate('dealer')
	.exec(function (err, vehicletype) {
		if (!vehicletype) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			sendRsp(res, 200, 'OK', {
				vehicletype : vehicletype
			});
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};
		
/**
 * Delete a single Vehicletype
 */
exports.destroy = function(req, res) {
	var vehicletypeId = req.params.id;
	VehicletypeModel.findById(vehicletypeId, function(err, vehicletype) {
		if (!vehicletype) {
			sendRsp(res, 404, 'Not Found');
		} else {
			vehicletype.remove(function(err) {
				if (!err) {
					log.info("Vehicletype removed");
					var opts = [{path: 'dealer'}]
					VehicletypeModel.populate(vehicletype, opts, function(err, vehicletype){					
					if(!err){
					sendRsp(res, 200, 'Deleted', {vehicletype : vehicletype});
						}
					});					
				} else {
					log.error('Internal error(%d): %s', res.statusCode,
							err.message);
					sendRsp(res, 500, 'Server error');
				}
			});
		}
	});
};


//  multiple delete multiple Vehicletypes

exports.deleteMultiple = function (req ,res) {
	var vehicletypeIds = req.body.ids;	
	
	VehicletypeModel.remove({_id: {$in : vehicletypeIds}}, function (err) {		
	    if (!err) {
	       	sendRsp(res, 200, 'Vehicletypes Removed');
	    } else {
	        log.error('Internal error(%d): %s',res.statusCode, err.message);
	        sendRsp(res, 500, 'Server error');
	    }
	});	
};


/**
 * Update  Vehicletype
 */

exports.update = function(req, res, next) {
	req.checkBody('name', 'Missing Params').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}
	var vehicletypeId = req.params.id;
	VehicletypeModel.findById(vehicletypeId, function(err, vehicletype) {
		if (!vehicletype) {
			sendRsp(res, 404, 'Not Found');
		}
		vehicletype.name 	= req.body.name;
		vehicletype.dealer  = req.user.dealer;
		vehicletype.save(function(err) {
			if (!err) {
				log.info("Vehicletype updated");
				var opts = [{path: 'dealer'}]
		        VehicletypeModel.populate(vehicletype, opts, function(err, vehicletype){
		          if(!err){ 
		            sendRsp(res, 200, 'Updated',{vehicletype : vehicletype});
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
 * Authentication vehicletypeback
 */
exports.authVehicletypeback = function(req, res, next) {
	res.redirect('/');
};

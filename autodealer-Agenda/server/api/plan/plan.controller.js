'use strict';

var PlanModel = require('./plan.model');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');

var globalLimit = config.globalRowsLimit;

exports.checkCustomerLimit = function(req, res, next){
	res.send(200);
};

exports.checkJobCardsLimit = function(req, res, next){
	res.send(200);
};

exports.create = function(req, res, next) {	
	req.checkBody('plan_code', 'Missing Param').notEmpty();
	req.checkBody('plan_name', 'Missing Param').notEmpty();
	req.checkBody('price', 'Missing Param').notEmpty();	
	req.checkBody('status', 'Missing Param').notEmpty();
	req.checkBody('trail_period', 'Missing Param').notEmpty();
	req.checkBody('trail_period_unit', 'Missing Param').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Query Param', util.inspect(errors));
		return;
	}

	PlanModel.create(req.body,  function(err, plan) {
		if (!err) {
			log.info("Plan created");
			sendRsp(res, 201, 'Created', {
				plan : plan
			});
		} else {
			console.log(err);
			if (err.name === 'ValidationError') {
				sendRsp(res, 400, 'Validation error');
			} else if(err.code === 11000) {
				res.statusCode = 409;
				err.message = "Duplicate entry";
			} else {
				handleError(res,err);
			}
			log.error('Internal error(%d): %s', res.statusCode, err.message);
		}
	});
}	

exports.show = function(req, res) {
	PlanModel.findById(req.params.id)
		.exec(function(err, plan) {
			if (err) {
				return handleError(res, err);
			}
			if (!plan) {
				return res.send(404);
			}
			console.log("single plan", plan);
			sendRsp(res, 200, 'OK', {plan: plan});
	});
}

/**
 * Deletes a plan restriction: 'admin'
 */
exports.destroy = function(req, res) {
	var planId = req.params.id;
	PlanModel.findById(planId, function(err, plan) {
		if (!plan) {
			sendRsp(res, 404, 'Not Found');
		} else {
			plan.remove(function(err) {
				if (!err) {
					log.info("plan removed");
					sendRsp(res, 200, 'Deleted', {
						plan : plan
					});
				} else {
					log.error('Internal error(%d): %s', res.statusCode,
							err.message);
					handleError(res,err);
				}
			});
		}
	});
};

exports.index = function(req, res) {

	var queryObj = {};
		
	if (req.query.plan_name) {					
		var queryValue = req.query.plan_name;				
	    var value = new RegExp("^" + queryValue,"i");			    
	    queryObj.plan_name = {$regex: value};				
	}
	var planLimit = req.query.limit;
	var planOffset = req.query.offset;
	var planSort = {
			'_id' : 1
		};
	if (planLimit < 0 || planLimit > globalLimit) {
		planLimit = globalLimit;
	}
	
	PlanModel.find(queryObj, null, {
		limit : planLimit,
		skip : planOffset,
		sort : planSort
	}).exec(
			function(err, plans) {
				if (!plans) {
					sendRsp(res, 404, 'Not Found');
				}
				if (!err) {

					PlanModel.count(queryObj, function(err, count) {
						var total = err ? 'N/A' : count;
						sendRsp(res, 200, 'OK', {
							total : total,
							plans : plans
						});
					});
					
				} else {
					log.error('Internal error(%d): %s', res.statusCode,
							err.message);
					handleError(res, err);
				}
			});
};
		
exports.deleteMultiple = function (req ,res) {

	var planIds = req.body.ids;	
	console.log("plan Ids :", planIds);	
	PlanModel.remove({_id: {$in : planIds}}, function (err) {		
	    if (!err) {
	       	sendRsp(res, 200, 'Plans Removed');
	    } else {
	        log.error('Internal error(%d): %s',res.statusCode,err.message);
	        handleError(res,err);
	    }
	});	
};	

exports.update = function(req, res, next) {
	req.checkBody('plan_code', 'Missing Param').notEmpty();
	req.checkBody('plan_name', 'Missing Param').notEmpty();
	req.checkBody('price', 'Missing Param').notEmpty();
	req.checkBody('status', 'Missing Param').notEmpty();
	req.checkBody('trail_period', 'Missing Param').notEmpty();
	req.checkBody('trail_period_unit', 'Missing Param').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Query Param', util.inspect(errors));
		return;
	}

	var planId = req.params.id;
	PlanModel.findById(planId, function(err, plan) {
		if (!plan) {
			sendRsp(res, 404, 'Not Found');
		}

		plan.plan_name	         = req.body.plan_name;
		plan.plan_code 	         = req.body.plan_code;
		plan.plan_description    = req.body.plan_description;
		plan.price	 	         = req.body.price;
		plan.currency	         = req.body.currency;
		plan.unlimited			 = req.body.unlimited;	 	
		plan.country	     	 = req.body.country;
		plan.is_paid			 = req.body.is_paid;
		plan.yearly_price		 = req.body.yearly_price;	
		plan.status	             = req.body.status;
		plan.trail_period	     = req.body.trail_period;
		plan.trail_period_unit	 = req.body.trail_period_unit;
		plan.plan_limits         = req.body.plan_limits;
		plan.feature             = req.body.feature;
		
		plan.save(function(err) {
			if (!err) {
				log.info("Plan Updated");
				sendRsp(res, 200, 'Updated', {
					plan : plan
				});
			} else {
				console.log("update error:", err)
				if (err.name === 'ValidationError') {
					sendRsp(res, 400, 'Validation error');
				} else {
					handleError(res, err);
				}
				log.error('Internal error(%d): %s', res.statusCode,
								err.message);
			}
		});
	});
};

function handleError(res, err) {
	return res.send(500, err);
}
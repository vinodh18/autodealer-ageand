'use strict';

var NewseventsModel = require('./newsevents.model');
var passport = require('passport');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');
var MiscChargeModel = require('../misccharge/misccharge.model');
/*var ObjectId = require('mongoose').Types.ObjectId;*/
/*var async = require('async');*/
var globalLimit = config.globalRowsLimit;

/**
 * Get list of News Events
 */


exports.index = function(req, res) {
	
	var queryObj = {};
	
	if (req.query.event_name) {
		var queryValue = req.query.event_name;
		var value = new RegExp("^" + queryValue, "i");
		 queryObj.event_name = {$regex: value};
		}
	
		console.log("queryObj", queryObj);
		var newseventsLimit = req.query.limit;
		var newseventsOffset = req.query.offset;
		if (newseventsLimit < 0 || newseventsLimit > globalLimit) {
			newseventsLimit = globalLimit;
		}
		NewseventsModel.find(queryObj, null, {
			limit : newseventsLimit,
			skip  : newseventsOffset
		}).populate('dealer').exec(function(err, newsevents) {
					if (!newsevents) {
						sendRsp(res, 404, 'Not Found');
					}
					if (!err) {
						NewseventsModel.count(queryObj, function(err, count) {
							var total = err ? 'N/A' : count;
							sendRsp(res, 200, 'ok', {
								total : total,
								newsevents : newsevents
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
 * Create a new AdsMedia
 */
 
exports.create = function(req, res, next) {
	req.checkBody('event_name', 'Missing Params').notEmpty();
	req.checkBody('branch', 'Missing Params').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}

	var newNewsevents = new NewseventsModel({
		event_name			: req.body.event_name,
		dealer 				: req.user.dealer,
		branch 				: req.body.branch,
		address				: req.body.address,
		from				: req.body.from,
		to					: req.body.to,
		description			: req.body.description,
		latitude			: req.body.latitude,
		longitude			: req.body.longitude,
		image_url 			: req.body.image_url,
		thumbnail_url 		: req.body.thumbnail_url
	});
	
	newNewsevents.save(function(err, newsevents) {
		if (!err) {
			log.info("Newsevents created");
			var opts = [{path: 'dealer'}]
		    NewseventsModel.populate(newsevents, opts, function(err, newsevents){
		        if(!err){
		          sendRsp(res, 201, 'Created', {newsevents : newsevents });
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
 * Get a single News Events
 */

exports.show = function(req, res, next) {
	var id = req.params.id;
	NewseventsModel.findById(id)
	.populate('dealer')
	.exec(function (err, newsevents) {
		if (!newsevents) {
			sendRsp(res, 404, 'Not Found');
		}
		if(!err) {
			sendRsp(res, 200, 'OK', {
				newsevents : newsevents
			});
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};
		
/**
 * Delete a single Ads Media
 */



exports.destroy = function(req, res) {
	var newseventsId = req.params.id;
	NewseventsModel.findById(newseventsId, function(err, newsevents) {
		if (!newsevents) {
			sendRsp(res, 404, 'Not Found');
		} else {
			newsevents.remove(function(err) {
				if (!err) {
					log.info("Newsevents removed");
					var opts = [{path: 'dealer'}];
			        NewseventsModel.populate(newsevents, opts, function(err, newsevents){
			            if(!err){
			              sendRsp(res, 200, 'Deleted', {newsevents : newsevents});
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


//  multiple delete News Events


exports.deleteMultiple = function (req ,res) {
	var newseventsIds = req.body.ids;	
	
	NewseventsModel.remove({_id: {$in : newseventsIds}}, function (err) {		
	    if (!err) {
	       	sendRsp(res, 200, 'Newsevents Removed');
	    } else {
	        log.error('Internal error(%d): %s',res.statusCode, err.message);
	        sendRsp(res, 500, 'Server error');
	    }
	});	
};


/**
 * Update  News Events
 */


exports.update = function(req, res, next) {
	req.checkBody('event_name', 'Missing Params').notEmpty();
	req.checkBody('branch', 'Missing Params').notEmpty();
	
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}
	var newseventsId = req.params.id;
	NewseventsModel.findById(newseventsId, function(err, newsevents) {
		if (!newsevents) {
			sendRsp(res, 404, 'Not Found');
		}
		newsevents.event_name			= req.body.event_name;
		newsevents.dealer				= req.user.dealer;
		newsevents.branch 				= req.body.branch;
		newsevents.address				= req.body.address;
		newsevents.from					= req.body.from;
		newsevents.to					= req.body.to;
		newsevents.description			= req.body.description;
		newsevents.latitude				= req.body.latitude;
		newsevents.longitude			= req.body.longitude;
		newsevents.image_url 			= req.body.image_url;
		newsevents.thumbnail_url 		= req.body.thumbnail_url;

		newsevents.save(function(err) {
			if (!err) {
				log.info("Newsevents updated");
				var opts = [{path: 'dealer'}]
		        MiscChargeModel.populate(newsevents, opts, function(err, newsevents){
		          if(!err){ 
		            sendRsp(res, 200, 'Updated',{newsevents : newsevents});
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


// S3Amozon Image Url save to database

exports.imageURL = function(req, res){
	var id = req.params.id;
	NewseventsModel.findById(id, function(err, newsevents){
		if(!newsevents){
			sendRsp(res, 404, 'Not Found');
		}else{
			newsevents.image_url 	  = req.body.image_url,
			newsevents.thumbnail_url  = req.body.thumbnail_url
			
			newsevents.save(function(err) {
				if (!err) {
					log.info("newsevents updated");				
					var opts = [{path: 'dealer'}]
			        MiscChargeModel.populate(newsevents, opts, function(err, newsevents){
			          if(!err){ 
			            sendRsp(res, 200, 'Updated',{newsevents : newsevents});
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
 * Authentication newsevents back
 */
exports.authNewseventsback = function(req, res, next) {
	res.redirect('/');
};

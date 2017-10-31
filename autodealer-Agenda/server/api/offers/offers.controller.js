'use strict';

var OffersModel = require('./offers.model');
var passport = require('passport');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');
/*var ObjectId = require('mongoose').Types.ObjectId;*/
/*var async = require('async');*/
var globalLimit = config.globalRowsLimit;
var mv		    = require('mv');
var deepPopulate    = require('mongoose-deep-populate');

/**
 * Get list of Offers
 */

exports.index = function(req, res) {
	
	var queryObj = {};
	
	if (req.query.name) {
		var queryValue = req.query.name;
		var value = new RegExp("^" + queryValue, "i");
		queryObj.name = {$regex: value};
	}
			
	var offersLimit = req.query.limit;
	var offersOffset = req.query.offset;
	if (offersLimit < 0 || offersLimit > globalLimit) {
		offersLimit = globalLimit;
	}
	
	OffersModel.find(queryObj, null, {
			limit : offersLimit,
			skip  : offersOffset
	})
	.populate('dealer')
	.exec(function(err, offers) {
		if (!offers) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			OffersModel.count(queryObj, function(err, count) {
				var total = err ? 'N/A' : count;
				sendRsp(res, 200, 'ok', {
					total : total,
					offers : offers
				});
			});
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};


/**
 * Create a new offers
 */
 
exports.create = function(req, res, next) {
	req.checkBody('name', 'Missing Params').notEmpty();
	req.checkBody('branch', 'Missing Params').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}

	var newOffers = new OffersModel({
		dealer 			:req.user.dealer,
		branch			: req.body.branch,
		name			: req.body.name,
		from			: req.body.from,
		to				: req.body.to,
		description		: req.body.description,
		image 			: req.body.image,
		image_url 		: req.body.image
	});
	
	newOffers.save(function(err, offers) {
		if (!err) {
			log.info("Offers created");
			var opts = [{path: 'dealer'}]
		    OffersModel.populate(offers, opts, function(err, offers){
		        if(!err){
		          sendRsp(res, 201, 'Created', {offers : offers });
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

	OffersModel.findById(id)
	.populate('dealer')
	.exec(function (err, offers) {
		if (!offers) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			sendRsp(res, 200, 'OK', { offers : offers });
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};
	

/**
 * Delete a single offers
 */
exports.destroy = function(req, res) {
	var offersId = req.params.id;
	OffersModel.findById(offersId, function(err, offers) {
		if (!offers) {
			sendRsp(res, 404, 'Not Found');
		} else {
			offers.remove(function(err) {
				if (!err) {
					log.info("Offers removed");
					var opts = [{path: 'dealer'}]
				    OffersModel.populate(offers, opts, function(err, offers){
				        if(!err){
				          sendRsp(res, 200, 'Deleted', {offers : offers });
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


//  multiple delete offers


exports.deleteMultiple = function (req ,res) {
	var offersIds = req.body.ids;	
	
	OffersModel.remove({_id: {$in : offersIds}}, function (err) {		
	    if (!err) {
	       	sendRsp(res, 200, 'Offers Removed');
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
	req.checkBody('name', 'Missing Params').notEmpty();
	req.checkBody('branch', 'Missing Params').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}
	var offersId = req.params.id;
	OffersModel.findById(offersId, function(err, offers) {
		if (!offers) {
			sendRsp(res, 404, 'Not Found');
		}
		offers.dealer 		= req.user.dealer;
		offers.branch 		= req.body.branch;
		offers.name			= req.body.name;
		offers.from			= req.body.from;
		offers.to			= req.body.to;
		offers.description	= req.body.description;
		offers.image 		= req.body.image;

		offers.save(function(err) {
			if (!err) {
				log.info("Offers updated");
				var opts = [{path: 'dealer'}]
			    OffersModel.populate(offers, opts, function(err, offers){
			        if(!err){
			          sendRsp(res, 200, 'Updated', {offers : offers });
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

// Image Upload For S3 Amazon

exports.imageURL = function(req, res){
	var id = req.params.id;
	OffersModel.findById(id, function(err, offer){
		if(!offer){
			sendRsp(res, 404, 'Not Found');
		}else{			  
			offer.image_url = req.body.image_url
			
			offer.save(function(err) {
				if (!err) {
					log.info("offer updated");
					var opts = [{path: 'dealer'}]
					OffersModel.populate(offer, opts, function(err, offer){
						if(!err){
							sendRsp(res, 200, 'Updated', {offer : offer});
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
 * Authentication offers back
 */
exports.authOffersback = function(req, res, next) {
	res.redirect('/');
};

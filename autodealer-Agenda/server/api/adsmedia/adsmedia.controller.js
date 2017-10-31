'use strict';

var AdsmediaModel = require('./adsmedia.model');
var passport = require('passport');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');
var globalLimit = config.globalRowsLimit;

/**
 * Get list of Ads Media
 */
exports.index = function(req, res) {
	
	var queryObj = {};
	
	if (req.query.title) {
		var queryValue = req.query.title;
		var value = new RegExp("^" + queryValue, "i");
	 	queryObj.title = {$regex: value};
	}
	if (req.query.type){
		queryObj.type = req.query.type;
	}

	var adsmediaLimit = req.query.limit ? req.query.limit : globalLimit;
	var adsmediaOffset = req.query.offset ? req.query.offset : 0;
	if (adsmediaLimit < 0 || adsmediaLimit > globalLimit) {
		adsmediaLimit = globalLimit;
	}
	AdsmediaModel.find(queryObj, null, {
		limit : adsmediaLimit,
		skip : adsmediaOffset
	}).populate('dealer').exec(function(err, adsmedia) {
		if (!adsmedia) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			AdsmediaModel.count(queryObj, function(err, count) {
				var total = err ? 'N/A' : count;
				sendRsp(res, 200, 'ok', {
					total : total,
					adsmedia : adsmedia
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
 * Create a new AdsMedia
 */
 
exports.create = function(req, res, next) {
	req.checkBody('title', 'Missing Params').notEmpty();
	req.checkBody('type', 'Missing Params').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}

	var newAdsmedia = new AdsmediaModel({
		title				: req.body.title,
		description			: req.body.description,
		youtube_id			: req.body.youtube_id,
		type				: req.body.type,
		dealer 				: req.user.dealer._id,
		image_url 			: req.body.image_url,
		thumbnail_url 		: req.body.thumbnail_url
	});
	
	newAdsmedia.save(function(err, adsmedia) {
		if (!err) {
			log.info("Adsmedia created");
			var opts = [{path: 'dealer'}]
		    AdsmediaModel.populate(adsmedia, opts, function(err, adsmedia){
		      if(!err){
		        sendRsp(res, 201, 'Created', {adsmedia :  adsmedia});
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
 * Get a single Ads Media
 */

exports.show = function(req, res, next) {
	var id = req.params.id;
	AdsmediaModel.findById(id)
	.populate('dealer')
	.exec(function (err, adsmedia) {
		if (!adsmedia) {
			sendRsp(res, 404, 'Not Found');
			return;
		}
		if (!err) {
			sendRsp(res, 200, 'OK', {
				adsmedia : adsmedia
			});
		} else {
			log.error('Internal error(%d): %s', res.statusCode,	err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};

/**
 * Update  Dealer
 */

exports.update = function(req, res, next) {
	req.checkBody('title', 'Missing Params').notEmpty();
	req.checkBody('type', 'Missing Params').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}
	var adsmediaId = req.params.id;
	AdsmediaModel.findById(adsmediaId, function(err, adsmedia) {
		if (!adsmedia) {
			sendRsp(res, 404, 'Not Found');
		}
		adsmedia.title				= req.body.title;
		adsmedia.description		= req.body.description;
		adsmedia.youtube_id			= req.body.youtube_id;
		adsmedia.type				= req.body.type;
		adsmedia.dealer 			= req.user.dealer._id;
		adsmedia.image_url 			= req.body.image_url;
		adsmedia.thumbnail_url 		= req.body.thumbnail_url;
		adsmedia.save(function(err) {
			if (!err) {
				log.info("Adsmedia updated");
				var opts = [{path: 'dealer'}]
			    AdsmediaModel.populate(adsmedia, opts, function(err, adsmedia){
			      if(!err){
			        sendRsp(res, 200, 'Updated', {adsmedia :  adsmedia});
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
 * Delete a single Ads Media
 */
exports.destroy = function(req, res) {
	var adsmediaId = req.params.id;
	AdsmediaModel.findById(adsmediaId, function(err, adsmedia) {
		if (!adsmedia) {
			sendRsp(res, 404, 'Not Found');
		} else {
			adsmedia.remove(function(err) {
				if (!err) {
					log.info("Adsmedia removed");
					var opts = [{path: 'dealer'}]
				    AdsmediaModel.populate(adsmedia, opts, function(err, adsmedia){
				      if(!err){
				        sendRsp(res, 200, 'Deleted', {adsmedia :  adsmedia});
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


//  multiple delete Ads Media
exports.deleteMultiple = function (req ,res) {
	var adsmediaIds = req.body.ids;	
	
	AdsmediaModel.remove({_id: {$in : adsmediaIds}}, function (err) {		
	    if (!err) {
	       	sendRsp(res, 200, 'Adsmedia Removed');
	    } else {
	        log.error('Internal error(%d): %s',res.statusCode, err.message);
	        sendRsp(res, 500, 'Server error');
	    }
	});	
};

// Update S3Amazon Image Url to AdsMedia
exports.imageURL = function(req, res){
	var id = req.params.id;
	AdsmediaModel.findById(id, function(err, adsmedia){
		if(!adsmedia){
			sendRsp(res, 404, 'Not Found');
		}else{
			adsmedia.image_url 		= req.body.image_url,
			adsmedia.thumbnail_url  = req.body.thumbnail_url
			
			adsmedia.save(function(err) {
				if (!err) {
					log.info("adsmedia image-url updated");
					var opts = [{path: 'dealer'}]
				    AdsmediaModel.populate(adsmedia, opts, function(err, adsmedia){
				      if(!err){
				        sendRsp(res, 200, 'Image url updated', {adsmedia :  adsmedia});
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
 * Authentication Ads Media back
 */
exports.authAdsmediaback = function(req, res, next) {
	res.redirect('/');
};

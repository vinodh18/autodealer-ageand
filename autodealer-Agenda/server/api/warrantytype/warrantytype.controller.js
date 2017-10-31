'use strict';
var WarrantytypeModel 		  = require('./warrantytype.model');
var passport 			  = require('passport');
var config 				  = require('../../config/environment');
var sendRsp 			  = require('../utils').sendRsp;
var log 				  = require('../libs/log')(module);
var util 				  = require('util');
/*var ObjectId 			  = require('mongoose').Types.ObjectId;*/
/*var async 			  = require('async');*/
var globalLimit 		  = config.globalRowsLimit;

/**
 * Get list of Warrantytype
 */



exports.index = function(req, res) {
	
	var queryObj = {};
	
	if(req.query.name){    	
    	var queryValue = req.query.name;
    	var value = new RegExp("^" + queryValue,"i");
	 	queryObj.name = {$regex: value};
	}

	var warrantytypeLimit = req.query.limit;
	var warrantytypeOffset = req.query.offset;
	if (warrantytypeLimit < 0 || warrantytypeLimit > globalLimit) {
		warrantytypeLimit = globalLimit;
	}
	WarrantytypeModel.find(queryObj, null, {
		limit : warrantytypeLimit,
		skip : warrantytypeOffset
	})
	.populate('dealer')
	.exec(function(err, warrantytypes) {
		if (!warrantytypes) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			WarrantytypeModel.count(queryObj, function(err, count) {
				var total = err ? 'N/A' : count;
				sendRsp(res, 200, 'ok', {
					total : total,
					warrantytypes : warrantytypes
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
	
	WarrantytypeModel.find(queryObj, '_id name', null, function(err, warrantytypes) {
		if (!warrantytypes) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			sendRsp(res, 200, 'OK', {
				warrantytypes : warrantytypes
			}); 
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};


/**
 * Create a new Warrantytype
 */

exports.create = function(req, res, next) {	
	req.checkBody('name', 'Missing Params').notEmpty();
	if(!req.body.period){
		sendRsp(res, 400, 'Missing Param Period Object');
		return;
	}else if(!req.body.period.n){
		sendRsp(res, 400, 'Missing Param n in Period ');
		return;	
	}else if(!req.body.period.unit){
		sendRsp(res, 400, 'Missing Param unit in Period ');
		return;		
	}
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}

	var newWarrantytype = new WarrantytypeModel({
		name			: req.body.name,
		desc			: req.body.desc,
		period			: req.body.period,
		dealer 			: req.user.dealer
	});
	
	newWarrantytype.save(function(err, Warrantytype) {		
		if (!err) {
			log.info("Warrantytype created");
			var opts = [{path: 'dealer'}]
		    WarrantytypeModel.populate(Warrantytype, opts, function(err, Warrantytype){
		    	if(!err){
		        	sendRsp(res, 201, 'Created', {warrantytype : Warrantytype });
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
 * Get a single Warrantytype
 */


exports.show = function(req, res, next) {
	var id = req.params.id;
	WarrantytypeModel.findById(id)
	.populate('dealer')
	.exec(function (err, warrantytype) {
		if (!warrantytype) {
			sendRsp(res, 404, 'Not Found');
			return;
		}
		if (!err) {
			sendRsp(res, 200, 'OK', { warrantytype : warrantytype });
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};
		
/**
 * Delete a single warrantytype
 */
exports.destroy = function(req, res) {
	var warrantytypeId = req.params.id;
	WarrantytypeModel.findById(warrantytypeId, function(err, warrantytype) {
		if (!warrantytype) {
			sendRsp(res, 404, 'Not Found');
			return;
		} else {
			warrantytype.remove(function(err) {
				if (!err) {
					log.info("Warrantytype removed");
					var opts = [{path: 'dealer'}]
					WarrantytypeModel.populate(warrantytype, opts, function(err, warrantytype){					
						if(!err){
							sendRsp(res, 200, 'Deleted', {warrantytype : warrantytype});
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


//  multiple delete Warrantytype


exports.deleteMultiple = function (req ,res) {
	var warrantytypeIds = req.body.ids;	
	
	WarrantytypeModel.remove({_id: {$in : warrantytypeIds}}, function (err) {		
	    if (!err) {
	       	sendRsp(res, 200, 'WarrantyTypes Removed');
	    } else {
	        log.error('Internal error(%d): %s',res.statusCode, err.message);
	        sendRsp(res, 500, 'Server error');
	    }
	});	
};


/**
 * Update  Warrantytype
 */


exports.update = function(req, res, next) {
	req.checkBody('name', 'Missing Params').notEmpty();
	
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}
	var warrantytypeId = req.params.id;
		WarrantytypeModel.findById(warrantytypeId, function(err, warrantytype) {
		if (!warrantytype) {
			sendRsp(res, 404, 'Not Found');
		}
		warrantytype.name		= req.body.name;
		warrantytype.desc		= req.body.desc;
		warrantytype.period		= req.body.period;
		warrantytype.dealer 	= req.user.dealer;
		warrantytype.save(function(err) {
			if (!err) {
				log.info("Warrantytype updated");
				var opts = [{path: 'dealer'}]
		        WarrantytypeModel.populate(warrantytype, opts, function(err, warrantytype){
		          if(!err){ 
		            sendRsp(res, 200, 'Updated',{warrantytype : warrantytype});
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
 * Authentication warrantytype back
 */
exports.authWarrantytypeback = function(req, res, next) {
	res.redirect('/');
};

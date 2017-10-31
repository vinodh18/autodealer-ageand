'use strict';

var DealerModel = require('./dealer.model');
var passport = require('passport');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');
var ObjectId = require('mongoose').Types.ObjectId;
var globalLimit = config.globalRowsLimit;
var mv = require('mv');

/**
 * Get list of Dealers
 */

exports.index = function(req, res) {
	
			var queryObj = {};
			
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
			
			var dealerLimit = req.query.limit;
			var dealerOffset = req.query.offset;
			if (dealerLimit < 0 || dealerLimit > globalLimit) {
				dealerLimit = globalLimit;
			}
			
			DealerModel.find(queryObj, null, {
				limit : dealerLimit,
				skip : dealerOffset
			}).populate('plan').exec(function(err, dealers) {
						if (!dealers) {
							sendRsp(res, 404, 'Not Found');
						}
						if (!err) {
							DealerModel.count(queryObj, function(err, count) {
								var total = err ? 'N/A' : count;
								sendRsp(res, 200, 'ok', {
									total : total,
									dealers : dealers
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
 * Create a new Dealer
 */

exports.create = function(req, res, next) {
	req.checkBody('name', 'Missing Params').notEmpty();
	req.checkBody('phone', 'Missing Params').notEmpty();	
	req.checkBody('plan', 'Missing Params').notEmpty();	
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}

	var newDealer = new DealerModel({
		name 			: req.body.name,
		email			: req.body.email,
		phone			: req.body.phone,
		website			: req.body.website,
		logo			: req.body.logo,
		plan			: req.body.plan,		
		unique_feature	: req.body.unique_feature,
		branches 		: req.body.branches,
		currency		: req.body.currency,
		timezone		: req.body.timezone,
		makes			: req.body.makes,
		taxes			: req.body.taxes,
		parts_tax 		: req.body.parts_tax,
		labour_tax 		: req.body.labour_tax,
		accessories_tax : req.body.accessories_tax,	
		image_url 		: req.body.image_url
	});
	
	newDealer.save(function(err, dealer) {		
		if (!err) {
			log.info("dealer created");
			var opts = [{path: 'plan'}]
		    DealerModel.populate(dealer, opts, function(err, dealer){
		      if(!err){
		        sendRsp(res, 201, 'Created', {dealer :  dealer});
		      }
		    });					
		} else {
			if(err.name === 'ValidationError') {
				sendRsp(res, 400, 'Validation error');
			} else {
				sendRsp(res, 500, 'Server error');
			}
			log.error('Internal error(%d): %s', res.statusCode, err.message);
		}
	});
};

/**
 * Get a single Dealer
 */

exports.show = function(req, res, next) {
	var id = req.params.id;
	DealerModel.findById(id)
	.populate('plan')
	.exec(function (err, dealer) {		
		if (!dealer) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			sendRsp(res, 200, 'OK', { dealer : dealer });
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};
		
/**
 * Delete a single Dealer
 */

exports.destroy = function(req, res) {
	
	var dealerId = req.params.id;
	DealerModel.findById(dealerId, function(err, dealer) {
		if (!dealer) {
			sendRsp(res, 404, 'Not Found');
		} else {
			dealer.remove(function(err) {
				if (!err) {
					log.info("dealer removed");
					var opts = [{path: 'plan'}];
					DealerModel.populate(user, opts, function(err, user){
					if(!err){
					sendRsp(res, 200, 'Deleted', {dealer : dealer});
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


//  multiple delete multiple dealer

exports.deleteMultiple = function (req ,res) {
	var dealerIds = req.body.ids;	
	
	DealerModel.remove({_id: {$in : dealerIds}}, function (err) {		
	    if (!err) {
	       	sendRsp(res, 200, 'Dealers Removed');
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
	req.checkBody('plan', 'Missing Params').notEmpty();	
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}
	var dealerId = req.params.id;
	
	DealerModel.findById(dealerId, function(err, dealer) {
		if (!dealer) {
			sendRsp(res, 404, 'Not Found');
		}
		dealer.name 			= req.body.name;
		dealer.email			= req.body.email;
		dealer.phone			= req.body.phone;
		dealer.website			= req.body.website;
		dealer.logo				= req.body.logo;
		dealer.plan				= req.body.plan;		
		dealer.unique_feature	= req.body.unique_feature;
		dealer.branches 		= req.body.branches;
		dealer.currency			= req.body.currency;
		dealer.timezone			= req.body.timezone;
		dealer.makes			= req.body.makes;
		dealer.taxes			= req.body.taxes;
		dealer.parts_tax 		= req.body.parts_tax;
		dealer.labour_tax 		= req.body.labour_tax;
		dealer.accessories_tax  = req.body.accessories_tax;
		dealer.image_url 		= req.body.image_url;
		
		dealer.save(function(err) {
			console.log("err..", err);
			if (!err) {
				log.info("dealer updated");				
				var opts = [{path: 'plan'}]
				DealerModel.populate(dealer, opts, function(err, dealer){
					if(!err){
						sendRsp(res, 200, 'Updated', {dealer : dealer});
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


exports.imageURL = function(req, res){
	var id = req.params.id;
	DealerModel.findById(id, function(err, dealer){
		if(!dealer){
			sendRsp(res, 404, 'Not Found');
		}else{
			  dealer.image_url = req.body.image_url
				
				dealer.save(function(err) {
			if (!err) {
				log.info("dealer updated");
				var opts = [{path: 'plan'}]
					DealerModel.populate(dealer, opts, function(err, dealer){
					if(!err){
				sendRsp(res, 200, 'Updated', {dealer : dealer});
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

// add New Branch in Dealer 
exports.addBranch = function(req, res){
  	console.log("branch", req.body.branch);
  	if (!req.body.branch.branch_code) {
		sendRsp(res, 400, 'Missing Param branch_code');
		return;
	}else if(!req.body.branch.name){
		sendRsp(res, 400, 'Missing Param name');
		return;
	}else if(!req.body.branch.phone){
		sendRsp(res, 400, 'Missing Param phone');
		return;
	}
  	var dealerId = req.params.id;
  
    DealerModel.findById(dealerId, function(err, dealer) {
      if(err){
        sendRsp(res, 404, 'Not Found');
        return;
      }
      if(dealer){
     	var branch = req.body.branch;
  		dealer.branches.push(branch);
  		dealer.save(function (err) {
  			if(err){
	  			if(err.code === 11000) {
					return sendRsp(res, 409, 'Duplicate entry');				
				} else if (err.name === 'ValidationError') {
					sendRsp(res, 400, 'Validation error');
				} else {
					return sendRsp(res, 500, 'Server error');
				}
				log.error('Internal error(%d): %s', err.code, err.message);
				return sendRsp(res, res.statusCode, err.message);
			}
      		if(!err) {
        		log.info("Branch updated in dealer");
        		sendRsp(res, 200, 'Updated', {dealer: dealer}); 
        	}
       	});
      }
    });
};

// add New Make in Dealer
exports.addMake = function(req, res){
  	console.log("make", req.body.make);
  	var dealerId = req.params.id;
  
    DealerModel.findById(dealerId, function(err, dealer) {
      if(err){
        sendRsp(res, 404, 'Not Found');
        return;
      }
      if(dealer){
     	var make = req.body.make;
  		dealer.makes.push(make);
  		dealer.save(function (err) {
      		if(!err) {
        		log.info("Make updated in dealer");
        		sendRsp(res, 200, 'Updated', {dealer: dealer}); 
        	}
       	});
      }
    });
};

// add New Model into makes arrayOfObject in Dealer
exports.addModel = function(req, res){  	
  	var dealerId = req.params.id;
  	var makeId = req.params.makeId;
  	var model = req.body.model;
  	DealerModel.findOne({'_id': dealerId, makes: {$elemMatch: {"_id": makeId}}}, function(err, dealer) {
      	if(err){
        	sendRsp(res, 404, 'Not Found');
        	return;
      	}
      	if(dealer){
		    DealerModel.update({ '_id': dealerId, makes: { $elemMatch: { "_id": makeId } } 
			},{
	    		$push:{ "makes.$.models": model }
	    	}, function(err, dealer) {
		      if(err){
		        sendRsp(res, 404, 'Not Found');
		        return;
		      }
		      if(dealer){      			     	
		        log.info("Model updated in dealer");
		        sendRsp(res, 200, 'Updated', {dealer: dealer}); 		        	
		      }
		    });
		}
	});	
};

// remove branch from branches arrayOfObject 
exports.removeBranch = function(req, res){
  var dealerId = req.params.id;
  DealerModel.findById(dealerId, function(err, dealer){
    if(err){
      sendRsp(res, 404, 'Not Found');
      return;
    }
    if(dealer){      
      	var branchId = req.params.branchId;             
	    DealerModel.update({'_id': dealerId},{$pull:{branches:{"_id":branchId}}}, function(err, dealer){
	      if(!dealer){	      	
	        sendRsp(res, 404, 'Not Found'); 
	        return;           
	      }
	      if(dealer){
	        sendRsp(res, 200, 'Branch Removed', {dealer: dealer});	        
	      }
	    });      
  }else{
    sendRsp(res, 500, 'server error');
  }
  });
};


// remove make from makes arrayOfObject 
exports.removeMake = function(req, res){
  var dealerId = req.params.id;
  DealerModel.findById(dealerId, function(err, dealer){
    if(err){
      sendRsp(res, 404, 'Not Found');
      return;
    }
    if(dealer){      
      	var makeId = req.params.makeId;             
	    DealerModel.update({'_id': dealerId},{$pull:{makes:{"_id":makeId}}}, function(err, dealer){
	      if(!dealer){	      	
	        sendRsp(res, 404, 'Not Found'); 
	        return;           
	      }
	      if(dealer){
	        sendRsp(res, 200, 'Make Removed', {dealer: dealer});	        
	      }
	    });      
  	}else{
    	sendRsp(res, 500, 'server error');
  	}
  });
};


// remove model from models arrayOfObject in make
exports.removeModel = function(req, res){
  var dealerId = req.params.id;
  var makeId = req.params.makeId;  

  DealerModel.findOne({'_id': dealerId, makes: {$elemMatch: {"_id": makeId}}}, function(err, dealer){
    if(err){
      sendRsp(res, 404, 'Not Found');
      return;
    }
    if(dealer){      
      	var modelId = req.params.modelId;             
	    DealerModel.update({ 
	    	'_id': dealerId, makes: { $elemMatch: { "_id": makeId } } 
		},{
	    	$pull:{ "makes.$.models": { "_id" : modelId } }
	    }, function(err, dealer){
	      if(!dealer){	      	
	        sendRsp(res, 404, 'Not Found'); 
	        return;           
	      }
	      if(dealer){
	        sendRsp(res, 200, 'Model Removed', {dealer: dealer});	        
	      }
	    });      
  	}else{
    	sendRsp(res, 500, 'server error');
  	}
  });
};


// get list of branches from dealer
exports.allBranches = function(req, res){	
	var branches = req.user.dealer.branches;
	var allBranches = [];	

	for(var i=0; i < branches.length; i++){
		allBranches.push({
			'_id': branches[i]._id,
			'branch_code': branches[i].branch_code,
			'name': branches[i].name
		});		
	}	
	sendRsp(res, 200, 'Success', {allBranches: allBranches});
};

// get list of makes from dealer
exports.allMakes = function(req, res){	
	var makes = req.user.dealer.makes;
	var allMakes = [];	

	for(var i=0; i < makes.length; i++){
		allMakes.push({'_id': makes[i]._id,'name': makes[i].name});		
	}	
	sendRsp(res, 200, 'Success', {allMakes: allMakes});
		
};

/* 
	* Get list of models from dealer
	* Get list of models from a single make by passing make ObjectId as query params
*/
exports.allModels = function(req, res){
	var makes = req.user.dealer.makes;
	var allModels = [];

	if(req.query.make){
		var makeId = new ObjectId(req.query.make);		
		var models;
		for(var i = 0; i < makes.length; i++ ){			
			if(makes[i]._id.equals(makeId)){				
				models = makes[i].models
				for(var j = 0; j < models.length; j++ ){
					allModels.push({'_id': models[j]._id,'name': models[j].name});			
				}
			}
		}
		sendRsp(res, 200, 'Success', {allModels: allModels});
		return;
	}		

	for(var i = 0; i < makes.length; i++ ){
		var models = makes[i].models;
		for(var j = 0; j < models.length; j++ ){
			allModels.push({'_id': models[j]._id,'name': models[j].name});			
		}
	}	
	sendRsp(res, 200, 'Success', {allModels: allModels});	
};

// get single branch from dealer
exports.getBranch = function(req, res){	
	var dealerId = req.params.id;
	var branchId = req.params.branchId;
	var branchCode = req.query.branch_code;
	
	DealerModel.findOne({'_id': dealerId }, function(err, dealer){
		if(err){
			sendRsp(res, 404, 'Not Found');
      		return;
		}
		if(dealer){
			DealerModel.aggregate( [
				{ $unwind: "$branches" },
				{ 
					$match: { 					
		       			'branches._id' : new ObjectId(branchId)
		     		} 
		   		}
			],function(err, dealer){
				if(err){
			    	sendRsp(res, 500, 'server error');
			  	}
				if(dealer){					
					if(dealer.length > 0){
						sendRsp(res, 200, 'Success', {branch: dealer[0].branches});						
					}else{
						sendRsp(res, 404, 'Branch Not Found');						
					}	
				}				
			});
		}
	});	
};

// get single make from dealer
exports.getMake = function(req, res){	
	var dealerId = req.params.id;
	var makeId = req.params.makeId;
	
	DealerModel.findOne({'_id': dealerId }, function(err, dealer){
		if(err){
			sendRsp(res, 404, 'Not Found');
      		return;
		}
		if(dealer){
			DealerModel.aggregate( [
				{ $unwind: "$makes" },
				{ 
					$match: { 					
		       			'makes._id' : new ObjectId(makeId)
		     		} 
		   		}
			],function(err, dealer){
				if(err){
			    	sendRsp(res, 500, 'server error');
			  	}
				if(dealer){					
					if(dealer.length > 0){
						sendRsp(res, 200, 'Success', {make: dealer[0].makes});						
					}else{
						sendRsp(res, 404, 'Make Not Found');						
					}	
				}				
			});
		}
	});		
};

// get single model from makes in dealer
exports.getModel = function(req, res){	
	var dealerId = req.params.id;
	var makeId = new ObjectId(req.params.makeId);
	var modelId = new ObjectId(req.params.modelId);
	
	DealerModel.findOne({'_id': dealerId }, function(err, dealer){
		if(err){
			sendRsp(res, 404, 'Dealer Not Found');
      		return;
		}
		if(dealer){
			DealerModel.aggregate( [
				{ $unwind: "$makes" },
   				{ $unwind: "$makes.models" },
				{ 
					$match: { 					
		       			'makes._id' : makeId,
       					'makes.models._id' : modelId
		     		} 
		   		}
			],function(err, dealer){							
				if(err){
			    	sendRsp(res, 500, 'server error');
			  	}
				if(dealer){					
					if(dealer.length > 0){
						sendRsp(res, 200, 'Success', {model: dealer[0].makes.models});
					}else{
						sendRsp(res, 404, 'Model Not Found');
					}	
				}

			});
		}
	});
};


// update Branch
exports.updateBranch = function(req, res, next) {
	var dealerId = req.params.id;	
	DealerModel.findById(dealerId, function(err, dealerObj){
	    if(err){
	      sendRsp(res, 404, 'Not Found');
	      return;
	    }
	    if(dealerObj){      
	      	var branchId = req.params.branchId;             
		    DealerModel.update({'_id': dealerId},{$pull:{branches:{"_id":branchId}}}, function(err, dealer){
		      if(!dealer){	      	
		        sendRsp(res, 404, 'Not Found'); 
		        return;           
		      }
		      if(dealer){
		      	var branch = req.body.branch;
		  		dealerObj.branches.push(branch);
		  		dealerObj.save(function (err) {
		      		if(!err) {
		        		log.info("Branch updated in dealer");
		        		sendRsp(res, 200, 'Updated', {dealerObj: dealerObj}); 
		        	}
		       	});		        
		      }
		    });      
	  	}else{
	    	sendRsp(res, 500, 'server error');
	  	}
	});
};

//
/**
 * Authentication dealerback
 */
exports.authDealerback = function(req, res, next) {
	res.redirect('/');
};

'use strict';

var UserModel 	= require('./user.model');
var passport 	= require('passport');
var config 		= require('../../config/environment');
var sendRsp   	= require('../utils').sendRsp;
var log         = require('../libs/log')(module);
var util		= require('util');
var globalLimit = config.globalRowsLimit; 
var fs 		    = require('fs');
var jwt 		= require('jsonwebtoken');
var request 	= require('request');
var _ 			= require('lodash');
var crypto		= require('../../auth/encrypt-decrypt');
var expressJwt 	= require('express-jwt');
var validateJwt	= expressJwt({ secret: config.secrets.accessToken });


exports.create = function (req, res, next) {	
    
    req.checkBody('name', 'Missing Query Param').notEmpty();	
    req.checkBody('username', 'Missing Query Param').notEmpty();	
	req.checkBody('email', 'Missing Query Param').notEmpty();	
	req.checkBody('password', 'Missing Query Param').notEmpty();	
	req.checkBody('role', 'Missing Query Param').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Query Param', util.inspect(errors));
		return;
	}

	var newUser = new UserModel({
        dealer	: req.user.dealer._id,
        name  	: req.body.name,
        username: req.body.username,
        password: req.body.password,		
		email 	: req.body.email,	
		role 	: req.body.role,
		branch	: req.body.branch,
		base  	: req.body.base ? req.body.base : 'N' 
	});

	newUser.save(function (err, user) {
		if (err) {			
			res.statusCode = 500;
			if(err.code === 11000) {
				res.statusCode = 409;
				err.message = "Duplicate entry";
			} else if (err.name === 'ValidationError') {
				sendRsp(res, 400, 'Validation error');
			} else if (err.name === 'EmpNotFound') {
				sendRsp(res, 404, 'Employee Not Found');
			} else if (err.name === 'ServiceProviderNotFound') {
				sendRsp(res, 404, 'Service Provider Not Found');
			} else {
				sendRsp(res, 500, 'Server error');
			}
			log.error('Internal error(%d): %s', err.code,
					err.message);
			return sendRsp(res, res.statusCode, err.message);
		}
		if(!user)
			return sendRsp(res, 404, "User not found!");
		
		user = user.toObject();
		delete user.hashed_password;
		delete user.salt;
		
		return sendRsp(res, 201, 'Created', {
			user: user
		});
	});		
};

// user delete in auth module 

exports.destroy = function(req, res) {	
	var userId = req.params.id;
	UserModel.findById(userId, function (err, user) {
        if(!user || user.role == 'CUSTOMER') {
        	sendRsp(res, 404, 'Not Found');
        	return;
        }else{        				
			user.remove(function (err,user) {
                if (!err) {
                    log.info("user removed");
                    var opts = [{path: 'dealer'}]
					UserModel.populate(user, opts, function(err, user){
						if(!err){	
							sendRsp(res, 200, 'Deleted', {user: user});
						}
					});                   
                } else {
                    log.error('Internal error(%d): %s',res.statusCode,err.message);
                    sendRsp(res, 500, 'Server error');
                }
        	});
		} 
	});	
};

// change password

exports.changePassword = function(req, res, next){
	
	var userId = req.params.id;

	req.checkBody('old_password', 'Missing Query Param').notEmpty();
	req.checkBody('new_password', 'Missing Query Param').notEmpty();
	req.checkBody('confirm_password', 'Missing Query Param').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Query Param', util.inspect(errors));
		return;
	}

	UserModel.findById(userId, function (err, user) {
		console.log("user", user);
        if(!user) {
        	sendRsp(res, 404, 'Not Found');
        }else{

        	if(req.body.new_password !== req.body.confirm_password) {
				return sendRsp(res, 400, 'Validation Error: Confirm Password mismatch');
			}
			var user = req.user;
			console.log("req user:", req.user);
			if(!user.authenticate(req.body.old_password)) {
				return sendRsp(res, 400, 'Invalid Password');
			}
			var hashedPassword = user.encryptPassword(req.body.new_password);
			UserModel.findOneAndUpdate({'username' : user.username}, {'hashed_password': hashedPassword}, function(err, user) {
				if (err) {
					log.error('Internal error(%d): %s', res.statusCode, err.message);
					return sendRsp(res, 500, 'Server error');
				}
			    return sendRsp(res, 200, 'Success', 'password changed successfully');
			});        	
        }
    });    
};

// change name

exports.changeName = function(req, res, next){	
	var userId = req.params.id;
	req.checkBody('name', 'Missing Query Param').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Query Param', util.inspect(errors));
		return;
	}

	UserModel.findById(userId, function (err, user) {
        if(!user) {
        	sendRsp(res, 404, 'Not Found');
        }else{        	
			var user = req.user;
			UserModel.findOneAndUpdate({'username' : user.username}, {'name': req.body.name}, function(err, user) {
				if (err) {
					log.error('Internal error(%d): %s', res.statusCode, err.message);
					return sendRsp(res, 500, 'Server error');
				}
			    return sendRsp(res, 200, 'OK', {user: user});
			});        	
		}    
	});	
};


// base user update

exports.baseUserUpdate = function(req, res, next){	
	UserModel.findById(req.body._id, function (err, user) {
        if(!user) {
        	sendRsp(res, 404, 'Not Found');
        }

        user.role = req.body.role;

  		user.save(function (err,user) {
            if (!err) {
                log.info("user updated");
                var opts = [{path: 'dealer'}]
				UserModel.populate(user, opts, function(err, user){
					if(!err){	
						sendRsp(res, 200, 'Updated', {user: user});
					}
				});                
            } else {
                if(err.name === 'ValidationError') {
                	sendRsp(res, 400, 'Validation error');
                } else {
                	sendRsp(res, 500, 'Server error');
                }
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });	     	      
};



/**
 * select fields in display drop down
 */

exports.all = function(req, res) {
	var queryObj = {};
	req.query.dealer = req.user.dealer;
	
	if(req.query.role || req.query.role != null) {
		queryObj.role = req.query.role;
	}
	if(req.query.engineer == "ENGINEER"){
		queryObj.role = req.query.engineer;
	}
	
	UserModel.find(queryObj, '_id role name dealer', null, function(err, users) {
		if (!users) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			sendRsp(res, 200, 'OK', {
				users : users
			});
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};

/**
 * Get a single user
 */

exports.show = function (req, res, next) {
	var userId = req.params.id;
	console.log(userId);
	  
	UserModel.findById(userId,'-salt -hashed_password')
		.populate('dealer')
		.exec(function (err, user) {
		if(!user) {
	    	  sendRsp(res, 404, 'Not Found');
	    	  return;
	      }
	      if (!err) {
	          sendRsp(res, 200, 'OK', {user: user});
	      } else {
			  log.error('Internal error(%d): %s',res.statusCode,err.message);
	          sendRsp(res, 500, 'Server error');
	      }
	});
};



/**
 * Update a user
 * restriction: 'admin'
 */

exports.update = function (req, res, next) {
	req.checkBody('name', 'Missing Params').notEmpty();
	req.checkBody('role', 'Missing Params').notEmpty();
	var errors = req.validationErrors();
	if(errors){
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}
	var userId = req.params.id;
  
   UserModel.findById(userId, function (err, user) {
        if(!user) {
        	sendRsp(res, 404, 'Not Found');
        }
        user.name = req.body.name;
        user.username = req.body.username;
        /*user.dealer = req.body.dealer;*/
        user.dealer = req.user.dealer;
        user.role = req.body.role;
        user.email = req.body.email;
        user.branch = req.body.branch;
        user.phone	= req.body.phone;
        
        user.save(function (err) {
            if (!err) {
                log.info("user updated");
                sendRsp(res, 200, 'Updated', {user: user});
            } else {
                if(err.name === 'ValidationError') {
                	sendRsp(res, 400, 'Validation error');
                } else {
                	sendRsp(res, 500, 'Server error');
                }
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
};

//	User GetLists

exports.index = function(req, res) {
			
	var queryObj = {};
	req.query.dealer = req.user.dealer._id;
	
    if(req.query.dealer) {
    	queryObj.dealer = req.query.dealer;
    }
    if(req.query.name) {
    	queryObj.name = req.query.name;
    }
 	if(req.query.role) {
    	queryObj.role = req.query.role;
    }else{
    	queryObj.role = {$ne: 'CUSTOMER'};
    }
	
	var userLimit = req.query.limit;
	var userOffset = req.query.offset;
	var userSort = { '_id' : 1 };
	if (userLimit < 0 || userLimit > globalLimit) {
		userLimit = globalLimit;
	}
	UserModel.find(queryObj, '-salt -hashed_password', {
		limit : userLimit,
		skip : userOffset,
		sort : userSort
	}).populate('dealer').exec(function(err, users) {
		if (!users) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			UserModel.count(queryObj, function(err, count) {
				var total = err ? 'N/A' : count;
				sendRsp(res, 200, 'ok', {
					total : total,
					users : users
				});
			});
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};
		

//  multiple delete users

exports.deleteMultiple = function (req ,res) {		
	
	var userIds = req.body.ids;		
		
	UserModel.remove({_id: {$in : userIds}}, function (err) {		
	    if (!err) {
	       	sendRsp(res, 200, 'Users Removed');
	    } else {
	        log.error('Internal error(%d): %s',res.statusCode,err.message);
	        sendRsp(res, 500, 'Server error');
	    }
	});	
};


/**
 * Get my info
 */
exports.me = function(req, res, next) {	
	sendRsp(res, 200,'Success',req.user);	
};

exports.checkUsername = function(req, res){
	if(req.query.username){		
		UserModel.findOne({'username' : req.query.username}, function(err, user){
			if(user){
				sendRsp(res, 200, "Username Already Exists");	
			}else{
				sendRsp(res, 404, "Available");
			}
		});	
	}else{
		sendRsp(res, 400, "Missing query param username");
		return;
	}	
};


exports.checkEmail = function(req, res){	
	if(req.query.email){
		UserModel.findOne({'email' : req.query.email}, function(err, user){
			if(user){
				sendRsp(res, 200, "Email Already Exists");	
			}else{
				sendRsp(res, 404, "Available");
			}
		});	
	}else{
		sendRsp(res, 400, "Missing query param email");
		return;
	}
};



exports.imageURL = function(req, res){
	
	req.checkBody('image_url', 'Missing Query Param').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Query Param', util.inspect(errors));
		return;
	}
	var id = req.params.id;
	UserModel.findById(id, function(err, user){
		if(!user){
			sendRsp(res, 404, 'Not Found');
		}else{			
			var user = req.user;
			UserModel.findOneAndUpdate({'username' : user.username}, {'image_url': req.body.image_url}, function(err, user) {
				if (err) {
					log.error('Internal error(%d): %s', res.statusCode, err.message);
					return sendRsp(res, 500, 'Server error');
				}
			    return sendRsp(res, 200, 'OK', {user: user});
			});
		}
	});					
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};




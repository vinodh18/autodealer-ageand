'user strict'

var RegisterModel = require('./deviceToken.model');
var passport = require('passport');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');
var ObjectId = require('mongoose').Types.ObjectId;
/*var async = require('async');*/
var globalLimit = config.globalRowsLimit;

/* Create Registration
*/

exports.create = function(req,res, next){
	
	var deviceArr = [];
	var deviceObj = {}
	deviceObj.device_type = "IOS";
	deviceObj.dev_token = req.body.dev_token;
	deviceArr.push(deviceObj);
	
	var newRegister = new RegisterModel({
		user : req.user._id,
		device : deviceArr
	});

	newRegister.save(function(err, register){
		if(!err) {
			log.info("Register Created");
			sendRsp(res, 201, 'Created',{
				register: register
			});
		} else {
			if (err.name === 'ValidationError'){
				sendRsp(res, 400, 'Validation error')
			} else {
				sendRsp(res, 500, 'Server error');
			}
			log.error('Internal error(%d): %s', res.statusCode, err.message);
		}
	})
}

exports.Androidcreate = function(req,res, next){
	
	var deviceArr = [];
	var deviceObj = {}
	deviceObj.device_type = "ANDROID";
	deviceObj.dev_token = req.body.dev_token;
	deviceArr.push(deviceObj);
	
	var newRegister = new RegisterModel({
		user : req.user._id,
		device : deviceArr
	});

	newRegister.save(function(err, register){
		if(!err) {
			log.info("Register Created");
			sendRsp(res, 201, 'Created',{
				register: register
			});
		} else {
			if (err.name === 'ValidationError'){
				sendRsp(res, 400, 'Validation error')
			} else {
				sendRsp(res, 500, 'Server error');
			}
			log.error('Internal error(%d): %s', res.statusCode, err.message);
		}
	})
}
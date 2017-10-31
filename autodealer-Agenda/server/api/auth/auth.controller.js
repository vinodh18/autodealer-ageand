'use strict';

var UserModel 		= require('../user/user.model');
var passport 		= require('passport');
var config 			= require('../../config/environment');
var sendRsp 		= require('../utils').sendRsp;
var log 			= require('../libs/log')(module);
var util 			= require('util');
var request 		= require('request');
var _ 				= require('lodash');
var expressJwt 		= require('express-jwt');
var validateJwt 	= expressJwt({ secret: config.secrets.accessToken });
var cryptography	= require('../../auth/encrypt-decrypt');
var crypto			= require('crypto');

exports.login = function(req,res,next){	
	var params 			= req.body;
	var clientId 		= config.auth.clientId;
    var clientSecret 	= config.auth.clientSecret;
    params.grant_type 	= "password";

    var authCode = new Buffer(clientId+":"+clientSecret).toString('base64');        
    
	request.post({url: config.auth.url,
		form: params,headers: {"Authorization" : "Basic "+authCode }
	},function(err,response,body){
		console.log("Login Rsp statusCode :", response.statusCode);
		if(response.statusCode != 200){
			sendRsp(res, 401,'Invalid Username or Password');
			return;
		}
		var tokens = {};
		var rspTokens = {};
		var tokenJSON = JSON.parse(body);
		var refreshToken = tokenJSON.refresh_token;
		rspTokens.access_token = tokenJSON.access_token;
		rspTokens.expires_in = tokenJSON.expires_in;
		rspTokens.token_type = tokenJSON.token_type;

		var encryptedRefToken = cryptography.encrypt(refreshToken);
				
		tokens.clientId = clientId;
		tokens.refreshToken = JSON.parse(body).refresh_token;
		
		/*UserModel.update({'email' : params.username}, {$addToSet: {tokens: tokens}}, function(err,  numAffected) {
			console.log("numAffected::", numAffected);
			if (err) {
				log.error('Internal error(%d): %s', res.statusCode, err.message);
				return sendRsp(res, 500, 'Server error');
			}				
		});	*/
		res.cookie("autodealer_refresh_token",encryptedRefToken);
		sendRsp(res, 200,'Success',rspTokens);
	});	
}; 

exports.refreshToken = function(req,res,next){
	
	var decryptedRefToken = cryptography.decrypt(req.cookies.autodealer_refresh_token);	
	
	UserModel.find({"email" : req.body.username},function(err,user){	
		if(user.length > 0){
			var tokens = user[0].tokens;			
			var flag = false;
			for (var i = 0; i < tokens.length; i++) {					
				if(tokens[i].refreshToken === decryptedRefToken) {					
					flag = true;
				}
			}
			if(!flag) {
				sendRsp(res, 403, "Refesh token mismatched");
				return;
			}
			var params = {};
			params.refresh_token = decryptedRefToken;
			var clientId = config.auth.clientId;
		    var clientSecret = config.auth.clientSecret;
		    params.grant_type = "refresh_token";

		    var authCode = new Buffer(clientId+":"+clientSecret).toString('base64');		    

			request.post({url: config.auth.url,
				form: params,headers: {"Authorization" : "Basic "+authCode }
			},function(err,response,body){									
				sendRsp(res, 200,'Success',JSON.parse(body));
			});	
		}else{
			res.clearCookie('autodealer_refresh_token');
			sendRsp(res, 403, "user not found");
		}		

		
	});		
};


exports.logout = function(req,res,next){	
	var refToken = cryptography.decrypt(req.cookies.autodealer_refresh_token);
	res.clearCookie('autodealer_refresh_token');
	UserModel.update({'_id':req.user._id}, {$pull: {tokens: {"refreshToken": refToken}}},function(err,result){
		if(!err){
			sendRsp(res, 200, "logout successfully");	
		}else{
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			return sendRsp(res, 500, 'Server error');
		}
	});
	
};	

// s3Amazon imange upload
var createS3Policy;
var getExpiryTime;

getExpiryTime = function () {
    var _date = new Date();
    return '' + (_date.getFullYear()) + '-' + (_date.getMonth() + 1) + '-' +
        (_date.getDate() + 1) + 'T' + (_date.getHours() + 3) + ':' + '00:00.000Z';
};

createS3Policy = function(req, keyPath, callback) {
	console.log("keypath", keyPath);
    var date = new Date();
    var s3Policy = {
        'expiration': getExpiryTime(),
        'conditions': [
            ['starts-with', '$key', keyPath],
            {'bucket': config.s3FileUpload.bucket},
            {'acl': 'public-read'},
            ['starts-with', '$Content-Type', req.query.mimeType],
            {'success_action_status' : '201'}
        ]
    };

    var stringPolicy = JSON.stringify(s3Policy);
    var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

    var signature = crypto.createHmac('sha1', config.s3FileUpload.secret).update(new Buffer(base64Policy, 'utf-8')).digest('base64');
	console.log("req.user.username", req.user.username);
    var hashedUsername = crypto.createHash('sha256').update(req.user.username).digest("hex");                    
    var s3Credentials = {
        s3Policy: base64Policy,
        s3Signature: signature,
        AWSAccessKeyId: config.s3FileUpload.keyId,
        bucket: config.s3FileUpload.bucket,
        keyPath: keyPath ,
        username: hashedUsername
    };
    callback(s3Credentials);
};


exports.getS3Policy = function(req, res, next){
	console.log("req keypath", req.query.type);
	var keypath
	if(req.query.type == "dealers"){
		var keyPath = config.s3FileUpload.DealerkeyPath;
	}else
	if(req.query.type == "users"){
		var keyPath = config.s3FileUpload.keyPath;	
	}else
	if(req.query.type == "offers"){
		var keyPath = config.s3FileUpload.OfferskeyPath;	
	}else
	if(req.query.type == "vehicles"){
		var keyPath = config.s3FileUpload.VehicleskeyPath;
	}else if(req.query.type == "Img"){
		var keyPath = config.s3FileUpload.AdsMediakeyPath;
	}else if(req.query.type == "ThumbIMg"){
		var keyPath = config.s3FileUpload.AdsMediakeyThumbKeyPath;
	}else if(req.query.type == "NewsImg"){
		var keyPath = config.s3FileUpload.NewsEventsPath;
	}else if(req.query.type == "NewsThumbIMg"){
		var keyPath = config.s3FileUpload.NewsEventsThumbkeyPath;
	}
	createS3Policy(req,keyPath, function(creds, err){
		if(!err){
			return sendRsp(res, 200, 'OK', creds);
		}else{
			return sendRsp(res, 500, 'Server error');
		}
	});
};
// end
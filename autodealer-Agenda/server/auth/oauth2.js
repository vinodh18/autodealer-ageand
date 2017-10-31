/**
 * Module dependencies.
 */
var oauth2orize = require('oauth2orize');
var passport = require('passport');
var _ = require('lodash');
var User = require('../api/user/user.model');
var crypto = require('crypto');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var auth = require('./auth');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

/**
 * Exchange user id and password for access tokens.
 * 
 * The callback accepts the `client`, which is exchanging the user's name and
 * password from the token request for verification. If these values are
 * validated, the application issues an access token on behalf of the user who
 * authorized the code.
 */
server.exchange(oauth2orize.exchange.password(function(client, email, password,
		scope, done) {
	console.log("oauth password exchange: " + client + ", " + email + ", " + password);
	// Validate the user
	User.findOne({
		email : email
	}, function(err, user) {
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false);
		}
		if (!user.authenticate(password)) {
			return done(null, false);
		}
		/*if (!_.find(user.apps, client.app)) {
			return done(null, false);
		}*/
		
		// var refreshToken =
		// crypto.randomBytes(config.token.refreshTokenBytes).toString('base64');

		var tokenPayload = {
			userId : user._id,
			username : user.username,
			email : user.email,
			imgUrl : user.image_url,
			client : client
		};
		var accessToken = jwt.sign(tokenPayload, config.secrets.accessToken,
				{expiresInMinutes: config.token.expiresInMinutes});

		if(user.tokens.length > 0) {
			console.log("client", client._id);
			for (var i = 0; i < user.tokens.length; i++) {
				var token = user.tokens[i];
				if(token.appClient.equals(client._id)){
					console.log("client already exist");
					return done(null, accessToken, token.refreshToken, {
						expires_in : config.token.expiresInMinutes * 60
					});
				}
			}
		}
		
		var refreshTokenPayload = {
			userId : user._id,
			username : user.username,
			email : user.email,
			imgUrl : user.image_url,
			client : client
		};
		var refreshToken = jwt.sign(refreshTokenPayload, config.secrets.refreshToken);

		var token = {appClient: client._id, accessToken: accessToken, refreshToken: refreshToken};
		User.update({_id: user._id, 'tokens.appClient' : client._id}, {$set: {'tokens.$': token}}, function(err,  numAffected) {
			console.log("error::",err);
			console.log("numAffected::",numAffected);
			if (numAffected == 0) {
	            // Document not updated so you can push onto the array
				User.update({_id: user._id}, {$push:{'tokens': token}}, function(err,  numAffected) {
					if(err) {
						console.log(err);
						return done(null, false);
					}
					return done(null, accessToken, refreshToken, {
						expires_in : config.token.expiresInMinutes * 60
					});
				});
			} else {
				if(err) {
					console.log(err);
					return done(null, false);
				}
				return done(null, accessToken, refreshToken, {
					expires_in : config.token.expiresInMinutes * 60
				});
			}
			
		});
	});
}));

/**
 * Exchange the refresh token for an access token.
 * 
 * The callback accepts the `client`, which is exchanging the client's id from
 * the token request for verification. If this value is validated, the
 * application issues an access token on behalf of the client who authorized the
 * code
 */
server.exchange(oauth2orize.exchange.refreshToken(function(client,
		refreshToken, scope, done) {
	console.log(client);
	console.log(refreshToken);
	jwt.verify(refreshToken, config.secrets.refreshToken, function(err,
			tokenPayload) {
		console.log("refresh token err", err);
		console.log(tokenPayload);
		if(err) {
			return done(err);
		}
		if (client._id != tokenPayload.client._id) {
			return done(null, false);
		}
		if (client.secret != tokenPayload.client.secret) {
			return done(null, false);
		}
		User.findById(tokenPayload.userId, function(err, user) {
			console.log("user:", user);
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false);
			}

			/*if (!_.find(user.apps, client.app)) {
				return done(null, false);
			}*/
			var newTokenPayload = {
				userId : user._id,
				username : user.username,
				email : user.email,
				client : client
			};
			var accessToken = jwt.sign(newTokenPayload,
					config.secrets.accessToken, {expiresInMinutes: config.token.expiresInMinutes});
			
			var token = {appClient: client._id, accessToken: accessToken, refreshToken: refreshToken};
			User.update({_id: user._id, 'tokens.appClient' : client._id}, {$set: {'tokens.$': token}}, function(err,  numAffected) {
				if (numAffected == 0 && err && err.code === 16836) {
		            // Document not updated so you can push onto the array
					User.update({_id: user._id}, {$push:{'tokens': token}}, function(err,  numAffected) {
						if(err) {
							console.log(err);
							return done(null, false);
						}
						return done(null, accessToken, null, {
							expires_in : config.token.expiresInMinutes * 60
						});
					});
				} else {
					if(err) {
						console.log(err);
						return done(null, false);
					}
					return done(null, accessToken, null, {
						expires_in : config.token.expiresInMinutes * 60
					});
				}
				
			});
		});
	});
}));

/**
 * Token endpoint
 * 
 * `token` middleware handles client requests to exchange authorization grants
 * for access tokens. Based on the grant type being exchanged, the above
 * exchange middleware will be invoked to handle the request. Clients must
 * authenticate when making requests to this endpoint.
 */
exports.token = [
		passport.authenticate([ 'basic', 'oauth2-client-password' ], {
			session : false
		}), server.token(), server.errorHandler() ];

var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var Appclient = require('../api/appclient/appclient.model');

/**
 * BasicStrategy & ClientPasswordStrategy
 * 
 * These strategies are used to authenticate registered OAuth clients. They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens. The OAuth 2.0 specification suggests that clients use the HTTP
 * Basic scheme to authenticate. Use of the client password strategy allows
 * clients to send the same credentials in the request body (as opposed to the
 * `Authorization` header). While this approach is not recommended by the
 * specification, in practice it is quite common.
 */
passport.use(new BasicStrategy(function(clientId, clientSecret, done) {
	Appclient.findById(clientId, function(err, client) {
		if (err) {
			return done(err);
		}
		if (!client) {
			return done(null, false);
		}
		if (client.secret != clientSecret) {
			return done(null, false);
		}
		return done(null, client);
	});
}));

/**
 * Client Password strategy
 * 
 * The OAuth 2.0 client password authentication strategy authenticates clients
 * using a client ID and client secret. The strategy requires a verify callback,
 * which accepts those credentials and calls done providing a client.
 */
passport.use(new ClientPasswordStrategy(function(clientId, clientSecret, done) {
	console.log('client password strategy: ' + clientId + ", " + clientSecret);
	Appclient.findById(clientId, function(err, client) {
		if (err) {
			return done(err);
		}
		if (!client) {
			return done(null, false);
		}
		if (client.secret != clientSecret) {
			return done(null, false);
		}
		return done(null, client);
	});
}));

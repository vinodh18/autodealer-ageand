'use strict';

var _ = require('lodash');
var AppClient = require('./appclient.model');
var log = require('../libs/log')(module);
var sendRsp = require('../utils').sendRsp;
var util = require('util');

// Get list of appclients
exports.index = function(req, res) {
	AppClient.find({}).populate('app').exec(function(err, appclients) {
		if (err) {
			return handleError(res, err);
		}
		return res.json(200, appclients);
	});
	
	/*AppClient.find(function(err, appclients) {
		if (err) {
			return handleError(res, err);
		}
		return res.json(200, appclients);
	});*/
};

// Get a single appclient
exports.show = function(req, res) {
	AppClient.findById(req.params.id).populate('app').exec(function(err, appclient) {
		if (err) {
			return handleError(res, err);
		}
		if (!appclient) {
			return res.send(404);
		}
		return res.json(200, appclient);
	});
	
	/*AppClient.findById(req.params.id, function(err, appclient) {
		if (err) {
			return handleError(res, err);
		}
		if (!appclient) {
			return res.send(404);
		}
		return res.json(appclient);
	});*/
};

// Creates a new appclient in the DB.
exports.create = function(req, res) {
	req.checkBody('type', 'Missing Query Param').notEmpty();
	req.checkBody('name', 'Missing Query Param').notEmpty();
	//req.checkBody('secret', 'Missing Query Param').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Query Param', util.inspect(errors));
		return;
	}
	
	req.body.secret = require('crypto').randomBytes(32).toString('base64');

	AppClient.create(req.body, function(err, appclient) {
		if (err) {
			res.statusCode = 500;
			if(err.code === 11000) {
				res.statusCode = 409;
				err.message = "Duplicate entry";
			}
			log.error('Internal error(%d): %s', res.statusCode, err.message);
            return sendRsp(res, res.statusCode, err.message);
		}
		return sendRsp(res, 201, 'OK', {
			appclient : appclient
		});
	});
};

// Updates an existing appclient in the DB.
exports.update = function(req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	AppClient.findById(req.params.id, function(err, appclient) {
		if (err) {
			return handleError(res, err);
		}
		if (!appclient) {
			return res.send(404);
		}
		var updated = _.merge(appclient, req.body);
		updated.save(function(err) {
			if (err) {
				return handleError(res, err);
			}
			return res.json(200, appclient);
		});
	});
};

// Deletes a appclient from the DB.
exports.destroy = function(req, res) {
	AppClient.findById(req.params.id, function(err, appclient) {
		if (err) {
			return handleError(res, err);
		}
		if (!appclient) {
			return res.send(404);
		}
		appclient.remove(function(err) {
			if (err) {
				return handleError(res, err);
			}
			return res.send(204);
		});
	});
};

function handleError(res, err) {
	return res.send(500, err);
}
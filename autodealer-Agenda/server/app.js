/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var Agenda = require('agenda');
var config = require('./config/environment');
var nextServiceDate = require('./agenda/next-service-date-agenda.js');
var warrantyExpiresDate = require('./agenda/warranty-expires-date-agenda.js');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Define New Agenda
var agenda = new Agenda({
	db: {	
		address: '192.168.2.10:27017/autodealer-dev',
		collection: "agenda",
		options: {server:{auto_reconnect:true}}
	}
});

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Define Agenda Jobs
agenda.define('nextServiceDate', nextServiceDate);
agenda.define('warrantyExpiresDate', warrantyExpiresDate);

// OnReady Agenda
agenda.on('ready', function(){
	console.log('agenda onReady');
	agenda.every('2 minutes', 'nextServiceDate');
	agenda.every('2 minutes', 'warrantyExpiresDate');
	agenda.start();  	
});

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env')); 
});

// Expose app
exports = module.exports = app;
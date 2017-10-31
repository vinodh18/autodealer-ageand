'use strict';

var JobcardModel = require('../api/jobcard/jobcard.model');
var CustomerVehicleModel = require('../api/customervehicles/customervehicles.model');
var Agenda = require('agenda');
var nodemailer = require('nodemailer');
var moment = require('moment');
var util = require('util');
var log = require('../api/libs/log')(module);
var config = require('../config/environment');

/*
Just use agenda.every() with the cron notation:
Ex: agenda.every('0 18 * * *', 'job-definition-that-will-run-everyday-at-6pm');

* * * * * *
| | | | | | 
| | | | | +-- Year              (range: 1900-3000)
| | | | +---- Day of the Week   (range: 1-7, 1 standing for Monday)
| | | +------ Month of the Year (range: 1-12)
| | +-------- Day of the Month  (range: 1-31)
| +---------- Hour              (range: 0-23)
+------------ Minute            (range: 0-59)

*/

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
	service: config.transporter.service,
	auth: {
		user: config.transporter.username,
		pass: config.transporter.password
	} 
});

//var agenda = new Agenda();
var agenda = new Agenda({db: {address: '192.168.2.10:27017/agenda-test', collection: "nextServiceDate", options: {server:{auto_reconnect:true}}}});

function createAgenta() {
	console.log('agenda create');
	agenda.define('nextServiceDate', function(job, done){
		console.log("next service date job define");		
		JobcardModel.find({},null, {})
		.populate('dealer')
		.populate('customer')
		.exec(function(err, jobcards){
			console.log('err:', err);
			if(!err){
				for(var i=0; i < jobcards.length; i++){
					if(jobcards[i].dealer && jobcards[i].customer){										

						var start = moment(jobcards[i].next_service_date);
						var end = moment();
						var days = start.diff(end, "days");

						if(days && days == 3){
							console.log('send email');							
							transporter.sendMail({
								from: config.transporter.username,
								to: jobcards[i].customer.email,
								subject: util.format("JobCard Next Service Date on %s from %s", moment(jobcards[i].next_service_date).format("YYYY-MM-DD"), jobcards[i].dealer.name),
								text: util.format('Hi %s, Your vehicle next service date on %s.',
									jobcards[i].customer.name, moment(jobcards[i].next_service_date).format("YYYY-MM-DD"))	
							},function(err,rsp){	            				
								if(err){
									log.info(err)
								}else{
									log.info("Email Send Successfully");									
								}	
							});
						}						
					}					
				}
				
			}
		});		
		done();
	});

	agenda.define('warrantyExpiryAlert', function(job, done){
		console.log("warrantyExpiryAlert job define");		
		CustomerVehicleModel.find({},null, {})
		.populate('customer')
		.populate('vehicle_type')
		.populate('warranties.warranty_type')
		.exec(function(err, customerVehicles){
			console.log('err:', err);
			if(!err){
				for(var i=0; i < customerVehicles.length; i++){
					if(customerVehicles[i].customer && customerVehicles[i].vehicle_type && 
						customerVehicles[i].warranties.to){										

						var start = moment(customerVehicles[i].warranties.to);
						var end = moment();
						var days = start.diff(end, "days");

						if(days && days == 3){
							console.log('send email');							
							transporter.sendMail({
								from: config.transporter.username,
								to: customerVehicles[i].customer.email,
								subject: util.format("JobCard Warranty Expires on %s", moment(customerVehicles[i].warranties.to).format("YYYY-MM-DD")),
								text: util.format('Hi %s, Your %s warranty expires on %s.',
									customerVehicles[i].customer.name, customerVehicles[i].vehicle_type.name, moment(customerVehicles[i].warranties.to).format("YYYY-MM-DD"))	
							},function(err,rsp){	            				
								if(err){
									log.info(err)
								}else{
									log.info("Email Send Successfully");									
								}	
							});
						}						
					}					
				}
			}
		});		
		done();
	});

	return;	
};

exports.start = function() {
	console.log('agenda start');
	createAgenta();
	agenda.every('2 minutes', ['nextServiceDate','warrantyExpiryAlert']);
	agenda.start();
}	
'use strict';

var CustomerVehicleModel = require('../api/customervehicles/customervehicles.model');
var nodemailer = require('nodemailer');
var moment = require('moment');
var util = require('util');
var log = require('../api/libs/log')(module);
var config = require('../config/environment');


// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
	service: config.transporter.service,
	auth: {
		user: config.transporter.username,
		pass: config.transporter.password
	} 
});


module.exports = function(job,done){
	console.log("warrantyExpiryAlert job define");		
	CustomerVehicleModel.find({},null, {})
	.populate('customer')
	.populate('vehicle_type')
	.populate('warranties.warranty_type')
	.exec(function(err, customerVehicles){
		//console.log('err:', err);
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
};
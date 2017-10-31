'use strict';

var JobcardModel = require('../api/jobcard/jobcard.model');
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
	console.log("next service date job define");		
	JobcardModel.find({},null, {})
	.populate('dealer')
	.populate('customer')
	.exec(function(err, jobcards){
		//console.log('err:', err);
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
};
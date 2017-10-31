'use strict';
var ServiceModel 		  = require('./jobcard.model');
var CustomervehiclesModel = require('../customervehicles/customervehicles.model');
var DealerModel 		  = require('../dealer/dealer.model');
var CustomerModel 		  = require('../customer/customer.model');
var WarrantyTypeModel 	  = require('../warrantytype/warrantytype.model');
var passport 			  = require('passport');
var config 				  = require('../../config/environment');
var sendRsp 			  = require('../utils').sendRsp;
var autoIncrement 		  = require('../auto-increment').autoIncrement;
var log 				  = require('../libs/log')(module);
var util 				  = require('util');
var ObjectId 			  = require('mongoose').Types.ObjectId;
var async 				  = require('async');
var globalLimit 		  = config.globalRowsLimit;
var XLSX 			      = require('xlsx');
var moment				  = require('moment');
var nodemailer 			  = require('nodemailer');
var UserModel			  = require('../user/user.model');
var deepPopulate    	  = require('mongoose-deep-populate');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
	service: config.transporter.service,
	auth: {
		user: config.transporter.username,
		pass: config.transporter.password
	} 
});

function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			
			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';
			
			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

exports.updateJobcard = function(req, res){
	console.log("jobcard", req.body.job_card);
	var jobCards = req.body.job_card;	
	var serviceId = req.params.id;

	ServiceModel.findById(serviceId, function(err, service) {
		if (!service) {
			sendRsp(res, 404, 'Not Found');
		}

		service.job_card = jobCards;


		service.save(function(err) {			
			if (!err) {
				log.info("Service updated");								
				sendRsp(res, 200, 'Updated', {service : service});								
			} else {
				if (err.name === 'ValidationError') {
					sendRsp(res, 400, 'Validation error');
				} else {
					sendRsp(res, 500, 'Server error');
				}
				log.error('Internal error(%d): %s', res.statusCode, err.message);
			}
		});
	
	});
};

exports.updateParts = function(req, res){
	console.log("parts", req.body.parts);
	var parts = req.body.parts;	
	var serviceId = req.params.id;

	ServiceModel.findById(serviceId, function(err, service) {
		if (!service) {
			sendRsp(res, 404, 'Not Found');
		}

		service.parts = parts;


		service.save(function(err) {			
			if (!err) {
				log.info("Service updated");								
				sendRsp(res, 200, 'Updated', {service : service});								
			} else {
				if (err.name === 'ValidationError') {
					sendRsp(res, 400, 'Validation error');
				} else {
					sendRsp(res, 500, 'Server error');
				}
				log.error('Internal error(%d): %s', res.statusCode, err.message);
			}
		});
	
	});
};

exports.updateMiscCharges = function(req, res){
	console.log("miscCharges", req.body.misc_charges);
	var miscCharges = req.body.misc_charges;	
	var serviceId = req.params.id;

	ServiceModel.findById(serviceId, function(err, service) {
		if (!service) {
			sendRsp(res, 404, 'Not Found');
		}

		service.misc_charges = miscCharges;


		service.save(function(err) {			
			if (!err) {
				log.info("Service updated");								
				sendRsp(res, 200, 'Updated', {service : service});								
			} else {
				if (err.name === 'ValidationError') {
					sendRsp(res, 400, 'Validation error');
				} else {
					sendRsp(res, 500, 'Server error');
				}
				log.error('Internal error(%d): %s', res.statusCode, err.message);
			}
		});
	
	});
};

exports.updateLabourCharges = function(req, res){
	console.log("labourCharges", req.body.labour_charges);
	var labourCharges = req.body.labour_charges;	
	var serviceId = req.params.id;

	ServiceModel.findById(serviceId, function(err, service) {
		if (!service) {
			sendRsp(res, 404, 'Not Found');
		}

		service.labour_charges = labourCharges;


		service.save(function(err) {			
			if (!err) {
				log.info("Service updated");								
				sendRsp(res, 200, 'Updated', {service : service});								
			} else {
				if (err.name === 'ValidationError') {
					sendRsp(res, 400, 'Validation error');
				} else {
					sendRsp(res, 500, 'Server error');
				}
				log.error('Internal error(%d): %s', res.statusCode, err.message);
			}
		});
	
	});
};


exports.updateAccessories = function(req, res){
	
	var accessories = req.body.accessories;	
	var serviceId = req.params.id;

	ServiceModel.findById(serviceId, function(err, service) {
		if (!service) {
			sendRsp(res, 404, 'Not Found');
		}

		service.accessories = accessories;


		service.save(function(err) {			
			if (!err) {
				log.info("Service updated");								
				sendRsp(res, 200, 'Updated', {service : service});								
			} else {
				if (err.name === 'ValidationError') {
					sendRsp(res, 400, 'Validation error');
				} else {
					sendRsp(res, 500, 'Server error');
				}
				log.error('Internal error(%d): %s', res.statusCode, err.message);
			}
		});
	
	});
};

//pending service

exports.pending = function(req, res){
	var queryObj = {};

	req.query.dealer = req.user.dealer._id;
	//console.log("pending..:", req.user);
	if(req.query.dealer){
		queryObj.dealer = req.query.dealer;
	}

	if(req.user.role == 'CUSTOMER'){
	queryObj.user = req.user._id;
	}
	
			var serviceLimit = req.query.limit;
			var serviceOffset = req.query.offset;
			if (serviceLimit < 0 || serviceLimit > globalLimit) {
				serviceLimit = globalLimit;
			}
			/*if(!req.query.from_date || !req.query.to_date){
								var from = new Date();
								var to = new Date(Date.now());
								var lastSevendays = {};
								from.setDate(to.getDate() - 6);
								from.setHours(0, 0, 0, 0);										
								to.setHours(23, 59, 59, 999);	
								lastSevendays.$gte = from;
								lastSevendays.$lte = to;
								queryObj.service_date  = lastSevendays;
							}*/

		/*	if (req.query.from_date && req.query.to_date) {
								var service_daterange = {};
								var from_date = new Date(req.query.from_date);
								from_date.setHours(0, 0, 0, 0);
								var to_date = new Date(req.query.to_date);
								to_date.setHours(23, 59, 59, 999);
								service_daterange.$gte = from_date;
								service_daterange.$lte = to_date;
								queryObj.service_date = service_daterange;
							}*/

	
			var today = moment().format("YYYY-MM-DD");
			var date = {};
			date.$lte = today;

			queryObj.next_service_date = date;

			//console.log("queryObj", queryObj);
			ServiceModel.find(queryObj, null, {
				limit : serviceLimit,
				skip : serviceOffset
			}).deepPopulate('customer_vehicles user branch  branch.serviceable_vehicles.vehicle_type branch.makes  service_details.service_type')
			.exec(function(err, services) {
				//console.log("services", services.length);
				ServiceModel.update(queryObj, {status: "SERVICES_DUE"}, {multi: true}, function(err, num){
								//	console.log("update", num);
								});
					if (!services) {
						sendRsp(res, 404, 'Not Found');
						}
						if (!err) {
							ServiceModel.count(queryObj, function(err, count) {
								var total = err ? 'N/A' : count;
								sendRsp(res, 200, 'ok', {
									total : total,
									services : services
								})
							});
						} else {
							log.error('Internal error(%d): %s', res.statusCode,
									err.message);
							sendRsp(res, 500, 'Server error');
						}
			});
		/*var today = moment();
		var todayDate = today.clone().format("YYYY-MM-DD");
		var next_service_date = moment(service.next_service_date).format("YYYY-MM-DD");
		//console.log('next billing date:' ,contract.next_billing_date);
											
		if(moment(next_service_date).isBefore(todayDate)) {
			
		}*/
	
}

/**
 * Get user based list of Service
 */

exports.index = function(req, res) {
	UserModel.findById(req.user._id,function(err, user) {
		if(user){
			var queryObj = {};

			queryObj.dealer = req.user.dealer._id;

			if(req.user.role != "CUSTOMER" && req.user.role != "DEALER_ADMIN"){
				queryObj.branch = req.user.branch;
			}
					
			/*if(req.user.role == "CUSTOMER"){
				var notEqual = {};
				notEqual.$ne = "SCHEDULED";
				queryObj.status = notEqual;
			}*/

			if(req.user.role == 'CUSTOMER'){
			queryObj.customer = req.user._id;

			/*if(!(req.query.status == "REQUESTED" || req.query.status == "SERVICES_DUE")){
			if(!req.query.from_date || !req.query.to_date){
								var from = new Date();
								var to = new Date(Date.now());
								var lastSevendays = {};
								from.setDate(to.getDate() - 6);
								from.setHours(0, 0, 0, 0);										
								to.setHours(23, 59, 59, 999);	
								lastSevendays.$gte = from;
								lastSevendays.$lte = to;
								queryObj.service_date  = lastSevendays;
							}
						}*/
					}
			
			/*if(!(req.query.status == "REQUESTED" || req.query.status == "PENDING")){
			if(!req.query.from_date || !req.query.to_date){
								var from = new Date();
								var to = new Date(Date.now());
								var lastSevendays = {};
								from.setDate(to.getDate() - 6);
								from.setHours(0, 0, 0, 0);										
								to.setHours(23, 59, 59, 999);	
								lastSevendays.$gte = from;
								lastSevendays.$lte = to;
								queryObj.service_date  = lastSevendays;
							}
						}*/
				var total = {};
			if (req.query.total_amt&& req.query.compare&& (req.query.compare == 'gt'
									|| req.query.compare == 'lt'
									|| req.query.compare == 'gte' || req.query.compare == 'lte')) {
								if (req.query.compare == 'gt') {
									total.$gt = req.query.total_amt;
									queryObj.total_amt = total;
								} else if (req.query.compare == 'lt') {
									total.$lt = req.query.total_amt;
									queryObj.total_amt = total;
								} else if (req.query.compare == 'gte') {
									total.$gte = req.query.total_amt;
									queryObj.total_amt = total;
								} else if (req.query.compare == 'lte') {
									total.$lte = req.query.total_amt;
									queryObj.total_amt = total;
								}
							} else {
								if (req.query.total_amt) {
									queryObj.total_amt = req.query.total_amt;
								}
							}


			if (req.query.job_card_no) {
				queryObj.job_card_no = req.query.job_card_no;
			}
			if (req.query.branch) {
				queryObj.branch = req.query.branch;
			}
			/*if (req.query.service_type) {
				queryObj['service_details.service_type'] = req.query.service_type;
			}*/
			
			if (req.query.service_date) {
				queryObj.service_date = req.query.service_date;
			}
			
			/*if(req.query.status){
				if(req.query.status == 'COMPLETED'){
				req.query.status = {$in:['COMPLETED_UNPAID', 'COMPLETED_PAID']};
				}
				queryObj.status = req.query.status;
			}*/
			if(req.query.job_status){
				queryObj.job_status = req.query.job_status;
			}
			if(req.query.make){
				queryObj.make = req.query.make;
			}
			if(req.query.customer_name){
				queryObj.customer_name = req.query.customer_name;
			}
			/*if(req.query.amount){
				queryObj.amount = req.query.amount;
			}*/
			var serviceLimit = req.query.limit;
			var serviceOffset = req.query.offset;
			if (serviceLimit < 0 || serviceLimit > globalLimit) {
				serviceLimit = globalLimit;
			}

			if (req.query.from_date && req.query.to_date) {
					var service_daterange = {};
					var from_date = new Date(req.query.from_date);
					from_date.setHours(0, 0, 0, 0);
					var to_date = new Date(req.query.to_date);
					to_date.setHours(23, 59, 59, 999);
					service_daterange.$gte = from_date;
					service_daterange.$lte = to_date;
					queryObj.service_date = service_daterange;
				}
				console.log('queryObj', queryObj);
			ServiceModel.find(queryObj, null, {
				limit : serviceLimit,
				skip : serviceOffset
			}).populate('customer_vehicle')
			  .populate('customer')
			  .populate('dealer')			  
			.exec(function(err, services) {
				
						if (!services) {
							sendRsp(res, 404, 'Not Found');
						}
						if (!err) {
							ServiceModel.count(queryObj, function(err, count) {
								var total = err ? 'N/A' : count;
								sendRsp(res, 200, 'ok', {
									total : total,
									services : services
								});
							});
						} else {
							log.error('Internal error(%d): %s', res.statusCode,
									err.message);
							sendRsp(res, 500, 'Server error');
						}
					});
		}
		if (!user) {
			sendRsp(res, 400, 'User Not Found');
		}
});
};

// check feed back
exports.checkfeedback = function(req, res, next){
	var queryObj = {};
		
		var serviceId   = req.params.id;
		queryObj.dealer = new ObjectId(req.user.dealer._id);

		var serviceLimit = req.query.limit;
			var serviceOffset = req.query.offset;
			if (serviceLimit < 0 || serviceLimit > globalLimit) {
				serviceLimit = globalLimit;
			}
			var feedback = {};
			feedback.$exists = true;
			queryObj.feedback = feedback;

			//console.log("feedback", feedback);
			//console.log("queryObj", queryObj);

			ServiceModel.find(queryObj, null, {
				limit : serviceLimit,
				skip : serviceOffset
			})
			.populate('customer_vehicle')
			.populate('customer')
			.populate('dealer')
			.exec(function(err, services) {
				if (!services) {
							sendRsp(res, 404, 'Not Found');
						}
						if(!err){
				ServiceModel.count(queryObj,  function(err, num){
									//console.log("count", num);
							var total = err ? 'N/A' : num;
								sendRsp(res, 200, 'ok', {
									total : total,
									services : services
								});
								});
					} else {
							log.error('Internal error(%d): %s', res.statusCode, err.message);
							sendRsp(res, 500, 'Server error');
						}

						/*if (!err) {
							ServiceModel.count(queryObj, function(err, count) {
								var total = err ? 'N/A' : count;
								sendRsp(res, 200, 'ok', {
									total : total,
									services : services
								})
								
							});
						} else {
							log.error('Internal error(%d): %s', res.statusCode,
									err.message);
							sendRsp(res, 500, 'Server error');
						}*/
			});
		
}

exports.inProgressStatus = function(req, res, next) {	
	var serviceId = req.params.id;
	ServiceModel.findById(serviceId, function(err, service) {
		if (!service) {
			sendRsp(res, 404, 'Not Found');
		}
		
		service.job_status	= 'INPROGRESS';

		service.save(function(err) {			
			if (!err) {
				log.info("Service updated");				
				ServiceModel.deepPopulate(service, 'customer_vehicle customer dealer', function(err, service){
				if(!err){
				sendRsp(res, 200, 'Updated', {service : service});
					}
				});
			} else {
				if (err.name === 'ValidationError') {
					sendRsp(res, 400, 'Validation error');
				} else {
					sendRsp(res, 500, 'Server error');
				}
				log.error('Internal error(%d): %s', res.statusCode, err.message);
			}
		});
	
	});
};

exports.completeStatus = function(req, res, next) {	
	var serviceId = req.params.id;
	ServiceModel.findById(serviceId, function(err, service) {
		if (!service) {
			sendRsp(res, 404, 'Not Found');
		}
		
		service.job_status	= 'PAYMENT_DUE';
		service.completed_on = Date.now();

		service.save(function(err) {			
			if (!err) {
				log.info("Service updated");
				CustomerModel.findById(service.customer,function (err, customer) {
					if (!customer) {
						sendRsp(res, 404, 'Not Found');
					}
					if (!err) {						
						transporter.sendMail({
							from: config.transporter.username,
							to: customer.email,
							subject: util.format("JobCard completed from %s on %s", req.user.dealer.name, moment(service.completed_on).format("YYYY-MM-DD")),
							text: util.format('Hi %s, Your vehicle was just ready for ride and completed the service on %s.',
								customer.name, moment(service.completed_on).format("YYYY-MM-DD"))	
						},function(err,rsp){	            				
							if(err){
								log.info(err)
							}else{
								log.info("Email Send Successfully");
								ServiceModel.deepPopulate(service, 'customer_vehicle customer dealer', function(err, service){
									if(!err){
										sendRsp(res, 200, 'Updated', {service : service});
									}
								});		
							}	
						});
					}
				});												
			} else {
				if (err.name === 'ValidationError') {
					sendRsp(res, 400, 'Validation error');
				} else {
					sendRsp(res, 500, 'Server error');
				}
				log.error('Internal error(%d): %s', res.statusCode, err.message);
			}
		});
	
	});
}



/**
 * Create a new Service
 */
 
exports.create = function(req, res, next) {	
	req.checkBody('pick_up', 'Missing Params').notEmpty();
	req.checkBody('drop', 'Missing Params').notEmpty();
	req.checkBody('job_status', 'Missing Params').notEmpty();	
	req.checkBody('customer', 'Missing Params').notEmpty();
	req.checkBody('customer_vehicle', 'Missing Params').notEmpty();
	//req.checkBody('branch', 'Missing Params').notEmpty();
	//req.checkBody('make', 'Missing Params').notEmpty();
	//req.checkBody('model', 'Missing Params').notEmpty();
	
	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}
	
	var customerVehicleId = req.body.customer_vehicle
	CustomervehiclesModel.findById(customerVehicleId,function (err, customerVehicle) {
		if (!customerVehicle) {
			sendRsp(res, 404, 'Not Found');
		}
		if (!err) {
			autoIncrement(req.user.dealer._id,"job_card_no", function(err, jobCardNo){				
				if(jobCardNo){
					var newService = new ServiceModel({
						job_card_no				: jobCardNo, 
						customer_vehicle		: req.body.customer_vehicle,
						branch					: req.user.branch,
						mileage					: req.body.mileage,
						fuel					: req.body.fuel,
						service_date			: req.body.service_date,
						pick_up 				: req.body.pick_up,
						drop 					: req.body.drop,
						comments				: req.body.comments,
						job_status				: req.body.job_status,
						job_card				: req.body.job_card,
						parts 					: req.body.parts,
						labour_charges			: req.body.labour_charges,
						accessories				: req.body.accessories,
						misc_charges			: req.body.misc_charges,
						completed_on			: req.body.completed_on,				
						scheduled_at			: Date.now(),
						amount					: req.body.amount,
						dealer 					: req.user.dealer._id,
						feedback				: req.body.feedback,
						post_service_complaints : req.body.post_service_complaints,
						customer_rating			: req.body.customer_rating,
						next_service_date		: req.body.next_service_date,
						customer 				: req.body.customer,
						make 					: customerVehicle.make,
						model 					: customerVehicle.model,
						total_amt 				: req.body.total_amt
					});
					newService.save(function(err, Service) {
						if (!err) {
							log.info("Job card created");
							var opts = [{path: 'customer_vehicle'}, {path: 'dealer'}, {path: 'customer'}]
							ServiceModel.populate(Service, opts, function(err, service){							
								sendRsp(res, 201, 'Created', {service : Service});
							});	
						}
					});
				}
			});						
		} else {
			if (err.name === 'ValidationError') {
				sendRsp(res, 400, 'Validation error');
			}  else {
				sendRsp(res, 500, 'Server error');
			}
			log.error('Internal error(%d): %s', res.statusCode, err.message);
		}
	});					
};

/**
 * Get a single service
 */

exports.show = function(req, res, next) {	
	var id = new ObjectId(req.params.id);
	ServiceModel.findById(id)    
    .deepPopulate('dealer customer customer_vehicle customer_vehicle.vehicle_type')
    /*.populate('customer')
    .populate('customer_vehicle')*/
	.exec(function (err, service) {	
		if (!service) {
			sendRsp(res, 404, 'Not Found');
			return;
		}
		if (!err) {			
			var warrantyTypeId = service.customer_vehicle.warranties.warranty_type;
			WarrantyTypeModel.findById(warrantyTypeId, function (err, warrantyType) {				
				if (!warrantyType) {
					sendRsp(res, 404, 'CustomerVehicle Warranty Not Found');
					return;
				}
				if (!err) {
					//service.customer_vehicle.warranties.warranty_type = warrantyType;
					sendRsp(res, 200, 'OK', { service : service, warranty_type : warrantyType });					
				} else {
					log.error('Internal error(%d): %s', res.statusCode, err.message);
					sendRsp(res, 500, 'Server error');
				}
			});			
		} else {
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			sendRsp(res, 500, 'Server error');
		}
	});
};
		
/**
 * Delete a single service
 */


exports.destroy = function(req, res) {
	var serviceId = req.params.id;
	ServiceModel.findById(serviceId, function(err, service) {
		if (!service) {
			sendRsp(res, 404, 'Not Found');
		} else {
			service.remove(function(err) {
				if (!err) {
					log.info("Service removed");					
					ServiceModel.deepPopulate(service, 'customer_vehicle dealer customer customer_vehicle.vehicle_type', function(err, Service){
						if(!err){
							sendRsp(res, 200, 'Deleted', {service : service});
						}
					});
				} else {
					log.error('Internal error(%d): %s', res.statusCode,
							err.message);
					sendRsp(res, 500, 'Server error');
				}
			});
		}
	});
};


//  multiple delete Service


exports.deleteMultiple = function (req ,res) {
	var serviceIds = req.body.ids;	
	
	ServiceModel.remove({_id: {$in : serviceIds}}, function (err) {		
	    if (!err) {
	       	sendRsp(res, 200, 'Service Removed');
	    } else {
	        log.error('Internal error(%d): %s',res.statusCode, err.message);
	        sendRsp(res, 500, 'Server error');
	    }
	});	
};


/**
 * Update  Service
 */


exports.update = function(req, res, next) {
	//console.log('req body', req.body);	
	req.checkBody('pick_up', 'Missing Params').notEmpty();
	req.checkBody('drop', 'Missing Params').notEmpty();
	req.checkBody('job_status', 'Missing Params').notEmpty();	
	req.checkBody('customer', 'Missing Params').notEmpty();
	req.checkBody('customer_vehicle', 'Missing Params').notEmpty();
	//req.checkBody('branch', 'Missing Params').notEmpty();
	//req.checkBody('make', 'Missing Params').notEmpty();
	//req.checkBody('model', 'Missing Params').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		sendRsp(res, 400, 'Missing Param', util.inspect(errors));
		return;
	}
	var customerVehicleId = req.body.customer_vehicle;
	CustomervehiclesModel.findById(customerVehicleId)
		.exec(function (err, customerVehicle) {			
			if (!customerVehicle) {
				sendRsp(res, 404, 'Not Found');
				}
				if (!err) {

	var serviceId = req.params.id;
	ServiceModel.findById(serviceId, function(err, service) {
		if (!service) {
			sendRsp(res, 404, 'Not Found');
		}
		service.customer_vehicle		= req.body.customer_vehicle;
		service.branch					= req.body.branch;
		service.mileage					= req.body.mileage;
		service.fuel					= req.body.fuel;
		service.service_date			= req.body.service_date;
		service.pick_up 				= req.body.pick_up;
		service.drop 					= req.body.drop;
		service.comments				= req.body.comments;
		service.job_status				= req.body.job_status;
		service.job_card				= req.body.job_card;
		service.parts 					= req.body.parts;
		service.labour_charges			= req.body.labour_charges;
		service.accessories				= req.body.accessories;
		service.misc_charges			= req.body.misc_charges;
		service.completed_on			= req.body.completed_on;
		service.customer_contact		= req.body.customer_contact;
		service.customer_name			= req.body.customer_name;
		service.scheduled_at			= req.body.scheduled_at;
		service.make 					= req.body.make,
		service.model 					= req.body.model,
		service.total_amt				= req.body.total_amt,
		service.dealer 					= req.user.dealer._id;
		service.feedback				= req.body.feedback;
		service.post_service_complaints = req.body.post_service_complaints;
		service.customer_rating			= req.body.customer_rating;
		service.next_service_date		= req.body.next_service_date;
		service.customer 				= req.body.customer;


		service.save(function(err) {
			//console.log("err..",err);
			if (!err) {
				log.info("Service updated");				
				ServiceModel.deepPopulate(service, 'customer_vehicle customer dealer', function(err, service){
				if(!err){
				sendRsp(res, 200, 'Updated', {service : service});
					}
				});
			} else {
				if (err.name === 'ValidationError') {
					sendRsp(res, 400, 'Validation error');
				} else {
					sendRsp(res, 500, 'Server error');
				}
				log.error('Internal error(%d): %s', res.statusCode, err.message);
			}
		});
	
	});
} else {
						log.error('Internal error(%d): %s', res.statusCode,
								err.message);
					sendRsp(res, 500, 'Server error');
					}
});
};


exports.updateFeedback = function(req, res, next) {
	
	var serviceId = req.params.id;
	ServiceModel.findById(serviceId, function(err, service) {
		if (!service) {
			sendRsp(res, 404, 'Not Found');
		}

		service.feedback		= req.body.feedback;
		service.customer_rating = req.body.customer_rating;
		service.user 			= req.user._id;
		
		service.save(function(err) {
			if (!err) {
				log.info("FeedBack  updated");
				sendRsp(res, 200, 'Updated', {
					service : service
				});
			} else {				
				if (err.name === 'ValidationError') {
					sendRsp(res, 400, 'Validation error');
				} else {
					sendRsp(res, 500, 'Server error');
				}
				log.error('Internal error(%d): %s', res.statusCode, err.message);
			}
		});
	});
};

// serviceCounts based on InProgress, Scheduled and PaymentDue jobCard Status
exports.serviceCounts = function(req, res){	
	var statsQueryObj = {};
	var resultObj = {};
	var statsObj = {};
	var queryObj = {};
	var today = {};
	var todayObj = {};
	var yesterday = {};
	var yesterdayObj = {};
	var resultObj = {};
	var statsObj = {};
	var thisMonth = {};
	var thisMonthObj = {};
	var lastMonth = {};
	var lastMonthObj = {};
	var service_daterange = {};

	queryObj.dealer 	= new ObjectId(req.user.dealer._id);
	todayObj.dealer 	= new ObjectId(req.user.dealer._id);
	yesterdayObj.dealer = new ObjectId(req.user.dealer._id);
	thisMonthObj.dealer = new ObjectId(req.user.dealer._id);
	lastMonthObj.dealer = new ObjectId(req.user.dealer._id);	
	statsQueryObj.dealer= new ObjectId(req.user.dealer._id);

	if(req.user.role == "CUSTOMER"){
		todayObj.customer 		= new ObjectId(req.user._id);
		yesterdayObj.customer 	= new ObjectId(req.user._id);
		thisMonthObj.customer 	= new ObjectId(req.user._id);
		lastMonthObj.customer 	= new ObjectId(req.user._id);
		queryObj.customer 		= new ObjectId(req.user._id);
		statsQueryObj.customer 	= new ObjectId(req.user._id);
	}else{
		todayObj.branch 	= req.user.branch;
		yesterdayObj.branch = req.user.branch;
		thisMonthObj.branch = req.user.branch;
		lastMonthObj.branch = req.user.branch;
		queryObj.branch 	= req.user.branch;
		statsQueryObj.branch= req.user.branch;
	}

	if(req.query.branch){
		todayObj.branch 	= req.query.branch;
		yesterdayObj.branch = req.query.branch;
		thisMonthObj.branch = req.query.branch;
		lastMonthObj.branch = req.query.branch;
		queryObj.branch 	= req.query.branch;
		statsQueryObj.branch= req.query.branch;
	}

	// today DateRange	
	var from = new Date();
	var to = new Date(Date.now());
	from.setDate(to.getDate());
	from.setHours(0, 0, 0, 0);										
	to.setHours(23,59,59,59);	
	today.$gte = from;	
	today.$lt = to;
	
	// Yesterday DateRange	
	var from = new Date();
	var to = new Date(Date.now());
	from.setDate(to.getDate() - 1);
	from.setHours(0, 0, 0, 0);										
	to.setHours(0, 0, 0, 0);	
	yesterday.$gte = from;	
	yesterday.$lt = to;

	// this month
	var from = moment().startOf('month');
	var to =  moment().endOf('month');
	thisMonth.$gte = from._d;
	thisMonth.$lte = to._d;

	//Last Month
	var from = moment().subtract('month', 1).startOf('month');
	var to = moment().subtract('month', 1).endOf('month');
	lastMonth.$gte = from._d;
	lastMonth.$lte = to._d;

	todayObj.service_date = today;
	yesterdayObj.service_date = yesterday;
	thisMonthObj.service_date = thisMonth;
	lastMonthObj.service_date = lastMonth;
	
	if (!req.query.from_date || !req.query.to_date) {
		var from_date = new Date();
		from_date.setDate(from_date.getDate() - 30);
		from_date.setHours(0, 0, 0, 0);
		var to_date = new Date(Date.now());
		to_date.setHours(23, 59, 59, 999);
		service_daterange.$gte = from_date;
		service_daterange.$lte = to_date;
	} else {
		var from_date = new Date(req.query.from_date);
		from_date.setHours(0, 0, 0, 0);
		var to_date = new Date(req.query.to_date);
		to_date.setHours(23, 59, 59, 999);
		service_daterange.$gte = from_date;
		service_daterange.$lte = to_date;
	}	
	
	async.series([	
			function(callback){			
			ServiceModel.aggregate([ {
				$match : todayObj
				},{
				$group : {
					_id : {
						service_date : {
							day : {								
								$dayOfMonth: [{$add:["$service_date",19800000]}]
							},
							month : {								
								$month: [{$add:["$service_date",19800000]}]
							},
							year : {								
								$year: [{$add:["$service_date",19800000]}]
							}
						}
					},
					count: {
						$sum : 1
					},
					amount: {$sum: "$total_amt"},
				}
				}, {
					$sort : {
					_id : 1
				}
			}], function(err, requested_stats) {
				if (err) {
					sendRsp(res, 200, 'OK', { result : err });
				}else {
					if(requested_stats.length == 0){
						var today_service = [];
						var requested_stats = {};
						requested_stats.count = 0;
						requested_stats.amount = 0;
						today_service.push(requested_stats);
						statsObj.today_service = today_service;	
					}else {
						statsObj.today_service = requested_stats;
					}

					callback(null, statsObj);
				}
			});
		},
		// yeseter day service count 
		function(callback){			
			ServiceModel.aggregate([ {
					$match : yesterdayObj
				},{
					$group : {
						_id : {
							service_date : {
								day : {							
									$dayOfMonth: [{$add:["$service_date",19800000]}]
								},
								month : {							
									$month: [{$add:["$service_date",19800000]}]
								},
								year : {
									$year: [{$add:["$service_date",19800000]}]
								}
							}
						},
						count: {
							$sum : 1
						},
						amount: {$sum: "$total_amt"},			
					}
					}, {
						$sort : {
						_id : 1
					}
			}], function(err, yesterday_stats) {
				if (err) {
					sendRsp(res, 200, 'OK', { result : err });
				} else {
					if(yesterday_stats.length == 0){
						var yesterday_service = [];
						var yesterday_stats = {};
						yesterday_stats.count = 0;
						yesterday_stats.amount = 0;
						yesterday_service.push(yesterday_stats);
						statsObj.yesterday_service = yesterday_service;					
					}else {
						statsObj.yesterday_service = yesterday_stats;
					}				
					
					callback(null, statsObj);
				}
			});
		},
		// This Month
		function(callback){			
			ServiceModel.aggregate([ {
					$match : thisMonthObj
				},{
					$group : {
						_id : "null",
						count: { $sum : 1 },
						amount: { $sum: "$total_amt" }
					},

				}], function(err, thisMonth_stats) {
					if (err) {
						sendRsp(res, 200, 'OK', {
							result : err
						});
					} else {
						if(thisMonth_stats.length == 0){
							var thisMonth_service = [];
							var thisMonth_stats = {};
							thisMonth_stats.count = 0;
							thisMonth_stats.amount = 0;
							thisMonth_service.push(thisMonth_stats);
							statsObj.thisMonth_service = thisMonth_service;
						}else{
						statsObj.thisMonth_service = thisMonth_stats;
					
					}	callback(null, statsObj);
					}
				});

		},
		// Last Month
		function(callback){			
			ServiceModel.aggregate([ {
					$match : lastMonthObj
				},{
					$group : {
						_id : "null",
						count: { $sum : 1 },
						amount: { $sum: "$total_amt" }
					},

				}], function(err, lastMonth_stats) {
					if (err) {
						sendRsp(res, 200, 'OK', {
							result : err
						});
					} else {
						if(lastMonth_stats.length == 0){
							var lastMonth_service = [];
							var lastMonth_stats = {};
							lastMonth_stats.count = 0;
							lastMonth_stats.amount = 0;
							lastMonth_service.push(lastMonth_stats)
							statsObj.lastMonth_service = lastMonth_service;
						}else{
						statsObj.lastMonth_service = lastMonth_stats;
						
					}
					callback(null, statsObj);
				}
			});

		},
		// Service Status Count [INPROGRESS, PAYMENT_DUE, SCHEDULED]
		function(callback){	
			ServiceModel.aggregate([{
		            "$match": statsQueryObj,
		        },{
					"$group":{
						_id: "$job_status",	
						amount: {$sum: "$amount"},
						total: {$sum:1}
					}
				}],function(err, serviceStatusCount) {			
					if (err) {			
						sendRsp(res, 200, 'OK', { result : err });
					} else {
						var serviceCountsRsp = [];
						var serviceCounts = {};										
						var serviceStatus = ['INPROGRESS', 'PAYMENT_DUE', 'SCHEDULED'];				
						
						for(var i=0; i < serviceStatus.length; i++ ){				
							for(var j=0,flag = 0; j < serviceStatusCount.length; j++){
								if(serviceStatus[i] === serviceStatusCount[j]._id){
									serviceCounts = {
										name: serviceStatus[i],
										total: serviceStatusCount[j].total,
										amount: serviceStatusCount[j].amount
									};
									flag = 1;
								}								
							}
							if(flag != 1) {
								serviceCounts = {
									name: serviceStatus[i],
									total: 0,
									amount: 0
								};						
							}
							serviceCountsRsp.push(serviceCounts);
						}							
						statsObj.status_count = serviceCountsRsp;						
					}
					callback(null, statsObj);
			});
		},
		// Last 3 days total service breakdown stats for line chart
		function(callback) {
		queryObj.service_date = service_daterange;		
		ServiceModel.aggregate([ {
			$match : queryObj
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				},
				amount: {
					$sum : "$total_amt"
				}
			}
		}, {
			$sort : {
				date : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount: "$amount"
			}
		}], function(err, service_stats) {			
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {				
				statsObj.service_stats = service_stats;						
			}
			callback(null, statsObj);
		});
	}], function(err, results) {
			if (!err) {				
				sendRsp(res, 200, 'OK', {
					stats : statsObj
				});
			};
	});	
};

// revenueCounts for today, yesterday, thisMonth, lastMonth and paymentDue

exports.revenueCounts = function(req, res){
	var statsQueryObj = {};
	var queryObj = {};
	var today = {};
	var todayObj = {};
	var yesterday = {};
	var yesterdayObj = {};
	var resultObj = {};
	var statsObj = {};
	var thisMonth = {};
	var thisMonthObj = {};
	var lastMonth = {};
	var lastMonthObj = {};
	var service_daterange = {};	
	
	queryObj.dealer 	= new ObjectId(req.user.dealer._id);
	todayObj.dealer 	= new ObjectId(req.user.dealer._id);
	yesterdayObj.dealer = new ObjectId(req.user.dealer._id);
	thisMonthObj.dealer = new ObjectId(req.user.dealer._id);
	lastMonthObj.dealer = new ObjectId(req.user.dealer._id);	
	statsQueryObj.dealer= new ObjectId(req.user.dealer._id);

	if(req.user.role == "CUSTOMER"){
		todayObj.customer 		= new ObjectId(req.user._id);
		yesterdayObj.customer 	= new ObjectId(req.user._id);
		thisMonthObj.customer 	= new ObjectId(req.user._id);
		lastMonthObj.customer 	= new ObjectId(req.user._id);
		queryObj.customer 		= new ObjectId(req.user._id);
		statsQueryObj.customer 	= new ObjectId(req.user._id);
	}else{
		todayObj.branch 	= req.user.branch;
		yesterdayObj.branch = req.user.branch;
		thisMonthObj.branch = req.user.branch;
		lastMonthObj.branch = req.user.branch;
		queryObj.branch 	= req.user.branch;
		statsQueryObj.branch= req.user.branch;
	}

	if(req.query.branch){
		todayObj.branch 	= req.query.branch;
		yesterdayObj.branch = req.query.branch;
		thisMonthObj.branch = req.query.branch;
		lastMonthObj.branch = req.query.branch;
		queryObj.branch 	= req.query.branch;
		statsQueryObj.branch= req.query.branch;
	}
	
	// today DateRange	
	var from = new Date();
	var to = new Date(Date.now());
	from.setDate(to.getDate());
	from.setHours(0, 0, 0, 0);										
	to.setHours(23,59,59,59);	
	today.$gte = from;	
	today.$lt = to;
	
	// Yesterday DateRange	
	var from = new Date();
	var to = new Date(Date.now());
	from.setDate(to.getDate() - 1);
	from.setHours(0, 0, 0, 0);										
	to.setHours(0, 0, 0, 0);	
	yesterday.$gte = from;	
	yesterday.$lt = to;

	// this month
	var from = moment().startOf('month');
	var to =  moment().endOf('month');
	thisMonth.$gte = from._d;
	thisMonth.$lte = to._d;

	//Last Month
	var from = moment().subtract('month', 1).startOf('month');
	var to = moment().subtract('month', 1).endOf('month');
	lastMonth.$gte = from._d;
	lastMonth.$lte = to._d;

	todayObj.service_date = today;
	yesterdayObj.service_date = yesterday;
	thisMonthObj.service_date = thisMonth;
	lastMonthObj.service_date = lastMonth;

	if (!req.query.from_date || !req.query.to_date) {
		var from_date = new Date();
		from_date.setDate(from_date.getDate() - 30);
		from_date.setHours(0, 0, 0, 0);
		var to_date = new Date(Date.now());
		to_date.setHours(23, 59, 59, 999);
		service_daterange.$gte = from_date;
		service_daterange.$lte = to_date;
	} else {
		var from_date = new Date(req.query.from_date);
		from_date.setHours(0, 0, 0, 0);
		var to_date = new Date(req.query.to_date);
		to_date.setHours(23, 59, 59, 999);
		service_daterange.$gte = from_date;
		service_daterange.$lte = to_date;
	}

	async.series([
		function(callback){
			todayObj.job_status = 'PAID';
			ServiceModel.aggregate([ {
				$match : todayObj
				},{
				$group : {
					_id : {
						service_date : {
							day : {								
								$dayOfMonth: [{$add:["$service_date",19800000]}]
							},
							month : {								
								$month: [{$add:["$service_date",19800000]}]
							},
							year : {								
								$year: [{$add:["$service_date",19800000]}]
							}
						}
					},
					count: {
						$sum : 1
					},
					amount: {$sum: "$total_amt"},
				}
				}, {
					$sort : {
					_id : 1
				}
			}], function(err, requested_stats) {
				if (err) {
					sendRsp(res, 200, 'OK', { result : err });
				}else {
					if(requested_stats.length == 0){
						var today_service = [];
						var requested_stats = {};
						requested_stats.count = 0;
						requested_stats.amount = 0;
						today_service.push(requested_stats);
						statsObj.today_service = today_service;	
					}else {
						statsObj.today_service = requested_stats;
					}

					callback(null, statsObj);
				}
			});
		},
		// yeseter day service count 
		function(callback){
			yesterdayObj.job_status = 'PAID';
			ServiceModel.aggregate([ {
					$match : yesterdayObj
				},{
					$group : {
						_id : {
							service_date : {
								day : {							
									$dayOfMonth: [{$add:["$service_date",19800000]}]
								},
								month : {							
									$month: [{$add:["$service_date",19800000]}]
								},
								year : {
									$year: [{$add:["$service_date",19800000]}]
								}
							}
						},
						count: {
							$sum : 1
						},
						amount: {$sum: "$total_amt"},			
					}
					}, {
						$sort : {
						_id : 1
					}
			}], function(err, yesterday_stats) {
				if (err) {
					sendRsp(res, 200, 'OK', { result : err });
				} else {
					if(yesterday_stats.length == 0){
						var yesterday_service = [];
						var yesterday_stats = {};
						yesterday_stats.count = 0;
						yesterday_stats.amount = 0;
						yesterday_service.push(yesterday_stats);
						statsObj.yesterday_service = yesterday_service;					
					}else {
						statsObj.yesterday_service = yesterday_stats;
					}				
					
					callback(null, statsObj);
				}
			});
		},
		// This Month
		function(callback){
			thisMonthObj.job_status = 'PAID';
			ServiceModel.aggregate([ {
					$match : thisMonthObj
				},{
					$group : {
						_id : "null",
						count: { $sum : 1 },
						amount: { $sum: "$total_amt" }
					},

				}], function(err, thisMonth_stats) {
					if (err) {
						sendRsp(res, 200, 'OK', {
							result : err
						});
					} else {
						if(thisMonth_stats.length == 0){
							var thisMonth_service = [];
							var thisMonth_stats = {};
							thisMonth_stats.count = 0;
							thisMonth_stats.amount = 0;
							thisMonth_service.push(thisMonth_stats);
							statsObj.thisMonth_service = thisMonth_service;
						}else{
						statsObj.thisMonth_service = thisMonth_stats;
					
					}	callback(null, statsObj);
					}
				});

		},
		// Last Month
		function(callback){
			lastMonthObj.job_status = 'PAID';
			ServiceModel.aggregate([ {
					$match : lastMonthObj
				},{
					$group : {
						_id : "null",
						count: { $sum : 1 },
						amount: { $sum: "$total_amt" }
					},

				}], function(err, lastMonth_stats) {
					if (err) {
						sendRsp(res, 200, 'OK', {
							result : err
						});
					} else {
						if(lastMonth_stats.length == 0){
							var lastMonth_service = [];
							var lastMonth_stats = {};
							lastMonth_stats.count = 0;
							lastMonth_stats.amount = 0;
							lastMonth_service.push(lastMonth_stats)
							statsObj.lastMonth_service = lastMonth_service;
						}else{
						statsObj.lastMonth_service = lastMonth_stats;
						
					}
					callback(null, statsObj);
				}
			});

		},
		function (callback){

			queryObj.job_status = 'PAYMENT_DUE';
			ServiceModel.aggregate([
					{
						$match: queryObj
					}, {
						$group: {
							_id: "PAYMENT_DUE",
							count: {$sum: 1},
							amount: {$sum: "$total_amt"}
						}
					}],function(err, payment_due){						
						if(err){
							sendRsp(res, 200, 'Ok', {result: err});
						}else{
							if(payment_due.length ==0){
								var due_Service = [];
								var paid_amount = {};
								paid_amount._id = "PAYMENT_DUE";
								paid_amount.count = 0;
								paid_amount.amount = 0;
								due_Service.push(paid_amount);
								statsObj.payment_due = due_Service;
							}else{
								statsObj.payment_due = payment_due;
							}
							callback(null, statsObj);
						}
					});
		},
		// Last 30 days total revenue breakdown stats for line chart
		function(callback) {
		queryObj.service_date = service_daterange;
		queryObj.job_status = 'PAID';		
		ServiceModel.aggregate([ {
			$match : queryObj
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				},
				amount: {
					$sum : "$total_amt"
				}
			}
		}, {
			$sort : {
				date : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount: "$amount"
			}
		}], function(err, service_stats) {			
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {				
				statsObj.service_stats = service_stats;						
			}
			callback(null, statsObj);
		});
	}], function(err, results) {
			if (!err) {				
				resultObj.status = statsQueryObj.status;				
				sendRsp(res, 200, 'OK', {
					stats : statsObj
				});
			};
	});
}

// Customer Request Service
exports.requestStats = function(req, res){
	/*var statsQueryObj = {};*/
	var statsObj = {};
	var RequestedService = {};
	if(req.user.role == "CUSTOMER"){
		RequestedService.user = new ObjectId(req.user._id);
	}
	if(req.query.branch){
		RequestedService.branch = req.query.branch;
	}
	if(req.query.make){
		RequestedService.make = new ObjectId(req.query.make);
	}
	if(req.query.model){
		RequestedService.model = new ObjectId(req.query.model);
	}
		RequestedService.job_status = 'REQUESTED';
		ServiceModel.aggregate([ {
			$match : RequestedService
		},{
			$group : {
				_id : "$status",
				count: {
					$sum : 1
				},
			
			}
		}, {
			$sort : {
				_id : 1
			}
		}], function(err, requested_stats) {
			if (err) {
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {

					if(requested_stats.length > 0){
					statsObj.requested_stats = requested_stats;
					sendRsp(res, 200, 'OK', {
						result : statsObj
					});
				}
				else{
					statsObj.requested_stats = 0;
					sendRsp(res, 200, 'OK', {
						result : statsObj
					});
				}

			}
		});
}
// Dashboard chart
exports.statusStats = function(req, res){
	var statsObj = {};
	var RequestedService = {};
	if(req.user.role == "CUSTOMER"){
		RequestedService.user = new ObjectId(req.user._id);
	}

	if(req.query.branch){
		RequestedService.branch = req.query.branch;
	}
	
	if(req.query.make){
		RequestedService.make = new ObjectId(req.query.make);
	}

	if(req.query.model){
		RequestedService.model = new ObjectId(req.query.model);
	}
		//RequestedService.status = {$ne: 'COMPLETED_UNPAID'};
		ServiceModel.aggregate([ {
			$match : RequestedService
		},{
			$group : {
				_id : "$status",
				count: {
					$sum : 1
				},
				amount: {$sum: "$amount"},
			}
		}, {
			$sort : {
				_id : 1
			}
		}], function(err, requested_stats) {
			//console.log("requested_stats", requested_stats);
			if (err) {
				sendRsp(res, 400, 'OK', {
					result : err
				});
			} else {
				var status = ['REQUESTED', 'SCHEDULED','COMPLETED_UNPAID', 'SERVICES_DUE' ];
				var stats = [];
					if(requested_stats.length > 0){
						for(var i=0; i<status.length; i++){
							var flag = 0;
							for(var j=0; j<requested_stats.length; j++){
								if(status[i] === requested_stats[j]._id){
								stats.push({_id: status[i], count:requested_stats[j].count, amount: requested_stats[j].amount});							
								flag = 1;
								}
							}
							if(flag != 1) {					
							  stats.push({_id: status[i], count:0});													
							}
						}
					//statsObj.status_stats = requested_stats;
					sendRsp(res, 200, 'OK', {
						result : stats
					});
				}
				else{
					statsObj.requested_stats = 0;
				}

			}
		});
}
// completed stats for dashboard bar chart
/*exports.completedstats = function(req, res){
	var queryObj = {};
	
	if(req.user.role == "CUSTOMER"){
	queryObj.user = new ObjectId(req.user._id);
	}

	queryObj.status = {$in:['COMPLETED_UNPAID', 'COMPLETED_PAID']};
	var lastTwoyear = {};
	lastTwoyear.$gte = new Date(moment(moment().startOf('year').subtract(1, 'year')._d).format("YYYY-MM-DDT00:00:00"));
	lastTwoyear.$lte = new Date(moment(moment().endOf('year')._d).format("YYYY-MM-DDT23:59:59"));

	queryObj.service_date = lastTwoyear;

	ServiceModel.aggregate([{
		"$match": queryObj
	},{
		$group: {
			_id: {
				service_date : {
					month: {
						$month: [{$add: ["$service_date", 19800000]}]
					},
					year : {                                  
                          $year : [{$add: ["$service_date", 19800000]}]
                      }
				}
			},
			date: {$first: null},
			total: {$sum: 1}
		}
	},{
		$sort: {_id: 1}
	},{

		$project: {
			month: "$_id.service_date.month",
			year:  "$_id.service_date.year",
			total: 1
		}
	}], function(err, monthlyServices){
		console.log("monthlyServices", monthlyServices);
		if(err){
			callback(err);
			sendRsp(res, 400, 'OK', {result: err});
		}else {
			
			var previousYear = moment(moment().startOf('year').subtract(1,'year')._d).get('year');
			var currentYear = moment(moment().startOf('year')._d).get('year');	
			var lastYear = [];
			var thisYear = [];
			var lastYearRegArr = [];
			var thisYearRegArr = [];
			
			for(var i=0; i< monthlyServices.length; i++){
				if(monthlyServices[i].year == previousYear){
					lastYear[monthlyServices[i].month] = [monthlyServices[i].month, monthlyServices[i].count]
				}
			}
			for(var i=0; i< monthlyServices.length; i++){
				if(monthlyServices[i].year == currentYear){	
					thisYear[monthlyServices[i].month] = [monthlyServices[i].month, monthlyServices[i].total]
				}
			}
				for(var i = 1; i <= 12; i++){
						if(lastYear[i]){
							lastYearRegArr.push(lastYear[i]);
						}else{
							lastYearRegArr.push([i,0]);
						}
					}					

					for(var j = 1; j <= 12; j++){
						if(thisYear[j]){
							thisYearRegArr.push(thisYear[j]);
						}else{
							thisYearRegArr.push([j,0]);
						}
					}
					var regData = [ 
                		{ label: 'Last Year', data: lastYearRegArr },
                		{ label: 'This Year', data: thisYearRegArr }
              		];

              		sendRsp(res, 200, 'OK', {
						result : regData
					});
				}
			});
		}
*/

/* comman function*/

	function complated(queryObj,req, res, cb) {
			//var queryObj = {};
			var resultObj = {};
			var statsObj = {};
			
	
		if(req.user.role == "CUSTOMER"){
		queryObj.user = new ObjectId(req.user._id);
		}

		if(req.query.branch){
			queryObj.branch = req.query.branch;
		}
		if(req.query.make){
			queryObj.make = new ObjectId(req.query.make);
		}

		if(req.query.model){
			queryObj.model = new ObjectId(req.query.model);
		}
		/*queryObj.status = {$in:['COMPLETED_UNPAID', 'COMPLETED_PAID']};*/
		var lastTwoyear = {};
		lastTwoyear.$gte = new Date(moment(moment().startOf('year').subtract(1, 'year')._d).format("YYYY-MM-DDT00:00:00"));
		lastTwoyear.$lte = new Date(moment(moment().endOf('year')._d).format("YYYY-MM-DDT23:59:59"));

	queryObj.service_date = lastTwoyear;

			async.series([function(callback) {
				ServiceModel.aggregate([{
		"$match": queryObj
			},{
				$group: {
					_id: {
						service_date : {
							month: {
								$month: [{$add: ["$service_date", 19800000]}]
							},
							year : {                                  
		                          $year : [{$add: ["$service_date", 19800000]}]
		                      }
						}
					},
					date: {$first: null},
					total: {$sum: 1}
				}
			},{
				$sort: {_id: 1}
			},{

				$project: {
					month: "$_id.service_date.month",
					year:  "$_id.service_date.year",
					total: 1
				}
			}], function(err, monthlyServices){
				//console.log("monthlyServices", monthlyServices);
				if(err){
					callback(err);
					sendRsp(res, 400, 'OK', {result: err});
				}else {
			
			var previousYear = moment(moment().startOf('year').subtract(1,'year')._d).get('year');
			var currentYear = moment(moment().startOf('year')._d).get('year');	
			var lastYear = [];
			var thisYear = [];
			var lastYearRegArr = [];
			var thisYearRegArr = [];
			/**/
			for(var i=0; i< monthlyServices.length; i++){
				if(monthlyServices[i].year == previousYear){
					lastYear[monthlyServices[i].month] = [monthlyServices[i].month, monthlyServices[i].count]
				}
			}
			for(var i=0; i< monthlyServices.length; i++){
				if(monthlyServices[i].year == currentYear){	
					thisYear[monthlyServices[i].month] = [monthlyServices[i].month, monthlyServices[i].total]
				}
			}
				for(var i = 1; i <= 12; i++){
						if(lastYear[i]){
							lastYearRegArr.push(lastYear[i]);
						}else{
							lastYearRegArr.push([i,0]);
						}
					}					

					for(var j = 1; j <= 12; j++){
						if(thisYear[j]){
							thisYearRegArr.push(thisYear[j]);
						}else{
							thisYearRegArr.push([j,0]);
						}
					}
					var regData = [ 
                		{ label: 'Last Year', data: lastYearRegArr },
                		{ label: 'This Year', data: thisYearRegArr }
              		];

              		sendRsp(res, 200, 'OK', {
						result : regData
					});
				}
			})
			},
			], function(err, results) {
				if (!err) {
					/*sendRsp(res, 200, 'OK', {
						stats : resultObj
					});*/
					//console.log("result..",resultObj);
					cb(resultObj);
				};
			});
		}

/*end comman function*/

exports.completedstats = function(req, res){
	var queryObj = {};
	queryObj.job_status = {$in:['COMPLETED_UNPAID', 'COMPLETED_PAID']};
	complated(queryObj, req, res, function(data){
		sendRsp(res, 200, 'OK', {
			stats : data
		});
	});
}

exports.completedPaid = function(req, res){
	var queryObj = {};
	queryObj.job_status = 'COMPLETED_UNPAID';
	complated(queryObj, req, res, function(data){
		sendRsp(res, 200, 'OK', {
			stats : data
		});
	})
}



// Service spline chart (revenue- total Service)
/*
exports.totalService = function(req, res){
	var statsQueryObj = {};
	var statsObj = {};
	var service_daterange = {};
	var queryObj = {};

	if(req.user.role == "CUSTOMER"){
		statsQueryObj.user = new ObjectId(req.user._id);
	}
	if(req.query.branch){
		statsQueryObj.branch = req.query.branch;
	}
	
	if(req.query.make){
		statsQueryObj.make = new ObjectId(req.query.make);
	}

	if(req.query.model){
		statsQueryObj.model = new ObjectId(req.query.model);
	}
	if (!req.query.from_date || !req.query.to_date) {
		var from_date = new Date();
		from_date.setDate(from_date.getDate() - 30);
		from_date.setHours(0, 0, 0, 0);
		var to_date = new Date(Date.now());
		to_date.setHours(23, 59, 59, 999);
		service_daterange.$gte = from_date;
		service_daterange.$lte = to_date;
	} else {
		var from_date = new Date(req.query.from_date);
		from_date.setHours(0, 0, 0, 0);
		var to_date = new Date(req.query.to_date);
		to_date.setHours(23, 59, 59, 999);
		service_daterange.$gte = from_date;
		service_daterange.$lte = to_date;
	}
	statsQueryObj.service_date = service_daterange;
	
	async.series([function(callback) {
		console.log("stats query", statsQueryObj);
		ServiceModel.aggregate([ {
			$match : statsQueryObj
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				},
				amount: {
					$sum : "$amount"
				}
			}
		}, {
			$sort : {
				date : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount: "$amount"
			}
		}], function(err, service_stats) {
			console.log('service_dates...:',err);
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {

				console.log('service_dates...:', service_stats);
				statsObj.service_stats = service_stats;
				sendRsp(res, 200, 'OK', {
					result : statsObj
			 });
				
			}
		});
	},
	]);
}*/


// Revenue chart count 

 function revenueStats(statsQueryObj, req, res, cb){
	//var statsQueryObj = {};
	var statObj = {};
	var today = {};
	var todayObj = {};
	var yesterday = {};
	var yesterdayObj = {};
	var resultObj = {};
	var statsObj = {};
	var thisMonth = {};
	var thisMonthObj = {};
	var lastMonth = {};
	var lastMonthObj = {};
	var todaypendingObj = {};
	var service_daterange = {};
	/*var today = moment().format("YYYY-MM-DD");
	var yesterday = moment().subtract(1,'day');*/
	

// today DateRange	
	var from = new Date();
	var to = new Date(Date.now());
	from.setDate(to.getDate());
	from.setHours(0, 0, 0, 0);										
	to.setHours(23,59,59,59);	
	today.$gte = from;	
	today.$lt = to;
	
// Yesterday DateRange	
	var from = new Date();
	var to = new Date(Date.now());
	from.setDate(to.getDate() - 1);
	from.setHours(0, 0, 0, 0);										
	to.setHours(0, 0, 0, 0);	
	yesterday.$gte = from;	
	yesterday.$lt = to;

// this month
var from = moment().startOf('month');
var to =  moment().endOf('month');
thisMonth.$gte = from._d;
thisMonth.$lte = to._d;

//Last Month
var from = moment().subtract('month', 1).startOf('month');
var to = moment().subtract('month', 1).endOf('month');
lastMonth.$gte = from._d;
lastMonth.$lte = to._d;

// query obj
	
	/*if(req.user.role != "MANAGER"){			
		todayObj.user = new ObjectId(req.user._id);
		yesterdayObj.user = new ObjectId(req.user._id);
		thisMonthObj.user = new ObjectId(req.user._id);
		lastMonthObj.user = new ObjectId(req.user._id);
		statsQueryObj.user = new ObjectId(req.user._id);
	}*/

if(req.query.branch){
	todayObj.branch = req.query.branch;
	yesterdayObj.branch = req.query.branch;
	thisMonthObj.branch = req.query.branch;
	lastMonthObj.branch = req.query.branch;
	statsQueryObj.branch = req.query.branch;
}
if(req.query.make){
	todayObj.make = req.query.make;
	yesterdayObj.make = new ObjectId(req.query.make);
	thisMonthObj.make = new ObjectId(req.query.make);
	lastMonthObj.make = new ObjectId(req.query.make);
	statsQueryObj.make = new ObjectId(req.query.make);
}
if(req.query.model){
	todayObj.model 	   = new ObjectId(req.query.model);
	yesterdayObj.model = new ObjectId(req.query.model);
	thisMonthObj.model = new ObjectId(req.query.model);
	lastMonthObj.model = new ObjectId(req.query.model);
	statsQueryObj.model = new ObjectId(req.query.model);
}
todayObj.service_date = today;
yesterdayObj.service_date = yesterday;
thisMonthObj.service_date = thisMonth;
lastMonthObj.service_date = lastMonth;

if (!req.query.from_date || !req.query.to_date) {
		var from_date = new Date();
		var to_date = new Date(Date.now());
		from_date.setDate(to_date.getDate());
		from_date.setHours(0, 0, 0, 0);
		to_date.setHours(23, 59, 59, 999);
//		console.log("From and To ==>", from, to);
		service_daterange.$gte = from_date;
		service_daterange.$lte = to_date;
	} else {
		var from_date = new Date(req.query.from_date);
		from_date.setHours(0, 0, 0, 0);
		var to_date = new Date(req.query.to_date);
		to_date.setHours(23, 59, 59, 999);
		service_daterange.$gte = from_date;
		service_daterange.$lte = to_date;
	}
	statsQueryObj.service_date = service_daterange;

	   /*if(req.query.make){
			statsQueryObj.make = new ObjectId(req.query.make);
		}

	if(req.query.model){
		statsQueryObj.model = new ObjectId(req.query.model);
	}*/

	if(req.query.user){
		statsQueryObj.user = new ObjectId(req.query.user);
	}


//console.log("todayObj", todayObj);
async.series([function(callback){
	//todayObj.job_status = {$in:['COMPLETED_UNPAID', 'COMPLETED_PAID']};
	todayObj.job_status = 'PAID';
	ServiceModel.aggregate([ {
			$match : todayObj,
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							//$dayOfMonth : "$invoice_date"
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							//$month : "$invoice_date"
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							//$year : "$invoice_date"
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				count: {
					$sum : 1
				},
				amount: {$sum: "$total_amt"},
			
			}
		}, {
			$sort : {
				_id : 1
			}
		}], function(err, requested_stats) {
			if (err) {
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				if(requested_stats.length == 0){
					var today_service = [];
					var requested_stats = {};
					requested_stats.count = 0;
					requested_stats.amount = 0;
					today_service.push(requested_stats);
					statsObj.today_service = today_service;	
				}
				//statsObj.today_service = requested_stats;
			else{
				statsObj.today_service = requested_stats;
			}
				//statsObj.today_service = 0;


				//console.log("today_service count ", requested_stats);
				
				//resultObj.stats_breakdown = statsObj;
				callback(null, statsObj);
			}
		});
},

// yeseter day service count 
function(callback){
	/*if(req.user.role == "ENGINEER"){
		yesterdayObj.user = req.user._id;
	}*/
	//yesterdayObj.job_status = {$in:['COMPLETED_PAID', 'COMPLETED_UNPAID']};
	yesterdayObj.job_status = 'PAID';
	ServiceModel.aggregate([ {
			$match : yesterdayObj
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							//$dayOfMonth : "$invoice_date"
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							//$month : "$invoice_date"
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							//$year : "$invoice_date"
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				count: {
					$sum : 1
				},
				amount: {$sum: "$total_amt"},
			
			}
		}, {
			$sort : {
				_id : 1
			}
		}], function(err, yesterday_stats) {
			if (err) {
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				if(yesterday_stats.length == 0){
					var yesterday_service = [];
					var yesterday_stats = {};
					yesterday_stats.count = 0;
					yesterday_stats.amount = 0;
					yesterday_service.push(yesterday_stats);
				statsObj.yesterday_service = yesterday_service;
				//console.log("yesterday service..//..", yesterday_stats);
			}
			else{
				statsObj.yesterday_service = yesterday_stats;
			}
				/*sendRsp(res, 200, 'OK', {
					result : statObj
				});*/
				//resultObj.stats_breakdown = statsObj;
				callback(null, statsObj);
			}
		});
},
// This Month
function(callback){
	/*if(req.user.role == "ENGINEER"){
		thisMonthObj.user = req.user._id;
	}*/
	//thisMonthObj.job_status = {$in:['COMPLETED_PAID', 'COMPLETED_UNPAID']};
	thisMonthObj.job_status = 'PAID';
	ServiceModel.aggregate([ {
			$match : thisMonthObj
		},{
			$group : {
			_id : "null",
				count: { $sum : 1 },
				amount: { $sum: "$total_amt" }
			},

		}], function(err, thisMonth_stats) {
			if (err) {
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				if(thisMonth_stats.length == 0){
					var thisMonth_service = [];
					var thisMonth_stats = {};
					thisMonth_stats.count = 0;
					thisMonth_stats.amount = 0;
					thisMonth_service.push(thisMonth_stats);
					statsObj.thisMonth_service = thisMonth_service;
				}else{
				statsObj.thisMonth_service = thisMonth_stats;
				
			}callback(null, statsObj);
			}
		});

},
// Last Month
function(callback){
	/*if(req.user.role == "ENGINEER"){
		lastMonthObj.user = req.user._id;
	}*/
	//lastMonthObj.job_status = {$in:['COMPLETED_PAID', 'COMPLETED_UNPAID']};
	lastMonthObj.job_status = 'PAID';
	ServiceModel.aggregate([ {
			$match : lastMonthObj
		},{
			$group : {
			_id : "null",
				count: { $sum : 1 },
				amount: { $sum: "$total_amt" }
			},

		}], function(err, lastMonth_stats) {
			if (err) {
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				if(lastMonth_stats.length == 0){
					var lastMonth_service = [];
					var lastMonth_stats = {};
					lastMonth_stats.count = 0;
					lastMonth_stats.amount = 0;
					lastMonth_service.push(lastMonth_stats)
					statsObj.lastMonth_service = lastMonth_service;
				}else{
				statsObj.lastMonth_service = lastMonth_stats;
			}callback(null, statsObj);
			}
		});

},

function(callback){
	console.log("statsQueryObj", statsQueryObj);
		ServiceModel.aggregate([{
                        "$match":
                        	statsQueryObj,
                        },{
							"$group":{
							_id: "$job_status",	
							amount: {$sum: "$total_amt"},
							 total: {$sum:1}
							}
						}],

		function(err, ServiceStatus) {
			console.log("ServiceStatus..", ServiceStatus);
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				var serviceRsp = {};
				var serviceStatusName = [];
				var serviceStatusTotal = [];
				var serviceStatusAmount = [];
				
				var serviceStatus = ['PAYMENT_DUE', 'PAID'];
				var serviceStatusCount = ServiceStatus;
				console.log("ServiceStatus.......", ServiceStatus);
				for(var i=0; i < serviceStatus.length; i++ ){				
					for(var j=0,flag = 0; j < serviceStatusCount.length; j++){
						if(serviceStatus[i] === serviceStatusCount[j]._id){
							serviceStatusName.push(serviceStatus[i]);
							console.log("erviceStatusCount[j].......", serviceStatusCount[j]);
							serviceStatusTotal.push(serviceStatusCount[j].total);
							serviceStatusAmount.push(serviceStatusCount[j].amount);
							flag = 1;
						}								
					}
					if(flag != 1) {
						serviceStatusName.push(serviceStatus[i]);
						serviceStatusTotal.push(0);
						serviceStatusAmount.push(0);
					}
				}	
				
				serviceRsp.name = serviceStatusName;
				serviceRsp.count = serviceStatusTotal;
				serviceRsp.amount = serviceStatusAmount;
				
				
				//console.log("ServiceStatus else:", serviceRsp);
				//resultObj.ServiceStatus = serviceRsp;
				//callback(null, resultObj);
				statsObj.engineer_stats = serviceRsp;
				callback(null, statsObj);
				/*sendRsp(res, 200, 'OK', {
					result : statsObj
			 });*/
			}
		});
},
// completed status count for line chart

function(callback) {

	if(req.query.branch){
		statsQueryObj.branch = req.query.branch;
		}
		//console.log("stats query //..", statsQueryObj);
		statsQueryObj.job_status = "PAID";
		ServiceModel.aggregate([ {
			$match : statsQueryObj
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				},
				amount: {
					$sum : "$total_amt"
				}
			}
		}, {
			$sort : {
				date : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount: 1
			}
		}], function(err, completed_stats) {
			console.log('service_dates...:',completed_stats);
			if (err) {
				callback(err);
				/*sendRsp(res, 200, 'OK', {
					result : err
				});*/
			} else {

				//console.log('service_dates...:', completed_stats);
				statsObj.completed_stats = completed_stats;
				callback(null, statsObj);
				/*sendRsp(res, 200, 'OK', {
					result : statsObj
			 });*/
				//resultObj.stats_breakdown = statsObj;
				//callback(null, statsObj);

			}
		});
	},

	function(callback) {
	/*if(req.user.role == "ENGINEER"){
		statsQueryObj.user = req.user._id;
	}*/
	if(req.query.branch){
		statsQueryObj.branch = req.query.branch;
		}
		//console.log("stats query //..", statsQueryObj);
		statsQueryObj.job_status = "PAYMENT_DUE";
		ServiceModel.aggregate([ {
			$match : statsQueryObj
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				},amount: {
					$sum : "$total_amt"
				}
			}
		}, {
			$sort : {
				date : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount: 1
			}
		}], function(err, pending_status) {
			//console.log('service_dates...:',err);
			if (err) {
				callback(err);
				/*sendRsp(res, 200, 'OK', {
					result : err
				});*/
			} else {

				//console.log('service_dates...:', completed_stats);
				statsObj.pending_status = pending_status;
				callback(null, statsObj);
				/*sendRsp(res, 200, 'OK', {
					result : statsObj
			 });*/
				//resultObj.stats_breakdown = statsObj;
				//callback(null, statsObj);

			}
		});
	},
   function(callback){
	var statsQueryObj = {};
	var queryObj = {};
	//var resultsObj = {};
	
	if(req.query.branch){
		statsQueryObj.branch = req.query.branch;
		}
		
		//statsQueryObj.job_status = {$in:['COMPLETED_PAID', 'COMPLETED_UNPAID']};
		statsQueryObj.job_status = 'PAID';
		ServiceModel.aggregate([ {
			$match : statsQueryObj
		},{
			$group : {
				_id : "$model",
				count: {
					$sum : 1
				},
		
			}
		}, {
			$sort : {
				count : -1
			}

		},
		{ $limit: 5}],
		 function(err, requested_stats) {
		 	console.log("requested_stats...:", requested_stats);
			if (err) {
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {				
					if(requested_stats.length > 0){

					/*DealerModel.find({},function(err, models) {
					if (!models) {
						sendRsp(res, 404, 'Not Found');
					}
					if (!err) {*/

					var serviceStatusName = [];
					var makes = req.user.dealer.makes;
					var models = [];
					
					for(var i=0; i< makes.length; i++){
						var Model = makes[i].models;
						for(var j=0; j<Model.length; j++){
							models.push({'_id': Model[j]._id, 'name': Model[j].name});
						}
					}
					console.log("requested_stats.::", requested_stats);
					console.log("models.::", models);
					for(var i=0; i < requested_stats.length; i++ ){			
					for(var j=0,flag = 0; j < models.length; j++){
						var serviceRsp = {};
						if(requested_stats[i]._id.equals(models[j]._id)){
							console.log("serviceRsp.::", serviceRsp);
							serviceRsp.count=  requested_stats[i].count;

							serviceRsp.name = models[j].name;
							flag = 1;

							serviceStatusName.push(serviceRsp);
						}								
					}
					/*if(flag != 1) {
						serviceRsp.count= 0;
					 	serviceRsp.name = models[j].name;
					}*/
				}
			//	console.log("serviceStatusName.::", serviceStatusName);
						statsObj.top_vehicles = serviceStatusName;
						resultObj.revenue_table = statsObj;

						callback(null, statsObj);
					/*sendRsp(res, 200, 'OK', {
						result : statsObj
					});*/

					/*} else {
						log.error('Internal error(%d): %s', res.statusCode,
								err.message);
						sendRsp(res, 500, 'Server error');
					}*/
				/*});*/

					/*statsObj.requested_stats = serviceStatusName;
					sendRsp(res, 200, 'OK', {
						result : statsObj
					});*/
				}
				else{
					statsObj.requested_stats = 0;
				}

			}
		});
	},
	function(callback){
	/*if(req.user.role == "ENGINEER"){
		statsQueryObj.user = req.user._id;
	}*/
	if(req.query.branch){
		statsQueryObj.branch = req.query.branch;
	}

	  resultObj.revenue_tablestats= resultObj.revenue_table;
	  console.log("resultObj.revenue_tablestats", resultObj.revenue_tablestats);
	   callback(null, resultObj);

	}], function(err, results) {
		/*if(req.user.role == "ENGINEER"){
		statsQueryObj.user = req.user._id;
	}*/
		if (!err) {
			//console.log("if stats result", statsObj.engineer_stats.name.length);
			resultObj.job_status = statsQueryObj.job_status;
			/* count display on table*/
				var row = [];
				var Value = [];
				var line_row = [];
				var chartDates = [];
				var value = statsObj.engineer_stats;
				var count = 0;
				var amount = 0;
			  /*var a = moment(req.query.from_date).format('YYYY/MM/DD');
			  var b = moment(req.query.to_date).format('YYYY/MM/DD');
			  b = moment(b).add('days',1);
			  console.log("DATE from", a);
			  console.log("DATE to", b);
			  for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){
			  	chartDates[k] = m.format('YYYY/MM/DD');
			  	console.log("chartDates", chartDates[k]);
				k++;
			  }*/

			
			/*var keys = Object.keys(statsObj.engineer_stats);
			console.log("$scope.keys", keys);
			for(var i=0; i< keys.length; i++){
				var key = keys[i];
				var Values = value[keys[i]];				
				row.push(key);
				Value.push(Values);
			}
			console.log("row../", row);
			console.log("value../",Value);*/

			for(var i=0; i< statsObj.engineer_stats.name.length; i++){				
				var obj = {
					name: value.name[i],
					count: value.count[i],
					amount: value.amount[i]
				};

				Value.push(obj);
				/*var singleArrayValue = value[row[i]];				
				for(var k=0,m=moment(a); m.isBefore(b); m.add('days', 1)){
				var flag =0;
				for(var j=0; j<singleArrayValue.length; j++)	{
					if(m.format('YYYY/M/D') === singleArrayValue[j].date){
						line_row.push(singleArrayValue[j].count);
						k++;
						flag = 1;
					}
				}
				if(flag != 1) {						
						line_row.push(0);							
						k++;
					}
				}
				obj[row[i]] = line_row;*/
				
			}
			for(var k=0; k<Value.length; k++){
				count = count + Value[k].count;
				amount = amount + Value[k].amount;
			}
			Value.push({'name':'Total', 'count':count, 'amount': amount});
		//	console.log("Value..", Value);
			var FArray = [];
			/*var FObj = {};
			for(var i=0; i< chartDates.length; i++){
				FObj = {
						date: chartDates[i], 
						name: obj.name[i],
						count: obj.count[i],
						amount: obj.amount[i],
						total: obj.engineer_stats
					}
					FArray.push(FObj);
			}*/
			 statsObj.engineer_stats = Value;

					/*var name = FArray;
					var totalServerItems = FArray.length;*/
					/*if (!$$phase) {
						$apply();
					}*/
		/* end */

		/* count display on table*/

				var row = [];
				var Value = [];
				var obj = {};
				var chartDates = [];
				var value = resultObj.revenue_tablestats;
			  var a = moment(req.query.from_date).format('YYYY/MM/DD');
			  var b = moment(req.query.to_date).format('YYYY/MM/DD');
			  b = moment(b).add('days',1);
			 // console.log("DATE from", a);
			//  console.log("DATE to", b);
			  for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){
			  	chartDates[k] = m.format('YYYY/MM/DD');
			  //	console.log("chartDates", chartDates[k]);
				k++;
			  }

			
			var keys = Object.keys(resultObj.revenue_tablestats);
			//console.log("$scope.keys", keys);
			for(var i=0; i< keys.length; i++){
				var key = keys[i];
				var Values = value[keys[i]];

			//	console.log("value.",Values);
				row.push(key);
				Value.push(Values);
			}
			//console.log("row../", row);
			//console.log("value../",Value);

			for(var i=0; i< row.length; i++){
				var line_row = [];
				var singleArrayValue = value[row[i]];
				for(var k=0,m=moment(a); m.isBefore(b); m.add('days', 1)){
				var flag =0;
				for(var j=0; j<singleArrayValue.length; j++)	{
					if(m.format('YYYY/M/D') === singleArrayValue[j].date){
						var rev = {};
						rev = {
						count: singleArrayValue[j].count,
						amount: singleArrayValue[j].amount
					}
					line_row.push(rev);
						k++;
						flag = 1;
					}
				}
				if(flag != 1) {	
					var rev = {};
						rev = {
						count: 0,
						amount: 0
					}					
						line_row.push(rev);							
						k++;
					}
				}
				obj[row[i]] = line_row;

			}
		//	console.log("line_chart..", obj);
			var FArray = [];
			var FObj = {};
			for(var i=0; i< chartDates.length; i++){
				FObj = {
						date: chartDates[i], 
						/*scheduled: obj.scheduled_stats[i],*/
						completed: obj.completed_stats[i],
						pending: obj.pending_status[i],
						total: obj.completed_stats[i].amount + obj.pending_status[i].amount,
						count: obj.completed_stats[i].count + obj.pending_status[i].count,
					}
					FArray.push(FObj);
			}
		//	console.log("FArray", FArray);
			 statsObj.revenue_tablestats = FArray;
			 statsObj.revenue_tablelength = FArray.length;
					/*var completed_stats = FArray;
					var totalServerItems = FArray.length;*/
					/*if (!$$phase) {
						$apply();
					}*/
		/* end */

			/*if(statsObj.revenue_tablestats < statsObj.revenue_tablelength){*/

			var RevLimit = req.query.limit;
			var RevOffset = req.query.offset;
			var table_stats = [];
			var lastIndex = parseInt(RevOffset) + parseInt(RevLimit);
			var end =  lastIndex > statsObj.revenue_tablestats.length ? 
				statsObj.revenue_tablestats.length : lastIndex;
		//	console.log("end", end);
		//	console.log("lastIndex", lastIndex);
			var index = 0;
			for(i=RevOffset; i < end; i++){
				table_stats[index] = statsObj.revenue_tablestats[i];
				index++;
			}
			 statsObj.revenue_tablestats = table_stats;

			/*}*/
		//	console.log(".revenue_tablelength", statsObj.revenue_tablelength);
			cb(statsObj);
			/*sendRsp(res, 200, 'OK', {
				stats : statsObj
			});*/
		};
	})
}
/* end revenue */
/* comman function revenue*/
exports.revenue = function(req, res){
	var queryObj = {};
	revenueStats(queryObj, req, res, function(data){
		console.log("data rev..", data);
		sendRsp(res, 200, 'OK', {
			stats : data
		});
	});
}

exports.revenueExport = function(req, res){
	var queryObj = {};
	if(req.query.branch){
		queryObj.branch = req.query.branch;
	}
	revenueStats(queryObj, req, res, function(data){
		var dateChart = {};
		dateChart.todayStats = data.today_service,
		dateChart.yesterdayStats = data.yesterday_service,
		dateChart.thisMonthStats = data.thisMonth_service,
		dateChart.lastMonthStats = data.lastMonth_service

		var revenueStatus = {}
		revenueStatus.pending = data.pending_status,
		revenueStatus.completed = data.completed_stats

		var revenueStatsRsp = dateChart;
		var engineerStatus = data.engineer_stats;
		/*console.log("engineerStatus", engineerStatus[0].name);*/
		var Dates = [];
		var rspKey = [];
		var rspValue = [];
		var Data = [];
		var value = revenueStatus;
		var arrayOne = ["Date"];
		var obj = {};
		var objs= {};
		var a = moment(req.query.from_date).format('YYYY/MM/DD');
		var b = moment(req.query.to_date).format('YYYY/MM/DD');	
			b = moment(b).add('days',1);


		for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){
			 Dates[k] = m.format('YYYY/MM/DD');
			 k++;
		}
		if(revenueStatus){
			var headingArr = ['Date',  'Payment_Due Count', 'Payment_Due Amount', 
							'Paid Count', 'Paid Amount', 'Total Amount']
		}
		var keys = Object.keys(revenueStatus);
		for(var i = 0; i < keys.length ; i++ ){						
				var Key = keys[i];
				var Value = value[keys[i]];							
				rspKey.push(Key);
				rspValue.push(Value);
			}

		var status_row = [];
		var status_values = [];
		var total = 0;
		for(var l= 0; l< engineerStatus.length; l++){
			status_row.push(engineerStatus[l].name);
			status_values.push(engineerStatus[l].amount);

		}
		console.log("status_row", status_row);

		for(var i=0; i < rspKey.length; i++){
				var line_row = [];	
				var count_row = [];
				var singleArrayValue = value[rspKey[i]];										
				for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){	
					var flag = 0;											
					for(var j = 0; j < singleArrayValue.length; j++) {												
						if(m.format('YYYY/M/D') === singleArrayValue[j].date) {
							count_row.push(singleArrayValue[j].count);
							line_row.push(singleArrayValue[j].amount);	
							k++;
							flag = 1;
						}
					}
					

					if(flag != 1) {
						count_row.push(0);						
						line_row.push(0);
						k++;
					}
				}	
				objs[rspKey[i]] = count_row;
				obj[rspKey[i]] = line_row;
				

			} 
			
			var data = [["Service Module"],[],["Revenue Status"],[], status_row, status_values,/*serivceStatusRsp.name, serivceStatusRsp.count
			           ,*/[],[],headingArr];	
			  for(var i=0; i < Dates.length; i++){
				var singleRow = [];
				singleRow.push(Dates[i]);
				var total = 0;
				var totals =0;
				for(var j=0; j < rspKey.length; j++){
					var arr = obj[rspKey[j]];
					var arrs = objs[rspKey[j]];
					
					singleRow.push(arrs[i]);
					totals =totals + arrs[i];
					
					singleRow.push(arr[i]);
					total = total + arr[i];	

				}	
				singleRow.push(total);
				data.push(singleRow);
			}
			console.log("data", data);
			var ws_name = "RevenueReports"
			var wscols = [{wch:20},{wch:20},{wch:20},{wch:20},{wch:20},{wch:20}];	
			var wsmerge = [{s:{c:0,r:0},e:{c:3,r:0}}];
		
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
			console.log("data", ws);
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = ws;
			
			ws['!cols'] = wscols;
			ws['!merges'] = wsmerge;
			
			var wopts = { bookType:'xlsx', bookSST:true, type:'binary' };
			var wbBuf = XLSX.write(wb, wopts);
			
			sendRsp(res, 200, 'Success', wbBuf);
		//console.log("dateChart", dateChart);
		/*sendRsp(res, 200, 'OK', {
			stats : data
		});*/
	});
};
/*end */
/* Engineer Export */

exports.engineerExport = function(req, res){
	var queryObj = {};
	revenueStats(queryObj, req, res, function(data){
		/*var dateChart = {};
		dateChart.todayStats = data.today_service,
		dateChart.yesterdayStats = data.yesterday_service,
		dateChart.thisMonthStats = data.thisMonth_service,
		dateChart.lastMonthStats = data.lastMonth_service
*/
		var revenueStatus = {};
		revenueStatus.pending = data.pending_status,
		revenueStatus.completed = data.completed_stats

		/*var revenueStatsRsp = dateChart;*/
		var engineerStatus = data.engineer_stats;
		/*console.log("engineerStatus", engineerStatus[0].name);*/
		var Dates = [];
		var rspKey = [];
		var rspValue = [];
		var Data = [];
		var value = revenueStatus;
		var arrayOne = ["Date"];
		var obj = {};
		var objs= {};
		var a = moment(req.query.from_date).format('YYYY/MM/DD');
		var b = moment(req.query.to_date).format('YYYY/MM/DD');	
			b = moment(b).add('days',1);


		for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){
			 Dates[k] = m.format('YYYY/MM/DD');
			 k++;
		}
		if(revenueStatus){
			var headingArr = ['Date',  'Payment_Due Count', 'Payment_Due Amount', 
							'Paid Count', 'Paid Amount', 'Total Amount']
		}
		var keys = Object.keys(revenueStatus);
		for(var i = 0; i < keys.length ; i++ ){						
				var Key = keys[i];
				var Value = value[keys[i]];							
				rspKey.push(Key);
				rspValue.push(Value);
			}

		var status_row = [];
		var status_values = [];
		var total = 0;
		for(var l= 0; l< engineerStatus.length; l++){
			status_row.push(engineerStatus[l].name);
			status_values.push(engineerStatus[l].count);

		}
		console.log("status_row", status_row);

		for(var i=0; i < rspKey.length; i++){
				var line_row = [];	
				var count_row = [];
				var singleArrayValue = value[rspKey[i]];										
				for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){	
					var flag = 0;											
					for(var j = 0; j < singleArrayValue.length; j++) {												
						if(m.format('YYYY/M/D') === singleArrayValue[j].date) {
							count_row.push(singleArrayValue[j].count);
							line_row.push(singleArrayValue[j].amount);	
							k++;
							flag = 1;
						}
					}
					

					if(flag != 1) {
						count_row.push(0);						
						line_row.push(0);
						k++;
					}
				}	
				objs[rspKey[i]] = count_row;
				obj[rspKey[i]] = line_row;
			} 
			
			var data = [["Service Module"],[],["Engineer Status"],[], status_row, status_values,/*serivceStatusRsp.name, serivceStatusRsp.count
			           ,*/[],[],headingArr];	
			  for(var i=0; i < Dates.length; i++){
				var singleRow = [];
				singleRow.push(Dates[i]);
				var total = 0;
				var totals =0;
				for(var j=0; j < rspKey.length; j++){
					var arr = obj[rspKey[j]];
					var arrs = objs[rspKey[j]];
					
					singleRow.push(arrs[i]);
					totals =totals + arrs[i];
					
					singleRow.push(arr[i]);
					total = total + arr[i];	
				}	
				singleRow.push(total);
				data.push(singleRow);
			}
			console.log("data", data);
			var ws_name = "RevenueReports";
			var wscols = [{wch:20},{wch:20},{wch:20},{wch:20},{wch:20},{wch:20}];	
			var wsmerge = [{s:{c:0,r:0},e:{c:3,r:0}}];
		
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
			console.log("data", ws);
			wb.SheetNames.push(ws_name); 
			wb.Sheets[ws_name] = ws;
			
			ws['!cols'] = wscols;
			ws['!merges'] = wsmerge;
			
			var wopts = { bookType:'xlsx', bookSST:true, type:'binary'};
			var wbBuf = XLSX.write(wb, wopts);
			
			sendRsp(res, 200, 'Success', wbBuf);
			
	});
};
/* End Engineer Export*/


/* Top 5 Vehicles */

exports.topVehicles = function(req, res){
	var statsQueryObj = {};
	var statsObj = {};
	var queryObj = {};
	
	if(req.query.branch){
		statsQueryObj.branch = req.query.branch;
	}
	if(req.query.make){
		statsQueryObj.make = new ObjectId(req.query.make);
	}
	if(req.query.model){
		statsQueryObj.model = new ObjectId(req.query.model);
	}
	//var resultsObj = {};

		var RequestedService = {};
		/*RequestedService.status = 'REQUESTED';*/
		ServiceModel.aggregate([ {
			$match : statsQueryObj
		},{
			$group : {
				_id : "$model",
				count: {
					$sum : 1
				},
		
			}
		}, {
			$sort : {
				count : -1
			}

		},
		{ $limit: 5}
		/*,{
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount : "$amount"
			}
		}*/], function(err, requested_stats) {
			//console.log("requested_stats Top Vechicles", requested_stats);
			if (err) {
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {				
					if(requested_stats.length > 0){

					var makes = req.user.dealer.makes;	
					var serviceStatusName = [];
					var models = [];

					for(var i = 0; i < makes.length; i++ ){			
							var Model = makes[i].models
							for(var j = 0; j < Model.length; j++ ){
								models.push({'_id': Model[j]._id,'name': Model[j].name});	
								console.log("models", models);
							}
					}
					
					for(var i=0; i < requested_stats.length; i++ ){	
					for(var j=0,flag = 0; j < models.length; j++){
						var serviceRsp = {};
						if(requested_stats[i]._id.equals(models[j]._id)){
							//console.log("serviceRsp.::", serviceRsp);
							serviceRsp.count=  requested_stats[i].count;
							serviceRsp.name = models[j].name;
							flag = 1;

							serviceStatusName.push(serviceRsp);
						}								
					}
				}
						statsObj.top_vehicles = serviceStatusName;
					sendRsp(res, 200, 'OK', {
						result : statsObj
					});
				}
				else{
					statsObj.requested_stats = 0;
				}

			}
		});
}
/* end */

/* Revenue Completed top vehicles */

exports.topCompletedVehicles = function(req, res){
	var CompletedService = {};
	var statsObj = {};
	var queryObj = {};
	
	if(req.query.branch){
		CompletedService.branch = req.query.branch;
	}
	if(req.query.make){
		CompletedService.make = new ObjectId(req.query.make);
	}

	if(req.query.model){
		CompletedService.model = new ObjectId(req.query.model);
	}
	//var resultsObj = {};

	var CompletedService = {};
		//CompletedService.job_status = {$in:['COMPLETED_PAID', 'COMPLETED_UNPAID']};
		CompletedService.job_status = 'PAID';
		ServiceModel.aggregate([ {
			$match : CompletedService
		},{
			$group : {
				_id : "$model",
				count: {
					$sum : 1
				},
		
			}
		}, {
			$sort : {
				count : -1
			}

		},
		{ $limit: 5}
		], function(err, requested_stats) {
			if (err) {
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {				
					if(requested_stats.length > 0){

					/*ModelModel.find({},function(err, models) {
					if (!models) {
						sendRsp(res, 404, 'Not Found');
					}
					if (!err) {*/
					
					var makes = req.user.dealer.makes;
					
					var serviceStatusName = [];
					var  models = [];
					for(var i = 0; i < makes.length; i++ ){			
							var Model = makes[i].models
							for(var j = 0; j < Model.length; j++ ){
								models.push({'_id': Model[j]._id,'name': Model[j].name});	
								console.log("models", models);
							}
					}
											
					for(var i=0; i < requested_stats.length; i++ ){				
					for(var j=0,flag = 0; j < models.length; j++){
						var serviceRsp = {};
						if(requested_stats[i]._id.equals(models[j]._id)){
							console.log("serviceRsp.::", serviceRsp);
							serviceRsp.count=  requested_stats[i].count;
							serviceRsp.name = models[j].name;
							flag = 1;

							serviceStatusName.push(serviceRsp);
						}								
					}
				}
				console.log("serviceStatusName.::", serviceStatusName);
						statsObj.top_vehicles = serviceStatusName;
					sendRsp(res, 200, 'OK', {
						result : statsObj
					});
				/*	}
				});*/
				}
				else{
					statsObj.requested_stats = 0;
				}

			}
		});
}
/* end */

/*async.series([function(callback) {
		ServiceModel.count(todayObj, function(err, total) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				console.log("total_.::" + total);
				statObj.today_service = total;
				callback(null, statObj);
			}
		});
	},*/

	/*function(callback) {
		ServiceModel.count(yesterdayObj, function(err, total) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				console.log("total_.::" + total);
				statObj.yesterday_service = total;
				callback(null, statObj);
			}
		});
	},*/

	/*function(callback) {
	ServiceModel.aggregate([ {
			$match : statsQueryObj
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				},
				amount: {
					$sum : "$amount"
				}
			}
		}, {
			$sort : {
				date : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount: "$amount"
			}
		}], function(err, service_stats) {
			console.log("queryObj..:", service_stats);
			console.log('service_dates...:', err);
			if (err) {*/

				/*callback(err);*/

				/*sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {

				console.log('service_dates...:', service_stats);
				statObj.service_stats = service_stats;
				sendRsp(res, 200, 'OK', {
					result : statObj
				});*/
				//resultObj.stats_breakdown = statsObj;
				/*callback(null, statsObj);*/

			/*}
		});
	}], function(err, results) {
		if (!err) {
			console.log("if stats result", resultObj);*/
			//resultObj.status = statsQueryObj.status;
			/*cb(resultObj);*/
		/*	statObj.results = results;
			sendRsp(res, 200, 'OK', {
				stats : statObj
			});
		};
	});*/

/*}*/

// common stats for service 
/*
function stats(statsQueryObj, res, cb) {
	console.log("statsQueryObj", statsQueryObj);
	var queryObj = {};
	var resultObj = {};
	var statsObj = {};
	
	if(statsQueryObj.status){
		console.log('statsQueryObj.status', statsQueryObj);
		async.series([function(callback) {
		ServiceModel.count(statsQueryObj, function(err, total) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				console.log("total_invoices:" + total);
				resultObj.total_service = total;
				callback(null, resultObj);
			}
		});
	},function(callback) {
		
		ServiceModel.aggregate([{
		                        "$match":
		                        	statsQueryObj,
		                      
								},{
									"$group":{
									_id: "$status",	
									amount: {$sum: "$amount"},
									 total: {$sum: 1 }
									}
								}],

		function(err, ServiceStatus) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				var serviceRsp = {};
				var serviceStatusName = [];
				var serviceStatusTotal = [];
				var serviceStatusAmount = [];
				var serviceStatus = ['REQUESTED', 'SCHEDULED', 'PENDING','COMPLETED'];
				var serviceStatusCount = ServiceStatus;
				
				for(var i=0; i < serviceStatus.length; i++ ){				
					for(var j=0,flag = 0; j < serviceStatusCount.length; j++){
						if(serviceStatus[i] === serviceStatusCount[j]._id){
							serviceStatusName.push(serviceStatus[i]);
							serviceStatusTotal.push(serviceStatusCount[j].total);
							serviceStatusAmount.push(serviceStatusCount[j].amount);
							flag = 1;
						}								
					}
					if(flag != 1) {
						serviceStatusName.push(serviceStatus[i]);
						serviceStatusTotal.push(0);
						serviceStatusAmount.push(0);
					}
				}	
				
				serviceRsp.name = serviceStatusName;
				serviceRsp.count = serviceStatusTotal;
				serviceRsp.amount = serviceStatusAmount;
				
				
				console.log("ServiceStatus Rsp:", serviceRsp);
				resultObj.ServiceStatus = serviceRsp;
				callback(null, resultObj);
			}
		});
	},
	function(callback) {
		
		console.log("stats query",statsQueryObj);
		ServiceModel.aggregate([ {
			$match : statsQueryObj
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				}
			}
		}, {
			$sort : {
				date : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
			}
		}], function(err, service_stats) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				console.log('service_date...:', service_stats);
				statsObj.service_stats = service_stats;
				resultObj.stats_breakdown = statsObj;
				callback(null, statsObj);
			}
		});
	},
	
	], function(err, results) {
		if (!err) {
			console.log("if stats result", resultObj);
			resultObj.status = statsQueryObj.status;
			cb(resultObj);
		};
	});

	} else {
		console.log("queryObj...", statsQueryObj);
	async.series([function(callback) {
		ServiceModel.count(statsQueryObj, function(err, total) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				
				resultObj.total_service = total;
				callback(null, resultObj);
			}
		});
	},
	function(callback) {
		
		ServiceModel.aggregate([{
		                        "$match":
		                        	statsQueryObj,
		                      //"status":{$in: Status}
		                        	
								},{
									"$group":{
									_id: "$status",	
									amount: {$sum: "$amount"},
									 total: {$sum:1}
									}
								}],

		function(err, ServiceStatus) {
			console.log("ServiceStatus...", ServiceStatus);
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				var serviceRsp = {};
				var serviceStatusName = [];
				var serviceStatusTotal = [];
				var serviceStatusAmount = [];							
				var serviceStatus = ['REQUESTED', 'SCHEDULED', 'PENDING','COMPLETED'];
				var serviceStatusCount = ServiceStatus;
				console.log("ServiceStatus.......", ServiceStatus);
				for(var i=0; i < serviceStatus.length; i++ ){				
					for(var j=0,flag = 0; j < serviceStatusCount.length; j++){
						if(serviceStatus[i] === serviceStatusCount[j]._id){
							serviceStatusName.push(serviceStatus[i]);
							serviceStatusTotal.push(serviceStatusCount[j].total);
							serviceStatusAmount.push(serviceStatusCount[j].amount);
							flag = 1;
						}								
					}
					if(flag != 1) {
						serviceStatusName.push(serviceStatus[i]);
						serviceStatusTotal.push(0);
						serviceStatusAmount.push(0);
					}
				}	
				
				serviceRsp.name = serviceStatusName;
				serviceRsp.count = serviceStatusTotal;
				serviceRsp.amount = serviceStatusAmount;
				
				
				console.log("ServiceStatus else:", serviceRsp);
				resultObj.ServiceStatus = serviceRsp;
				callback(null, resultObj);
			}
		});
	},

	// Service stats using date 
	
	function(callback) {
		console.log("stats query", statsQueryObj);
		ServiceModel.aggregate([ {
			$match : statsQueryObj
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				},
				amount: {
					$sum : "$amount"
				}
			}
		}, {
			$sort : {
				date : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount: "$amount"
			}
		}], function(err, service_stats) {
			console.log('service_dates...:',err );
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {

				console.log('service_dates...:', service_stats);
				statsObj.service_stats = service_stats;
				resultObj.stats_breakdown = statsObj;
				callback(null, statsObj);

			}
		});
	},

//	SHOW SERVICE STATS USING STATUS(REQUESTED, COMPLETED ...)
	
	function(callback) {
		var RequestedService = statsQueryObj;
		RequestedService.status = 'REQUESTED';
		ServiceModel.aggregate([ {
			$match : RequestedService
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							//$dayOfMonth : "$invoice_date"
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							//$month : "$invoice_date"
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							//$year : "$invoice_date"
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				},
				amount: {
					$sum : "$amount"
				}
			}
		}, {
			$sort : {
				_id : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount : "$amount"
			}
		}], function(err, requested_stats) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
//				console.log("query_object......", queryObj);
				console.log('requested_stats...:', requested_stats);
				statsObj.requested_stats = requested_stats;
				resultObj.stats_breakdown = statsObj;
				callback(null, statsObj);
//				console.log('result_obj...:', resultObj);
			}
		});
	},
	
	function(callback) {
		var SuheduledService = statsQueryObj;
		SuheduledService.status = 'SCHEDULED';
		ServiceModel.aggregate([ {
			$match : SuheduledService
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							//$dayOfMonth : "$invoice_date"
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							//$month : "$invoice_date"
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							//$year : "$invoice_date"
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				},
				amount: {
					$sum : "$amount"
				}
			}
		}, {
			$sort : {
				_id : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount: "$amount"
			}
		}], function(err, suheduled_stats) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
//				console.log("query_object......", queryObj);
				console.log('suheduled_stats...:', suheduled_stats);
				statsObj.suheduled_stats = suheduled_stats;
				resultObj.stats_breakdown = statsObj;
				callback(null, statsObj);
//				console.log('result_obj...:', resultObj);
			}
		});
	},
	function(callback) {
		var PendingService = statsQueryObj;
		PendingService.status = 'PENDING';
		ServiceModel.aggregate([ {
			$match : PendingService
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							//$dayOfMonth : "$invoice_date"
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							//$month : "$invoice_date"
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							//$year : "$invoice_date"
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				},
				amount: {
					$sum : "$amount"
				}
			}
		}, {
			$sort : {
				_id : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount: "$amount"
			}
		}], function(err, pending_service) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
//				console.log("query_object......", queryObj);
				console.log('pending_service...:', pending_service);
				statsObj.pending_service = pending_service;
				resultObj.stats_breakdown = statsObj;
				callback(null, statsObj);
//				console.log('result_obj...:', resultObj);
			}
		});
	},
// COMPLETED STATS
	function(callback) {
		var CompletedService = statsQueryObj;
		
		CompletedService.status = 'COMPLETED';
		ServiceModel.aggregate([ {
			$match : CompletedService
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							//$dayOfMonth : "$invoice_date"
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							//$month : "$invoice_date"
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							//$year : "$invoice_date"
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				},
				amount: {
					$sum : "$amount"
				}
			}
		}, {
			$sort : {
				_id : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount: "$amount"
			}
		}], function(err, completed_stats) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
//				console.log("query_object......", queryObj);
				console.log('completed_stats...:', completed_stats);
				statsObj.completed_stats = completed_stats;
				resultObj.stats_breakdown = statsObj;
				callback(null, statsObj);
//				console.log('result_obj...:', resultObj);
			}
		});
	},



	], function(err, results) {
		if (!err) {
			console.log("stats result", resultObj);
			cb(resultObj);
			
		};
	});
}
};
*/

// second comman function

/*function stats(statsQueryObj, res, cb) {
	console.log("statsQueryObj", statsQueryObj);
	var queryObj = {};
	var resultObj = {};
	var statsObj = {};*/
	
	/*if(statsQueryObj.status){
		console.log('statsQueryObj.status', statsQueryObj);
		async.series([function(callback) {
		ServiceModel.count(statsQueryObj, function(err, total) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				console.log("total_invoices:" + total);
				resultObj.total_service = total;
				callback(null, resultObj);
			}
		});
	},function(callback) {
		
		ServiceModel.aggregate([{
		                        "$match":
		                        	statsQueryObj,
		                      
								},{
									"$group":{
									_id: "$status",	
									amount: {$sum: "$amount"},
									 total: {$sum: 1 }
									}
								}],

		function(err, ServiceStatus) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				var serviceRsp = {};
				var serviceStatusName = [];
				var serviceStatusTotal = [];
				var serviceStatusAmount = [];
				var serviceStatus = ['SCHEDULED', 'PENDING','COMPLETED'];
				var serviceStatusCount = ServiceStatus;
				
				for(var i=0; i < serviceStatus.length; i++ ){				
					for(var j=0,flag = 0; j < serviceStatusCount.length; j++){
						if(serviceStatus[i] === serviceStatusCount[j]._id){
							serviceStatusName.push(serviceStatus[i]);
							serviceStatusTotal.push(serviceStatusCount[j].total);
							serviceStatusAmount.push(serviceStatusCount[j].amount);
							flag = 1;
						}								
					}
					if(flag != 1) {
						serviceStatusName.push(serviceStatus[i]);
						serviceStatusTotal.push(0);
						serviceStatusAmount.push(0);
					}
				}	
				
				serviceRsp.name = serviceStatusName;
				serviceRsp.count = serviceStatusTotal;
				serviceRsp.amount = serviceStatusAmount;
				
				
				console.log("ServiceStatus Rsp:", serviceRsp);
				resultObj.ServiceStatus = serviceRsp;
				callback(null, resultObj);
			}
		});
	},
	function(callback) {
		
		console.log("stats query",statsQueryObj);
		ServiceModel.aggregate([ {
			$match : statsQueryObj
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				}
			}
		}, {
			$sort : {
				date : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
			}
		}], function(err, service_stats) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				console.log('service_date...:', service_stats);
				statsObj.service_stats = service_stats;
				resultObj.stats_breakdown = statsObj;
				callback(null, statsObj);
			}
		});
	},
	
	], function(err, results) {
		if (!err) {
			console.log("if stats result", resultObj);
			resultObj.status = statsQueryObj.status;
			cb(resultObj);
		};
	});

	} else{
		console.log("queryObj...", statsQueryObj);*/ 


// stats Function 

	function stats(statsQueryObj, req, res, cb) {
	
	var queryObj = {};
	var resultObj = {};
	var statsObj = {};
	
	async.series([function(callback) {
		statsQueryObj.job_status = {$ne: "INPROGRESS"};
		ServiceModel.count(statsQueryObj, function(err, total) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				resultObj.total_service = total;
				callback(null, resultObj);
			}
		});
	},
	function(callback) {
		
		ServiceModel.aggregate([{
		                        "$match":
		                        	statsQueryObj
		                        },{
									"$group":{
									_id: "$job_status",	
									amount: {$sum: "$amount"},
									 total: {$sum:1}
									}
								}
								],

		function(err, ServiceStatus) {
			console.log("ServiceStatus...", ServiceStatus);
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
				var serviceRsp = {};
				var serviceStatusName = [];
				var serviceStatusTotal = [];
				var serviceStatusAmount = [];							
				var serviceStatus = [ 'SCHEDULED', 'PAYMENT_DUE','PAID'];
				var serviceStatusCount = ServiceStatus;
				console.log("ServiceStatus.......", ServiceStatus);
				for(var i=0; i < serviceStatus.length; i++ ){				
					for(var j=0,flag = 0; j < serviceStatusCount.length; j++){
						if(serviceStatus[i] === serviceStatusCount[j]._id){
							serviceStatusName.push(serviceStatus[i]);
							serviceStatusTotal.push(serviceStatusCount[j].total);
							serviceStatusAmount.push(serviceStatusCount[j].amount);
							flag = 1;
						}								
					}
					if(flag != 1) {
						serviceStatusName.push(serviceStatus[i]);
						serviceStatusTotal.push(0);
						serviceStatusAmount.push(0);
					}
				}	
				
				serviceRsp.name = serviceStatusName;
				serviceRsp.count = serviceStatusTotal;
				serviceRsp.amount = serviceStatusAmount;
				
				
				console.log("ServiceStatus else:", serviceRsp);
				resultObj.ServiceStatus = serviceRsp;
				callback(null, resultObj);
			}
		});
	},

	// Service stats using date 
	
	function(callback) {
		console.log("stats query", statsQueryObj);
		ServiceModel.aggregate([ {
			"$match" : statsQueryObj
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				},
				amount: {
					$sum : "$amount"
				}
			}
		}, {
			$sort : {
				date : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount: "$amount"
			}
		}], function(err, service_stats) {
			console.log('service_dates...:',err );
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {

				console.log('service_dates...:', service_stats);
				statsObj.service_stats = service_stats;
				resultObj.stats_breakdown = statsObj;
				callback(null, statsObj);

			}
		});
	},

	function(callback) {
		var SuheduledService = statsQueryObj;
		SuheduledService.job_status = 'SCHEDULED';
		ServiceModel.aggregate([ {
			$match : SuheduledService
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							//$dayOfMonth : "$invoice_date"
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							//$month : "$invoice_date"
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							//$year : "$invoice_date"
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				},
				amount: {
					$sum : "$amount"
				}
			}
		}, {
			$sort : {
				_id : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount: "$amount"
			}
		}], function(err, scheduled_stats) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
//				console.log("query_object......", queryObj);
				console.log('scheduled_stats...:', scheduled_stats);
				statsObj.scheduled_stats = scheduled_stats;
				resultObj.stats_breakdown = statsObj;
				callback(null, statsObj);
//				console.log('result_obj...:', resultObj);
			}
		});
	},
	function(callback) {
		var PendingService = statsQueryObj;
		PendingService.job_status = 'PAYMENT_DUE';
		ServiceModel.aggregate([ {
			$match : PendingService
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							//$dayOfMonth : "$invoice_date"
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							//$month : "$invoice_date"
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							//$year : "$invoice_date"
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				},
				amount: {
					$sum : "$amount"
				}
			}
		}, {
			$sort : {
				_id : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount: "$amount"
			}
		}], function(err, pending_service) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
//				console.log("query_object......", queryObj);
				console.log('pending_service...:', pending_service);
				statsObj.pending_service = pending_service;
				resultObj.stats_breakdown = statsObj;
				callback(null, statsObj);
//				console.log('result_obj...:', resultObj);
			}
		});
	},
// COMPLETED STATS
	function(callback) {
		var CompletedService = statsQueryObj;
		
		CompletedService.job_status = 'PAID';
		ServiceModel.aggregate([ {
			$match : CompletedService
		},{
			$group : {
				_id : {
					service_date : {
						day : {
							//$dayOfMonth : "$invoice_date"
							$dayOfMonth: [{$add:["$service_date",19800000]}]
						},
						month : {
							//$month : "$invoice_date"
							$month: [{$add:["$service_date",19800000]}]
						},
						year : {
							//$year : "$invoice_date"
							$year: [{$add:["$service_date",19800000]}]
						}
					}
				},
				service_count : {
					$sum : 1
				},
				date : {
					$first : "$service_date"
				},
				count : {
					$sum : 1
				},
				amount: {
					$sum : "$amount"
				}
			}
		}, {
			$sort : {
				_id : 1
			}
		}, {
			$project : {
				date : {
					$concat : [ {
						$substr : [ "$_id.service_date.year", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.month", 0, -1 ]
					}, "/", {
						$substr : [ "$_id.service_date.day", 0, -1 ]
					}],
				},
				count : 1,
				amount: "$amount"
			}
		}], function(err, completed_stats) {
			if (err) {
				callback(err);
				sendRsp(res, 200, 'OK', {
					result : err
				});
			} else {
//				console.log("query_object......", queryObj);
				console.log('completed_stats...:', completed_stats);
				statsObj.completed_stats = completed_stats;
				resultObj.stats_breakdown = statsObj;
				callback(null, statsObj);
//				console.log('result_obj...:', resultObj);
			}
		});
	}
/*function(callback){
	  resultObj.table_stats= resultObj.stats_breakdown;
	 callback(null, resultObj);

}*/

	], function(err, results) {
		if (!err) {
			console.log("stats result", resultObj);
			cb(resultObj);
			
		};
	});
/*}*/
};
/*
 *  Display count service stats for Manager
 */

exports.serviceStats = function(req, res, next) {
	
	var queryObj = {};
	var resultObj = {};
	var statsObj = {};
	var service_daterange = {};

	req.query.dealer = req.user.dealer._id;
	//console.log("req make", req.user.dealer.makes);
	

	console.log("queryObj", queryObj);
	if (!req.query.from_date || !req.query.to_date) {
		var from_date = new Date();
		from_date.setDate(from_date.getDate() - 6);
		from_date.setHours(0, 0, 0, 0);
		var to_date = new Date(Date.now());
		to_date.setHours(23, 59, 59, 999);
//		console.log("From and To ==>", from, to);
		service_daterange.$gte = from_date;
		service_daterange.$lte = to_date;
	} else {
		var from_date = new Date(req.query.from_date);
		from_date.setHours(0, 0, 0, 0);
		var to_date = new Date(req.query.to_date);
		to_date.setHours(23, 59, 59, 999);
		service_daterange.$gte = from_date;
		service_daterange.$lte = to_date;
	}
	queryObj.service_date = service_daterange;
	
//	Reports Search count
	
// Search total_maount gt,lt,gt=,lt=
	
	var total = {};

			if (req.query.amount&& req.query.compare&& (req.query.compare == 'gt'
					|| req.query.compare == 'lt'
					|| req.query.compare == 'gte' || req.query.compare == 'lte')) {
				if (req.query.compare == 'gt') {
					total.$gt = parseInt(req.query.amount);
					queryObj.amount = total;
				} else if (req.query.compare == 'lt') {
					total.$lt = parseInt(req.query.amount);
					queryObj.amount = total;
				} else if (req.query.compare == 'gte') {
					total.$gte = parseInt(req.query.amount);
					queryObj.amount = total;
				} else if (req.query.compare == 'lte') {
					total.$lte = parseInt(req.query.amount);
					queryObj.amount = total;
				}
			} else {
				if (req.query.amount) {
					queryObj.amount = parseInt(req.query.amount);
				}
			}

			if (req.query.dealer) {
				queryObj.dealer = new ObjectId(req.query.dealer);
			}

			if(req.query.make){
				queryObj.make = new ObjectId(req.query.make);
			}

			if(req.query.model){
				queryObj.model = new ObjectId(req.query.model);
			}

			if (req.query.branch) {
				queryObj.branch = req.query.branch;
			}
			/*if (req.query.service_type) {
				queryObj['service_details.service_type'] = new ObjectId(req.query.service_type);
			}*/
			
			if (req.query.service_date) {
				queryObj.service_date = new ObjectId(req.query.service_date);
			}
			
			if(req.query.job_status){
				queryObj.job_status = req.query.job_status;
			}
			if(req.query.customer_contact){
				queryObj.customer_contact = req.query.customer_contact;
			}
			if(req.query.customer_name){
				queryObj.customer_name = req.query.customer_name;
			}
			
		//console.log("queryObj..s", queryObj);
		stats(queryObj, req, res, function(data){
			//console.log("table data..//", data.stats_breakdown);
		/* count display on table*/
				var row = [];
				var Value = [];
				var obj = {};
				var chartDates = [];
				var value = data.stats_breakdown;
			  var a = moment(req.query.from_date).format('YYYY/MM/DD');
			  var b = moment(req.query.to_date).format('YYYY/MM/DD');
			  b = moment(b).add('days',1);
			 // console.log("DATE from", a);
			 // console.log("DATE to", b);
			  for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){
			  	chartDates[k] = m.format('YYYY/MM/DD');
			  //	console.log("chartDates", chartDates[k]);
				k++;
			  }

			
			var keys = Object.keys(data.stats_breakdown);
			//console.log("$scope.keys", keys);
			for(var i=0; i< keys.length; i++){
				var key = keys[i];
				var Values = value[keys[i]];

				//console.log("value.",Values);
				row.push(key);
				Value.push(Values);
			}
			//console.log("row../", row);
			//console.log("value../",Value);

			for(var i=0; i< row.length; i++){
				var line_row = [];
				var singleArrayValue = value[row[i]];
				for(var k=0,m=moment(a); m.isBefore(b); m.add('days', 1)){
				var flag =0;
				for(var j=0; j<singleArrayValue.length; j++)	{
					if(m.format('YYYY/M/D') === singleArrayValue[j].date){
						line_row.push(singleArrayValue[j].count);
						k++;
						flag = 1;
					}
				}
				if(flag != 1) {						
						line_row.push(0);							
						k++;
					}
				}
				obj[row[i]] = line_row;

			}
			var FArray = [];
			var FObj = {};
			for(var i=0; i< chartDates.length; i++){
				FObj = {
						date: chartDates[i], 
						scheduled: obj.scheduled_stats[i],
						completed: obj.completed_stats[i],
						pending: obj.pending_service[i],
						total: obj.service_stats[i]
					}
					FArray.push(FObj);
			}
			 data.table_stats = FArray;
			 data.stats_length = FArray.length;

			 var statsLimit = req.query.limit;
			 var statsOffset = req.query.offset;
			 var stats_table = [];
			 var servicelimit = parseInt(statsLimit) + parseInt(statsOffset);
			 var endvalue = servicelimit > data.table_stats.length ?
			 data.table_stats.length : servicelimit; 

			 	var index = 0;
			 	
			 	for(i=statsOffset; i < endvalue; i++){
				stats_table[index] = data.table_stats[i];
				index++;
			}
			 data.table_stats  = stats_table;
			// console.log("data.table_stats", data.table_stats);
					/*var scheduled_stats = FArray;
					var totalServerItems = FArray.length;*/
					/*if (!$$phase) {
						$apply();
					}*/
		/* end */
		sendRsp(res, 200, 'OK', {
			stats : data
		});
	});
	
};


/*
 *  Display user based count service stats
 */

exports.userStats = function(req, res, next) {
	
	var queryObj = {};
	var resultObj = {};
	var statsObj = {};
	var service_daterange = {};

	req.query.dealer = req.user.dealer._id;
	queryObj.user = new ObjectId(req.user._id);
	
	if (!req.query.from_date || !req.query.to_date) {
		var from_date = new Date();
		from_date.setDate(from_date.getDate() - 6);
		from_date.setHours(0, 0, 0, 0);
		var to_date = new Date(Date.now());
		to_date.setHours(23, 59, 59, 999);
//		console.log("From and To ==>", from, to);
		service_daterange.$gte = from_date;
		service_daterange.$lte = to_date;
	} else {
		var from_date = new Date(req.query.from_date);
		from_date.setHours(0, 0, 0, 0);
		var to_date = new Date(req.query.to_date);
		to_date.setHours(23, 59, 59, 999);
		service_daterange.$gte = from_date;
		service_daterange.$lte = to_date;
	}
	queryObj.service_date = service_daterange;
	
//	Reports Search count
	
// Search total_maount gt,lt,gt=,lt=
	
	
	var total = {};

			if (req.query.amount&& req.query.compare&& (req.query.compare == 'gt'
									|| req.query.compare == 'lt'
									|| req.query.compare == 'gte' || req.query.compare == 'lte')) {
								if (req.query.compare == 'gt') {
									total.$gt = parseInt(req.query.amount);
									queryObj.amount = total;
								} else if (req.query.compare == 'lt') {
									total.$lt = parseInt(req.query.amount);
									queryObj.amount = total;
								} else if (req.query.compare == 'gte') {
									total.$gte = parseInt(req.query.amount);
									queryObj.amount = total;
								} else if (req.query.compare == 'lte') {
									total.$lte = parseInt(req.query.amount);
									queryObj.amount = total;
								}
							} else {
								if (req.query.amount) {
									queryObj.amount = parseInt(req.query.amount);
								}
							}


			if (req.query.dealer) {
				queryObj.dealer = req.query.dealer;
			}
			if (req.query.branch) {
				queryObj.branch = req.query.branch;
			}
			if (req.query.service_type) {
				queryObj['service_details.service_type'] = req.query.service_type;
			}
			
			if (req.query.service_date) {
				queryObj.service_date = req.query.service_date;
			}
			if(req.query.make){
				queryObj.make = new ObjectId(req.query.make);
			}

			if(req.query.model){
				queryObj.model = new ObjectId(req.query.model);
			}
			if(req.query.job_status){
				queryObj.job_status = req.query.job_status;
			}
			if(req.query.customer_contact){
				queryObj.customer_contact = req.query.customer_contact;
			}
			if(req.query.customer_name){
				queryObj.customer_name = req.query.customer_name;
			}
	
	console.log("query1",queryObj);
	
	stats(queryObj, res, function(data){
		sendRsp(res, 200, 'OK', {
			stats : data
		});
	});
	
};



//serviceStatus Export Excel
//
exports.serviceStatusExport = function(req, res){
	var queryObj = {};
	var countsObj = {};
	var breakdownObj = {};
	/*var staffName = [];*/
		req.query.dealer = req.user.dealer._id;
	var total = {};

			if (req.query.amount&& req.query.compare&& (req.query.compare == 'gt'
									|| req.query.compare == 'lt'
									|| req.query.compare == 'gte' || req.query.compare == 'lte')) {
								if (req.query.compare == 'gt') {
									total.$gt = parseInt(req.query.amount);
									queryObj.amount = total;
								} else if (req.query.compare == 'lt') {
									total.$lt = parseInt(req.query.amount);
									queryObj.amount = total;
								} else if (req.query.compare == 'gte') {
									total.$gte = parseInt(req.query.amount);
									queryObj.amount = total;
								} else if (req.query.compare == 'lte') {
									total.$lte = parseInt(req.query.amount);
									queryObj.amount = total;
								}
							} else {
								if (req.query.amount) {
									queryObj.amount = parseInt(req.query.amount);
								}
							}
			/*if(req.user.role != "MANAGER"){			
					queryObj.user = new ObjectId(req.user._id);
				}*/
			if (req.query.dealer) {
				queryObj.dealer = new ObjectId(req.query.dealer);
			}
			if (req.query.branch) {
				queryObj.branch = new ObjectId(req.query.branch);
			}
			if(req.query.make){
				queryObj.make = new ObjectId(req.query.make);
			}
			if(req.query.model){
				queryObj.model = new ObjectId(req.query.model);
			}
			if (req.query.user) {
			queryObj.user = new ObjectId(req.query.user);
			}

			if (req.query.service_type) {
				queryObj['service_details.service_type'] = new ObjectId(req.query.service_type);
			}
			
			if (req.query.service_date) {
				queryObj.service_date = req.query.service_date;
			}
			
			if(req.query.status){
				queryObj.status = req.query.status;
			}
			if(req.query.customer_contact){
				queryObj.customer_contact = req.query.customer_contact;
			}
			if(req.query.customer_name){
				queryObj.customer_name =  req.query.customer_name;
			}
		
 	if (req.query.from_date && req.query.to_date) {
		var service_daterange = {};
		var from_date = new Date(req.query.from_date);
		from_date.setHours(0, 0, 0, 0);
		var to_date = new Date(req.query.to_date);
		to_date.setHours(23, 59, 59, 999);
		service_daterange.$gte = from_date;
		service_daterange.$lte = to_date;

		queryObj.service_date = service_daterange;
	}

	stats(queryObj,req, res, function(data){
		var serivceStatusRsp = data.ServiceStatus;
		console.log("serivceStatusRsp", serivceStatusRsp);
		serivceStatusRsp.name.push('Total');
		serivceStatusRsp.count.push(data.total_service);
				
			var Dates = [];		
			var rspKey = [];
			var rspValue = [];
			var Data = [];
			var value = data.stats_breakdown;
			var arrayOne = ["Date"];
			var obj = {};
			var a = moment(req.query.from_date).format('YYYY/MM/DD');
			var b = moment(req.query.to_date).format('YYYY/MM/DD');	
			b = moment(b).add('days',1);					
			for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){
				 Dates[k] = m.format('YYYY/MM/DD');
				 k++;
			}	
			console.log("data status", data.status);
			if(data.status){
				var headingArr = arrayOne.concat(data.status);			
			}else{
			var headingArr = ['Date', 'Total',  'Scheduled', 'Payment_Due', 'Paid'];
			}
																			
			var keys = Object.keys(data.stats_breakdown);
			for(var i = 0; i < keys.length ; i++ ){						
				var Key = keys[i];
				var Value = value[keys[i]];							
				rspKey.push(Key);
				rspValue.push(Value);
			}
			console.log("rspKey..", rspKey);
			console.log("rspValue..", rspValue);
			for(var i=0; i < rspKey.length; i++){
				var line_row = [];										
				var singleArrayValue = value[rspKey[i]];										
				for(var k=0,m = moment(a); m.isBefore(b); m.add('days',1)){	
					var flag = 0;											
					for(var j = 0 ; j < singleArrayValue.length; j++) {												
						if(m.format('YYYY/M/D') === singleArrayValue[j].date) {																				
							line_row.push(singleArrayValue[j].count);							
							k++;
							flag = 1;
						}
					}
					if(flag != 1) {						
						line_row.push(0);							
						k++;
					}
				}	
							
				obj[rspKey[i]] = line_row;
			} 
			console.log("Data :", obj);
			console.log("Date :", Dates);

			var data = [["Service Module"],[],["Service Status"],serivceStatusRsp.name, serivceStatusRsp.count
			           ,[],headingArr];	
			   
			for(var i=0; i < Dates.length; i++){
				var singleRow = [];
				singleRow.push(Dates[i]);
				var total = 0;
				for(var j=0; j < rspKey.length; j++){
					var arr = obj[rspKey[j]];					
					singleRow.push(arr[i]);
					total = total + arr[i];					
				}				
				
				data.push(singleRow);
			}
			console.log("data :", data);
			
			var ws_name = "serviceStatusReport";
			
			var wscols = [{wch:20},{wch:20},{wch:20},{wch:20}];	
			var wsmerge = [{s:{c:0,r:0},e:{c:3,r:0}}];
			
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
			
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = ws;
			
			ws['!cols'] = wscols;
			ws['!merges'] = wsmerge;
			
			var wopts = { bookType:'xlsx', bookSST:true, type:'binary' };
			var wbBuf = XLSX.write(wb, wopts);
			sendRsp(res, 200, 'Success', wbBuf);
		});	
				
};


/**
 * Authentication serviceback
 */
exports.authServiceback = function(req, res, next) {
	res.redirect('/');
};

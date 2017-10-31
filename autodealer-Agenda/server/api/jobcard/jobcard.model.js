'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate  = require('mongoose-deep-populate');

//JobCard Schema

var JobCardSchema = new Schema({
	job_card_no			: {type:Number, unique: true, required: true},
	customer_vehicle	: {type: Schema.Types.ObjectId, ref:'CustomerVehicle', required: true},
	branch				: {type: String, required: true},
	mileage				: {type: Number},
	fuel				: {type: Number},
	service_date		: {type: Date, Index: true},
	pick_up				: {type: String, enum: ['Y','N'], required: true},
	drop				: {type: String, enum: ['Y','N'], required: true},
	comments			: {type: String},
	job_status			: {type: String, enum: [ 'SCHEDULED','INPROGRESS', 
							'PAYMENT_DUE','PAID'], required: true, index: true},
	job_card			: [{
							desc	: {type: String},
							comments: {type: String}
						}],
	parts				: {
					 		items: [{
								no		: {type: String},
								desc	: {type: String},
								qty 	: {type: Number},
								rate 	: {type: Number},
								amt 	: {type: Number}
							}],
							discount 	: {type: Number},
							discount_amt: {type: Number},
							tax			: {type: Number},
							tax_amt		: {type: Number},
							total 		: {type: Number}				
						},
	labour_charges		: {
							items: [{						
								desc	: {type: String},					
								rate 	: {type: Number}
							}],
							discount	: {type: Number},
							discount_amt: {type: Number},
							tax			: {type: Number},
							tax_amt		: {type: Number},
							total 		: {type: Number}
						},
	accessories			: {
							items: [{
								no		: {type: String},	
								desc	: {type: String},					
								rate 	: {type: Number}
							}],
							discount 	: {type: Number},
							discount_amt: {type: Number},
							tax			: {type: Number},
							tax_amt		: {type: Number},
							total 		: {type: Number}
						},
	misc_charges		: {
							items: [{						
								desc	: {type: String},					
								rate 	: {type: Number}
							}],
							discount 	: {type: Number},
							discount_amt: {type: Number},
							tax			: {type: Number},
							tax_amt		: {type: Number},
							total 		: {type: Number}
						},	
	completed_on 		: {type: Date},	
	scheduled_at		: {type: Date},
	total_amt			: {type: Number, index: true},
	dealer				: {type: Schema.Types.ObjectId, ref:'Dealer', required: true},	
	feedback			: {type: String},
	post_service_complaints : [{
								desc		: {type: String},
								comments	: {type: String},
								status 		: {type: String},
								resolve_date: {type: Date}
						}],
	customer_rating		: {type: Number},
	next_service_date	: {type: Date},
	customer			: {type: Schema.Types.ObjectId, ref:'Customer', required: true},
	make				: {type: Schema.Types.ObjectId, required:true},
	model 				: {type: Schema.Types.ObjectId, required: true}	
}).plugin(deepPopulate);


var JobCardModel = mongoose.model('JobCard', JobCardSchema);
module.exports = JobCardModel;

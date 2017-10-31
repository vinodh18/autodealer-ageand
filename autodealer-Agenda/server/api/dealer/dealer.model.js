'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate  = require('mongoose-deep-populate');

//Dealer Schema

var DealerSchema = new Schema({
	name 			: {type: String, required: true, index: true},
	email 			: {type: String},
	phone 			: [{type: String, required: true, index: true}],
	website 		: {type: String, index: true},
	unique_feature 	: [{type: String}],
	plan 			: {type: Schema.Types.ObjectId, ref:'Plan',required: true},	
	branches 		: [{
						branch_code : {type: String, required: true, unique: true},
						address : {
							line1 : {type: String},
							line2 : {type: String},
							city  : {type: String,  index: true},
							zip   : {type: Number,  index: true}
						},
						name  : {type: String, required: true, index: true},
						phone : [{type: String, required: true, index: true}],
						email : {type: String},
						working_hours : [{
							start : {type: Date}, 
							end   : {type: Date}
						}],
						serviceable_vehicles: [{
							vehicle_type : {type: Schema.Types.ObjectId, ref:'VehicleType',required: true}	
						}],						
						latitude: {type: Number},
						longitude: {type: Number}		
					 }],	
	currency 		: {
						code 		: {type: String, index: true},
						numeric_code: {type: Number, index: true},
						name		: {type: String, index: true},
						decimals	: {type: String}
					 },
	timezone 		: {type: String},
	makes			: [{ 
						name	: {type: String, required: true},
						img_url : {type: String},
						models 	: [{
									name    : {type: String},
									img_url : {type: String}
								}]
						}],
	taxes 			: [{
						name 		: {type: String, required: true, index: true},
						percentage  : {type: Number, required: true},
						no 			: {type: String}
						}],
	parts_tax 		: {type: Schema.Types.ObjectId},
	labour_tax 		: {type: Schema.Types.ObjectId},
	accessories_tax : {type: Schema.Types.ObjectId},	
	image_url 		: {type: String},
	logo 			: {type: String}
}).plugin(deepPopulate);


var DealerModel = mongoose.model('Dealer', DealerSchema);
module.exports = DealerModel;

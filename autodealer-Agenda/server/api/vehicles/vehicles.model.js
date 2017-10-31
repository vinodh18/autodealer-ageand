'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate    = require('mongoose-deep-populate');

//Vehicles Schema

var VehiclesSchema = new Schema({	
	dealer				: {type: Schema.Types.ObjectId, ref:'Dealer', required:true},
	year				: {type: Date},
	image				: {type: String},
	on_road_price		: {type: Number},
	ex_showroom_price	: {type: Number},
	rto 				: {type: Number},
	insurance 			: {type: Number},
	fuel_type			: {type: String, enum: ['PETROL', 'DIESEL'], required: true},
	seat_capacity		: {type: Number},
	image_url 			: {type: String},
	make				: {type: Schema.Types.ObjectId, index:true, required:true},
	model 				: {type: Schema.Types.ObjectId, index: true, required:true}
}).plugin(deepPopulate);


var VehiclesModel = mongoose.model('Vehicle', VehiclesSchema);
module.exports = VehiclesModel;

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Customervehicles Schema

var CustomerVehiclesSchema = new Schema({
	customer			  : {type: Schema.Types.ObjectId, ref:'Customer', required:true, index: true},
	vehicle_type    	  : {type: Schema.Types.ObjectId, ref:'VehicleType', required:true, index: true},	
	chassis_no	  		  : {type: String},
	engine_no	 	 	  : {type: String},
	year				  : {type: Date},
	purchase_date 	   	  : {type: Date, required:true, index: true},
	reg_no				  : {type: String, required: true, index: true},
	insurance_expiry_date : {type: Date},	
	warranties			  : {
								warranty_type : {type: Schema.Types.ObjectId, ref:'WarrantyType', required:true, index: true},
								from		  : {type: Date, required:true},
								to 			  : {type: Date, required: true}
							},
	make				  : {type: Schema.Types.ObjectId},
	model 				  : {type: Schema.Types.ObjectId}						
});

CustomerVehiclesSchema.index({reg_no: 1}, {unique: true});

var CustomerVehiclesModel = mongoose.model('CustomerVehicle', CustomerVehiclesSchema);
module.exports = CustomerVehiclesModel;

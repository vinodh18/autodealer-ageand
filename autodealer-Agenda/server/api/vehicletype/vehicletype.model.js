'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Vehicletype Schema

var VehicleTypeSchema = new Schema({
	name	: {type: String, required: true},
	dealer	: {type: Schema.Types.ObjectId, ref:'Dealer', required: true}
});

var VehicleTypeModel = mongoose.model('VehicleType', VehicleTypeSchema);
module.exports = VehicleTypeModel;

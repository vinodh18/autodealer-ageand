'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LabourChargeSchema = new Schema({
	desc 	: 	{type: String},
	dealer	: 	{type: Schema.Types.ObjectId, ref:'Dealer'},
	rates	: 	[{
					branch: {type: String},
					rate: {type: Number}
				}]
});

module.exports = mongoose.model('LabourCharge', LabourChargeSchema);
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PartSchema = new Schema({
	no 		: 	{type: String},
	group	: 	{type: Schema.Types.ObjectId, ref:'PartsGroup', required: true},
	dealer	: 	{type: Schema.Types.ObjectId, ref:'Dealer'},
	qty		: 	{type: Number},	
	units	: 	{type: String, enum: ['NOS','FT','INCH','GR','KG','MTR',
					'CM','MM','LTR'], required: true},
	rates	: 	[{
					branch: {type: String},
					rate: {type: Number}
				}]
});

module.exports = mongoose.model('Part', PartSchema);
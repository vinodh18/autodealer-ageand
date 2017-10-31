'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//WarrantyType Schema

var WarrantytypeSchema = new Schema({
	name	: {type: String, required: true, index: true},
	dealer	: {type: Schema.Types.ObjectId, ref:'Dealer', required: true},
	desc	: {type: String},
	period	:{
				n 	 : {type: Number, required: true},
				unit : {type: String, enum:['MONTH', 'YEAR'], required: true}
			}
	});

var WarrantytypeModel = mongoose.model('WarrantyType', WarrantytypeSchema);
module.exports = WarrantytypeModel;

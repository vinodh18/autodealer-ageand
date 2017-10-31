'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Customer Schema

var CustomerSchema = new Schema({
	name				: {type: String, required: true, index: true},
	email				: {type: String},
	phone				: [{type: String, required: true, index: true}],
	address				: {type: String},
	dealer 				: {type: Schema.Types.ObjectId, ref:'Dealer'}
});


var CustomerModel = mongoose.model('Customer', CustomerSchema);
module.exports = CustomerModel;

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmailTemplateSchema = new Schema({
	name		:	{type: String, required: true, index: true},
	subject		: 	{type: String, required: true},
	body		: 	{type: String, required: true},	
	dealer 		: 	{type: Schema.Types.ObjectId, ref:'Dealer'},
	created_at	: 	{type: Date},
	updated_at	:	{type: Date} 
});

module.exports = mongoose.model('EmailTemplate', EmailTemplateSchema);
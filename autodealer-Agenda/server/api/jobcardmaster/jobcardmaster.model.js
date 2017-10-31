'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var JobCardMasterSchema = new Schema({
	desc	: 	{type: String, required: true},
	dealer	: 	{type: Schema.Types.ObjectId, ref:'Dealer', required: true},
	sort_no : 	{type: Number},
	types	: 	[{type: String}]
});

module.exports = mongoose.model('JobCardMaster', JobCardMasterSchema);
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Ads Media Schema

var NewsEventsSchema = new Schema({
	event_name		: {type: String, required: true, index: true},
	dealer			: {type: Schema.Types.ObjectId, ref:'Dealer'},
	branch			: {type: String, required: true},
	address			: {type: String},
	from			: {type: Date},
	to				: {type: Date},
	description		: {type: String},
	latitude		: {type: Number},
	longitude		: {type: Number},
	image_url 		: {type: String},
	thumbnail_url	: {type: String}
});


var NewsEventsModel = mongoose.model('NewsEvent', NewsEventsSchema);
module.exports = NewsEventsModel;

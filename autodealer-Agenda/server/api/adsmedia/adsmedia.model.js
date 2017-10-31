'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Ads Media Schema

var AdsmediaSchema = new Schema({
	title			: {type: String, required: true, index: true},
	description		: {type: String},
	youtube_id		: {type: String},
	dealer			: {type: Schema.Types.ObjectId, ref:'Dealer', required: true},
	type			: {type: String, enum: ['IMAGE', 'VIDEO'], required: true},
	image_url 		: {type: String},
	thumbnail_url	: {type: String}
});

var AdsmediaModel = mongoose.model('Adsmedia', AdsmediaSchema);
module.exports = AdsmediaModel;

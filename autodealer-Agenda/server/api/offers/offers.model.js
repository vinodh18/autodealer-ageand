'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//offers Schema

var OffersSchema = new Schema({
	name			: {type: String, required: true, index: true},
	dealer			: {type: Schema.Types.ObjectId, ref:'Dealer', required: true},
	branch			: {type: String, required: true},
	from			: {type: Date},
	to				: {type: Date},
	description		: {type: String},
	image			: {type: String},
	image_url 		: {type: String}
});

var OffersModel = mongoose.model('Offer', OffersSchema);
module.exports = OffersModel;

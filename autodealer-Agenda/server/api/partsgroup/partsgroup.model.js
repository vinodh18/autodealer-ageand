'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var deepPopulate  = require('mongoose-deep-populate');

var PartsGroupSchema = new Schema({
	no 		:	{type: String},
	dealer	: 	{type: Schema.Types.ObjectId, ref:'Dealer', required: true},
	desc	: 	{type: String}
}).plugin(deepPopulate);

module.exports = mongoose.model('PartsGroup', PartsGroupSchema);
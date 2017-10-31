'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var AppClientSchema = new Schema({
	secret : {
		type : String,
		required : true
	},
	name : {
		type : String,
		required : true,
		unique: true
	},
	type : {
		type : String,
		enum : [ 'JSAPP', 'WEBAPP', 'M_IOS', 'M_ANDROID' ],
		required : true
	}
});

module.exports = mongoose.model('AppClient', AppClientSchema);
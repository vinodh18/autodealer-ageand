'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Devicetoken Schema

var DeviceTokenSchema = new Schema({
	user	: {type: Schema.Types.ObjectId, index: true, ref:'User'},
	device 	: [{
				device_type: {type: String, enum:["ANDROID", "IOS"]},
				dev_token : {type: String}
			  }]

	});



var DeviceTokenModel = mongoose.model('DeviceToken', DeviceTokenSchema);
   module.exports = DeviceTokenModel;

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var deepPopulate  = require('mongoose-deep-populate');
//user Schema

var UserSchema = new Schema({
	name		: {type: String, required: true, index: true},
	username	: {type: String, required: true},
	email		: {type: String, required: true },
	hashed_password		: {type: String, required: true},
	salt		: {type: String, required: true},
	role 		: {type: String, enum: ['SUPER_ADMIN','DEALER_ADMIN','BRANCH_ADMIN','CUSTOMER', 'STAFF', 'MANAGER'], required: true, index: true},
	tokens		: [{
					appClient : { type : Schema.Types.ObjectId, ref:'AppClient', required : true},
					refreshToken : {type: String}
			  	}],
	dealer  	: {type: Schema.Types.ObjectId, ref:'Dealer'},		
	image_url	: {type: String},
	branch		: {type: String},
	base 		: {type: String, enum: ['Y','N'], default: 'N'}
});

UserSchema.index({username: 1, email: 1}, {unique: true});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
	this._password = password;
	this.salt = this.makeSalt();	
	this.hashed_password = this.encryptPassword(password);
}).get(function() {
	return this._password;
});

// Validate empty email
UserSchema.path('email').validate(function(email) {
	return email.length;
}, 'Email cannot be blank');

// Validate empty password
UserSchema.path('hashed_password').validate(function(hashedPassword) {
	return hashedPassword.length;
}, 'Password cannot be blank');

 
var validatePresenceOf = function(value) {
	return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
	if (!this.isNew)
		return next();

	if (!validatePresenceOf(this.hashed_password))
		next(new Error('Invalid password'));
	next();	
});

/**
 * Methods
 */
UserSchema.methods = {
	/**
	 * Authenticate - check if the passwords are the same
	 * 
	 * @param {String}
	 *            plainText
	 * @return {Boolean}
	 * @api public
	 */
	authenticate : function(plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},

	/**
	 * Make salt
	 * 
	 * @return {String}
	 * @api public
	 */
	makeSalt : function() {
		return crypto.randomBytes(16).toString('base64');
	},

	/**
	 * Encrypt password
	 * 
	 * @param {String}
	 *            password
	 * @return {String}
	 * @api public
	 */
	encryptPassword : function(password) {
		if (!password || !this.salt)
			return '';
		var saltWithEmail = new Buffer(this.salt + this.email.toString('base64'), 'base64');
		return crypto.pbkdf2Sync(password, saltWithEmail, 10000, 64).toString('base64');
	}
};

UserSchema.plugin(deepPopulate);

var UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;

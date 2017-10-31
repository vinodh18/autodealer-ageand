'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

var baseUrl = process.env.AUTH_BASE_URL || "http://localhost:9003";
// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9003, 

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
  //  session: 'autodealer-secret'
    globalAccessToken : process.env.GLOBAL_ACCESS_TOKEN_SECRET || 'global-access-token-secret',  
    accessToken       : process.env.ACCESS_TOKEN_SECRET || 'access-token-secret',
    refreshToken      : process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret',
    refTokenKey       : process.env.REFRESH_TOKEN_KEY_SECRET ||'refresh-token-key'
  },
  token : {
    expiresInMinutes : 300
  },
  auth: {
    //appId             : process.env.APP_ID || '54e58eded06f8b9a09d880a0',
    clientId          : process.env.CLIENT_ID || '562dcf63b82f66b81bcb34dd',
    clientSecret      : process.env.CLIENT_SECRET || '/7p38PTM+hxJ/3fWzm2aMfMHkH61qWAIZOF2qXmb/Kg=',
    url               : baseUrl + "/auth/token"
    //createUserURL     : baseUrl + "/api/users",
    //addAppInUser      : baseUrl + "/api/users/%s/apps",
    //removeAppInUser   : baseUrl + "/api/users/%s/apps",
    //changePassword    : baseUrl + "/api/users/change/password",
    //changeName        : baseUrl + "/api/users/change/name",
    //changeImage       : baseUrl + "/api/users/change/image",
    //checkUsername     : baseUrl + "/api/users/check/username",
    //checkEmail        : baseUrl + "/api/users/check/email"
  },
  s3FileUpload: {
    keyId: process.env.S3_KEY_ID || "AKIAJJOT3FON3E375MPA",
    secret: process.env.S3_SECRET || "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",
    bucket: process.env.S3_BUCKET || "ibcapps-test",
    keyPath: "users/imgs/",
    DealerkeyPath: "autodealer/imgs/dealers/",
    OfferskeyPath: "autodealer/imgs/offers/",
    VehicleskeyPath : "autodealer/imgs/vehicles/",
    AdsMediakeyPath : "autodealer/imgs/adsmedia",
    AdsMediakeyThumbKeyPath : "autodealer/imgs/adsmedia/thumbnails/",
    NewsEventsPath : "autodealer/imgs/events",
    NewsEventsThumbkeyPath :  "autodealer/imgs/events/thumbnails"
  },
  
  transporter: {
    service: "gmail",
    username: "iocapp12345@gmail.com",
    password: "ibytecode"
  },

  // List of user roles
  userRoles: ['MANAGER', 'STAFF', 'CUSTOMER'],
  globalRowsLimit: 50,
  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});

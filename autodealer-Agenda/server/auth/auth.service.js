'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
//var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var deepPopulate = require('mongoose-deep-populate');
var validateJwt = expressJwt({ secret: config.secrets.accessToken });
var globalValidateJwt = expressJwt({ secret: config.secrets.globalAccessToken });
/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {      
      User.findOne({"email" : req.user.email}, '-tokens')
      .deepPopulate('dealer dealer.plan')
      .exec(function (err, user) {                
        if (err) return next(err);
        if (!user) return res.send(401);        

        req.user = user;        
        next();
      });
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === roleRequired) {
    	   next();
      }
      else {
        res.send(403);
      }
    });
}

function isBranchAdminORManager() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "BRANCH_ADMIN" || req.user.role == "MANAGER") {
         next();
      }
      else {
        res.send(403);
      }
    });
}

function isDealerORManagerORBranchAdminORStaff() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "DEALER_ADMIN" || req.user.role == "MANAGER" 
          || req.user.role === "BRANCH_ADMIN" || req.user.role === "STAFF") {
         next();
      }
      else {
        res.send(403);
      }
    });
}

function isDealerORManagerORBranchAdminORStaffisCustomer() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "DEALER_ADMIN" || req.user.role == "MANAGER" 
          || req.user.role === "BRANCH_ADMIN" || req.user.role === "STAFF" 
          || req.user.role === "CUSTOMER") {
         next();
      }
      else {
        res.send(403);
      }
    });
}

function isSuperAdminORDealerORManagerORBranchAdminORStaff() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "SUPER_ADMIN" || req.user.role === "DEALER_ADMIN"
           || req.user.role == "MANAGER" || req.user.role === "BRANCH_ADMIN" 
           || req.user.role === "STAFF") {
         next();
      }
      else {
        res.send(403);
      }
    });
}

function isSuperAdminORDealer() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "SUPER_ADMIN" || req.user.role === "DEALER_ADMIN") {
         next();
      }
      else {
        res.send(403);
      }
    });
}

function isSuperAdminORDealerORManager() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "SUPER_ADMIN" || req.user.role === "DEALER_ADMIN"
          || req.user.role === "MANAGER") {
         next();
      }
      else {
        res.send(403);
      }
    });
}

function isDealerORBranch() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "DEALER_ADMIN" || req.user.role === "BRANCH_ADMIN") {
         next();
      }
      else {
        res.send(403);
      }
    });
}

function isDealerORManagerORBranch() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "DEALER_ADMIN" || req.user.role === "MANAGER" ||
        req.user.role === "BRANCH_ADMIN") {
         next();
      }
      else {
        res.send(403);
      }
    });
}

function isDealerORManager() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "DEALER_ADMIN" || req.user.role === "MANAGER") {
         next();
      }
      else {
        res.send(403);
      }
    });
}


function isDealerORManagerORCustomer() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "DEALER_ADMIN" || req.user.role === "MANAGER" ||
        req.user.role === "CUSTOMER") {
         next();
      }
      else {
        res.send(403);
      }
    });
}


function isSuperAdmin() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "SUPER_ADMIN") {
         next();
      }
      else {
        res.send(403);
      }
    });
}


function isDealerAdmin() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "DEALER_ADMIN") {
         next();
      }
      else {
        res.send(403);
      }
    });
}

function isBranchAdmin() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "BRANCH_ADMIN") {
         next();
      }
      else {
        res.send(403);
      }
    });
}

function isCustomer() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "CUSTOMER") {
         next();
      }
      else {
        res.send(403);
      }
    });
}

function isStaff() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "STAFF") {
         next();
      }
      else {
        res.send(403);
      }
    });
}

function isManager() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "MANAGER") {
         next();
      }
      else {
        res.send(403);
      }
    });
}

function isManagerORCustomer() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role === "CUSTOMER" || req.user.role === "MANAGER") {
         next();
      }
      else {
        res.send(403);
      }
    });
}

function isManagerORStaff() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role == "MANAGER" || req.user.role === "STAFF") {
         next();
      }
      else {
        res.send(403);
      }
    });
}

function isManagerORStaffORCustomer() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user.role == "MANAGER" || req.user.role === "STAFF" || req.user.role === "CUSTOMER") {
         next();
      }
      else {
        res.send(403);
      }
    });
}


/**
 * Returns a jwt token signed by the app secret
 */
/*function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
}
*/
/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.'});
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}


function hasGlobalRole(roleRequired){
  if (!roleRequired) throw new Error('Required role needs to be set');  
  return compose()
  .use(function (req, res, next) {
      if(req.query && req.query.hasOwnProperty('global_access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.global_access_token;
      }
      globalValidateJwt(req, res, next);
    })
  .use(function(req, res, next) {
    console.log("auth req user", req.user);
    if (req.user.role === roleRequired) {
         next();
      }
      else {
        res.send(403);
      }
  });  
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.isBranchAdminORManager = isBranchAdminORManager;
exports.isDealerORManagerORBranchAdminORStaff = isDealerORManagerORBranchAdminORStaff;
exports.isSuperAdmin = isSuperAdmin;
exports.isDealerAdmin = isDealerAdmin;
exports.isBranchAdmin = isBranchAdmin;
exports.isCustomer = isCustomer;
exports.isStaff = isStaff;
exports.isManager = isManager;
exports.isManagerORCustomer = isManagerORCustomer;
exports.isManagerORStaff = isManagerORStaff;
exports.isManagerORStaffORCustomer = isManagerORStaffORCustomer;
exports.isDealerORManagerORBranchAdminORStaffisCustomer = isDealerORManagerORBranchAdminORStaffisCustomer;
exports.isSuperAdminORDealerORManagerORBranchAdminORStaff = isSuperAdminORDealerORManagerORBranchAdminORStaff;
exports.isSuperAdminORDealer = isSuperAdminORDealer;
exports.isSuperAdminORDealerORManager = isSuperAdminORDealerORManager
exports.isDealerORBranch = isDealerORBranch;
exports.isDealerORManagerORBranch = isDealerORManagerORBranch;
exports.isDealerORManagerORCustomer = isDealerORManagerORCustomer;
exports.isDealerORManager = isDealerORManager;
exports.hasGlobalRole = hasGlobalRole;
/*exports.isManagerORSales = isManagerORSales;
exports.isManagerORStaffORCustomerOREngineer = isManagerORStaffORCustomerOREngineer;
exports.isManagerORCustomer = isManagerORCustomer;
exports.isCustomerORStaffOREngineer = isCustomerORStaffOREngineer;
exports.isManagerORStaffOREngineer = isManagerORStaffOREngineer;
exports.isManagerORSalesORCustomer = isManagerORSalesORCustomer;*/
//exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
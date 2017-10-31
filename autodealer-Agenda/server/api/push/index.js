'use strict';

var express = require('express');
var controller = require('./register.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

 router.post('/ios/register', auth.isAuthenticated(), controller.create);
 router.post('/android/register', auth.isAuthenticated(), controller.Androidcreate);
  
module.exports = router;
'use strict';

var express = require('express');
var controller = require('./auth.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/login', controller.login);
router.post('/refresh-token', controller.refreshToken);
router.post('/logout', auth.isAuthenticated(),controller.logout);

module.exports = router;
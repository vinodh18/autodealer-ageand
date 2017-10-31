'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var User = require('../api/user/user.model');

var oauth = require('./oauth2');

module.exports = oauth.token;